from fastapi import APIRouter, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends
from sqlalchemy import select
from src.core.database import get_db
from src.schemas.auth import TokenResponse
from src.controllers.auth_controller import (
    register, login, refresh_token, verify_email, forgot_password,
    reset_password, change_password, logout, resend_otp,
)
from src.config import settings

router = APIRouter(prefix="/api/v1/auth", tags=["Auth"])

router.post("/register", response_model=TokenResponse, status_code=201)(register)
router.post("/login", response_model=TokenResponse)(login)
router.post("/refresh", response_model=TokenResponse)(refresh_token)
router.post("/verify-email")(verify_email)
router.post("/resend-otp")(resend_otp)
router.post("/forgot-password")(forgot_password)
router.post("/reset-password")(reset_password)
router.post("/change-password")(change_password)
router.post("/logout")(logout)


@router.get("/dev/otp", include_in_schema=False)
async def dev_get_otp(email: str = Query(...), db: AsyncSession = Depends(get_db)):
    """Return the latest unused OTP for an email — DEV/STAGING only."""
    if settings.environment == "production":
        raise HTTPException(status_code=403, detail="Not available in production.")
    from src.models.otp import OTP
    from datetime import datetime, timezone
    stmt = (
        select(OTP)
        .where(OTP.email == email, OTP.used == False, OTP.expires_at > datetime.now(timezone.utc))
        .order_by(OTP.expires_at.desc())
    )
    result = await db.execute(stmt)
    otp = result.scalar_one_or_none()
    if not otp:
        raise HTTPException(status_code=404, detail="No active OTP found for this email.")
    return {"email": email, "otp": otp.code, "purpose": otp.purpose, "expires_at": otp.expires_at}