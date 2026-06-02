import logging
import uuid
from datetime import datetime, timedelta

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.security import hash_password, verify_password, create_access_token, create_refresh_token, verify_token
from src.models import User, UserRole, Role, RefreshToken, OTP
from src.utils.otp import generate_otp, verify_otp
from src.utils.exceptions import AppException, UnauthorizedException, NotFoundException, BadRequestException
from src.services.email_service import EmailService

logger = logging.getLogger(__name__)


class AuthService:
    @staticmethod
    async def register(db: AsyncSession, data: dict) -> dict:
        # Check if email already exists
        stmt = select(User).where(User.email == data["email"])
        result = await db.execute(stmt)
        existing = result.scalar_one_or_none()
        if existing:
            raise BadRequestException("Email already registered")

        # Create user
        user = User(
            email=data["email"],
            password=hash_password(data["password"]),
            name=data["name"],
            phone=data.get("phone"),
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

        # Assign PUBLIC role by default
        role_stmt = select(Role).where(Role.name == "PUBLIC")
        role_result = await db.execute(role_stmt)
        public_role = role_result.scalar_one_or_none()
        if public_role:
            user_role = UserRole(user_id=user.id, role_id=public_role.id)
            db.add(user_role)
            await db.commit()

        # Generate and send OTP for email verification
        otp_code = generate_otp()
        otp = OTP(email=user.email, code=otp_code, purpose="VERIFY_EMAIL", expires_at=datetime.utcnow() + timedelta(minutes=10), user_id=user.id)
        db.add(otp)
        await db.commit()

        # Send verification email — non-fatal if email service is not configured
        try:
            await EmailService.send_verification_email(user.email, otp_code)
        except Exception:
            pass

        # Generate tokens
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

        return await AuthService._generate_tokens(db, user)

    @staticmethod
    async def refresh_token(db: AsyncSession, refresh_token_str: str) -> dict:
        # Verify token signature
        payload = verify_token(refresh_token_str, token_type="refresh")
        if not payload:
            raise UnauthorizedException("Invalid refresh token")

        # Check token exists in DB
        stmt = select(RefreshToken).where(RefreshToken.token == refresh_token_str)
        result = await db.execute(stmt)
        token_record = result.scalar_one_or_none()

        if not token_record or token_record.expires_at < datetime.utcnow():
            raise UnauthorizedException("Refresh token expired or revoked")

        # Get user
        user_stmt = select(User).where(User.id == token_record.user_id)
        user_result = await db.execute(user_stmt)
        user = user_result.scalar_one_or_none()

        if not user or user.is_banned:
            raise UnauthorizedException("User not found or banned")

        # Delete old refresh token (rotation)
        await db.delete(token_record)
        await db.commit()

        # Generate new token pair
        return await AuthService._generate_tokens(db, user)

    @staticmethod
    async def verify_email(db: AsyncSession, email: str, otp_code: str) -> None:
        stmt = select(User).where(User.email == email)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()
        if not user:
            raise NotFoundException("User not found")

        # Find OTP
        otp_stmt = select(OTP).where(OTP.email == email, OTP.purpose == "VERIFY_EMAIL", OTP.used == False)
        otp_result = await db.execute(otp_stmt)
        otp_record = otp_result.scalar_one_or_none()

        if not otp_record or otp_record.expires_at < datetime.utcnow():
            raise BadRequestException("OTP expired or invalid")

        if otp_record.code != otp_code:
            raise BadRequestException("Invalid OTP")

        # Mark OTP used and verify user
        otp_record.used = True
        user.is_email_verified = True
        await db.commit()

    @staticmethod
    async def forgot_password(db: AsyncSession, email: str) -> None:
        stmt = select(User).where(User.email == email)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()
        if not user:
            # Don't reveal if email exists; silently return
            return

        otp_code = generate_otp()
        otp = OTP(email=email, code=otp_code, purpose="RESET_PASSWORD", expires_at=datetime.utcnow() + timedelta(minutes=10), user_id=user.id)
        db.add(otp)
        await db.commit()
        try:
            await EmailService.send_password_reset_email(email, otp_code)
        except Exception:
            logger.warning(f"[AUTH] Password reset email failed for {email}. OTP logged above.")

    @staticmethod
    async def reset_password(db: AsyncSession, email: str, otp_code: str, new_password: str) -> None:
        stmt = select(User).where(User.email == email)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()
        if not user:
            raise NotFoundException("User not found")

        otp_stmt = select(OTP).where(OTP.email == email, OTP.purpose == "RESET_PASSWORD", OTP.used == False)
        otp_result = await db.execute(otp_stmt)
        otp_record = otp_result.scalar_one_or_none()

        if not otp_record or otp_record.expires_at < datetime.utcnow():
            raise BadRequestException("OTP expired")

        if otp_record.code != otp_code:
            raise BadRequestException("Invalid OTP")

        otp_record.used = True
        user.password = hash_password(new_password)
        await db.commit()

    @staticmethod
    async def change_password(db: AsyncSession, user_id: uuid.UUID, current_password: str, new_password: str) -> None:
        stmt = select(User).where(User.id == user_id)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()
        if not user:
            raise NotFoundException("User not found")

        if not verify_password(current_password, user.password):
            raise BadRequestException("Current password is incorrect")

        user.password = hash_password(new_password)
        await db.commit()

    @staticmethod
    async def logout(db: AsyncSession, refresh_token_str: str) -> None:
        stmt = select(RefreshToken).where(RefreshToken.token == refresh_token_str)
        result = await db.execute(stmt)
        token_record = result.scalar_one_or_none()
        if token_record:
            await db.delete(token_record)
            await db.commit()

    @staticmethod
    async def _generate_tokens(db: AsyncSession, user: User) -> dict:
        # Get user roles and permissions
        roles = []
        permissions = []
        for user_role in user.roles:
            roles.append(user_role.role.name)
            for rp in user_role.role.permissions:
                perm_str = f"{rp.permission.resource}:{rp.permission.action}"
                permissions.append(perm_str)

        access_token = create_access_token(
            data={"sub": str(user.id), "roles": roles, "permissions": permissions}
        )
        refresh_token_str = create_refresh_token(data={"sub": str(user.id)})

        # Store refresh token in DB
        refresh_token_record = RefreshToken(
            token=refresh_token_str,
            user_id=user.id,
            expires_at=datetime.utcnow() + timedelta(days=7),
        )
        db.add(refresh_token_record)
        await db.commit()

        return {
            "access_token": access_token,
            "refresh_token": refresh_token_str,
            "token_type": "bearer",
            "expires_in": 15 * 60,  # 15 minutes
        }