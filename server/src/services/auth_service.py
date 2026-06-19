import logging
import uuid
from datetime import datetime, timedelta, timezone

from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.security import hash_password, verify_password, create_access_token, create_refresh_token, verify_token
from src.models import User, UserRole, Role, RefreshToken, OTP
from src.utils.otp import generate_otp, verify_otp
from src.utils.exceptions import UnauthorizedException, NotFoundException, BadRequestException
from src.services.email_service import EmailService
from src.config import settings

logger = logging.getLogger(__name__)

_MAX_OTP_ATTEMPTS = 5


def _now() -> datetime:
    return datetime.now(timezone.utc)


class AuthService:
    @staticmethod
    async def register(db: AsyncSession, data: dict) -> dict:
        stmt = select(User).where(User.email == data["email"])
        result = await db.execute(stmt)
        if result.scalar_one_or_none():
            raise BadRequestException("Email already registered")

        user = User(
            email=data["email"],
            password=hash_password(data["password"]),
            name=data["name"],
            phone=data.get("phone"),
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

        role_stmt = select(Role).where(Role.name == "PUBLIC")
        role_result = await db.execute(role_stmt)
        public_role = role_result.scalar_one_or_none()
        if public_role:
            db.add(UserRole(user_id=user.id, role_id=public_role.id))
            await db.commit()

        otp_code = generate_otp()
        db.add(OTP(
            email=user.email,
            code=otp_code,
            purpose="VERIFY_EMAIL",
            expires_at=_now() + timedelta(minutes=10),
            user_id=user.id,
        ))
        await db.commit()

        try:
            await EmailService.send_verification_email(user.email, otp_code)
        except Exception as exc:
            logger.error("[AUTH] OTP email failed for %s: %s: %s", user.email, type(exc).__name__, exc)

        return await AuthService._generate_tokens(db, user)

    @staticmethod
    async def login(db: AsyncSession, email: str, password: str) -> dict:
        stmt = select(User).where(User.email == email)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()

        if not user or not verify_password(password, user.password):
            raise UnauthorizedException("Invalid email or password")
        if user.is_banned:
            raise UnauthorizedException("Your account has been suspended")
        if not user.is_email_verified:
            raise UnauthorizedException("Please verify your email before logging in")

        return await AuthService._generate_tokens(db, user)

    @staticmethod
    async def refresh_token(db: AsyncSession, refresh_token_str: str) -> dict:
        payload = verify_token(refresh_token_str, token_type="refresh")
        if not payload:
            raise UnauthorizedException("Invalid refresh token")

        stmt = select(RefreshToken).where(RefreshToken.token == refresh_token_str)
        result = await db.execute(stmt)
        token_record = result.scalar_one_or_none()

        if not token_record or token_record.expires_at < _now():
            raise UnauthorizedException("Refresh token expired or revoked")

        user_result = await db.execute(select(User).where(User.id == token_record.user_id))
        user = user_result.scalar_one_or_none()
        if not user or user.is_banned:
            raise UnauthorizedException("User not found or banned")

        await db.delete(token_record)
        await db.commit()

        return await AuthService._generate_tokens(db, user)

    @staticmethod
    async def verify_email(db: AsyncSession, email: str, otp_code: str) -> None:
        user_result = await db.execute(select(User).where(User.email == email))
        user = user_result.scalar_one_or_none()
        if not user:
            raise NotFoundException("User not found")

        otp_result = await db.execute(
            select(OTP).where(OTP.email == email, OTP.purpose == "VERIFY_EMAIL", OTP.used == False)
            .order_by(OTP.expires_at.desc())
        )
        otp_record = otp_result.scalar_one_or_none()

        if not otp_record or otp_record.expires_at < _now():
            raise BadRequestException("OTP expired or invalid")

        if otp_record.failed_attempts >= _MAX_OTP_ATTEMPTS:
            otp_record.used = True
            await db.commit()
            raise BadRequestException("Too many incorrect attempts. Please request a new OTP.")

        if not verify_otp(otp_record, otp_code):
            otp_record.failed_attempts += 1
            await db.commit()
            remaining = _MAX_OTP_ATTEMPTS - otp_record.failed_attempts
            raise BadRequestException(f"Invalid OTP. {remaining} attempt(s) remaining.")

        otp_record.used = True
        user.is_email_verified = True
        await db.commit()

        try:
            await EmailService.send_welcome_email(user.email, user.name)
        except Exception as exc:
            logger.warning("[AUTH] Welcome email failed for %s: %s", user.email, exc)

    @staticmethod
    async def resend_otp(db: AsyncSession, email: str, purpose: str) -> None:
        if purpose not in ("VERIFY_EMAIL", "RESET_PASSWORD"):
            raise BadRequestException("Invalid OTP purpose")

        user_result = await db.execute(select(User).where(User.email == email))
        user = user_result.scalar_one_or_none()
        if not user:
            return  # Don't reveal whether the email exists

        if purpose == "VERIFY_EMAIL" and user.is_email_verified:
            raise BadRequestException("Email is already verified")

        now = _now()
        recent_result = await db.execute(
            select(OTP)
            .where(OTP.email == email, OTP.purpose == purpose, OTP.used == False)
            .order_by(OTP.expires_at.desc())
        )
        recent_otp = recent_result.scalar_one_or_none()

        if recent_otp and recent_otp.expires_at > now:
            remaining = (recent_otp.expires_at - now).total_seconds()
            if remaining > 540:  # created < 60s ago
                wait = int(remaining - 540)
                raise BadRequestException(f"Please wait {wait} seconds before requesting another OTP")

            old_result = await db.execute(
                select(OTP).where(OTP.email == email, OTP.purpose == purpose, OTP.used == False)
            )
            for old in old_result.scalars().all():
                old.used = True
            await db.commit()

        otp_code = generate_otp()
        db.add(OTP(
            email=email,
            code=otp_code,
            purpose=purpose,
            expires_at=_now() + timedelta(minutes=10),
            user_id=user.id,
        ))
        await db.commit()

        try:
            if purpose == "VERIFY_EMAIL":
                await EmailService.send_verification_email(email, otp_code)
            elif purpose == "RESET_PASSWORD":
                await EmailService.send_password_reset_email(email, otp_code)
        except Exception:
            logger.warning("[AUTH] Resend OTP email failed for %s", email)

    @staticmethod
    async def forgot_password(db: AsyncSession, email: str) -> None:
        user_result = await db.execute(select(User).where(User.email == email))
        user = user_result.scalar_one_or_none()
        if not user:
            return  # Don't reveal if email exists

        otp_code = generate_otp()
        db.add(OTP(
            email=email,
            code=otp_code,
            purpose="RESET_PASSWORD",
            expires_at=_now() + timedelta(minutes=10),
            user_id=user.id,
        ))
        await db.commit()
        try:
            await EmailService.send_password_reset_email(email, otp_code)
        except Exception:
            logger.warning("[AUTH] Password reset email failed for %s", email)

    @staticmethod
    async def reset_password(db: AsyncSession, email: str, otp_code: str, new_password: str) -> None:
        user_result = await db.execute(select(User).where(User.email == email))
        user = user_result.scalar_one_or_none()
        if not user:
            raise NotFoundException("User not found")

        otp_result = await db.execute(
            select(OTP).where(OTP.email == email, OTP.purpose == "RESET_PASSWORD", OTP.used == False)
            .order_by(OTP.expires_at.desc())
        )
        otp_record = otp_result.scalar_one_or_none()

        if not otp_record or otp_record.expires_at < _now():
            raise BadRequestException("OTP expired")

        if otp_record.failed_attempts >= _MAX_OTP_ATTEMPTS:
            otp_record.used = True
            await db.commit()
            raise BadRequestException("Too many incorrect attempts. Please request a new OTP.")

        if not verify_otp(otp_record, otp_code):
            otp_record.failed_attempts += 1
            await db.commit()
            remaining = _MAX_OTP_ATTEMPTS - otp_record.failed_attempts
            raise BadRequestException(f"Invalid OTP. {remaining} attempt(s) remaining.")

        otp_record.used = True
        user.password = hash_password(new_password)
        # Invalidate all existing refresh tokens so attacker sessions are terminated
        await db.execute(delete(RefreshToken).where(RefreshToken.user_id == user.id))
        await db.commit()

    @staticmethod
    async def change_password(db: AsyncSession, user_id: uuid.UUID, current_password: str, new_password: str) -> None:
        user_result = await db.execute(select(User).where(User.id == user_id))
        user = user_result.scalar_one_or_none()
        if not user:
            raise NotFoundException("User not found")
        if not verify_password(current_password, user.password):
            raise BadRequestException("Current password is incorrect")

        user.password = hash_password(new_password)
        # Invalidate all existing refresh tokens on password change
        await db.execute(delete(RefreshToken).where(RefreshToken.user_id == user_id))
        await db.commit()

    @staticmethod
    async def logout(db: AsyncSession, refresh_token_str: str) -> None:
        result = await db.execute(select(RefreshToken).where(RefreshToken.token == refresh_token_str))
        token_record = result.scalar_one_or_none()
        if token_record:
            await db.delete(token_record)
            await db.commit()

    @staticmethod
    async def _generate_tokens(db: AsyncSession, user: User) -> dict:
        roles, permissions = [], []
        for user_role in user.roles:
            roles.append(user_role.role.name)
            for rp in user_role.role.permissions:
                permissions.append(f"{rp.permission.resource}:{rp.permission.action}")

        access_token = create_access_token(
            data={"sub": str(user.id), "roles": roles, "permissions": permissions}
        )
        refresh_token_str = create_refresh_token(data={"sub": str(user.id)})

        db.add(RefreshToken(
            token=refresh_token_str,
            user_id=user.id,
            expires_at=_now() + timedelta(days=settings.refresh_token_expire_days),
        ))
        await db.commit()

        return {
            "access_token": access_token,
            "refresh_token": refresh_token_str,
            "token_type": "bearer",
            "expires_in": settings.access_token_expire_minutes * 60,
        }
