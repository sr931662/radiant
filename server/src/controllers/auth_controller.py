from fastapi import Depends, Body
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db
from src.dependencies import get_current_user
from src.schemas.auth import (
    RegisterRequest, LoginRequest, TokenResponse, RefreshRequest,
    VerifyEmailRequest, ForgotPasswordRequest, ResetPasswordRequest, ChangePasswordRequest,
)
from src.schemas.common import APIResponse
from src.services.auth_service import AuthService


async def register(
    data: RegisterRequest = Body(...),
    db: AsyncSession = Depends(get_db),
) -> TokenResponse:
    token_data = await AuthService.register(db, data.model_dump())
    return TokenResponse(**token_data)


async def login(
    data: LoginRequest = Body(...),
    db: AsyncSession = Depends(get_db),
) -> TokenResponse:
    token_data = await AuthService.login(db, data.email, data.password)
    return TokenResponse(**token_data)


async def refresh_token(
    data: RefreshRequest = Body(...),
    db: AsyncSession = Depends(get_db),
) -> TokenResponse:
    token_data = await AuthService.refresh_token(db, data.refresh_token)
    return TokenResponse(**token_data)


async def verify_email(
    data: VerifyEmailRequest = Body(...),
    db: AsyncSession = Depends(get_db),
) -> APIResponse:
    await AuthService.verify_email(db, data.email, data.otp)
    return APIResponse(message="Email verified successfully")


async def forgot_password(
    data: ForgotPasswordRequest = Body(...),
    db: AsyncSession = Depends(get_db),
) -> APIResponse:
    await AuthService.forgot_password(db, data.email)
    return APIResponse(message="If the email exists, an OTP has been sent")


async def reset_password(
    data: ResetPasswordRequest = Body(...),
    db: AsyncSession = Depends(get_db),
) -> APIResponse:
    await AuthService.reset_password(db, data.email, data.otp, data.new_password)
    return APIResponse(message="Password reset successfully")


async def change_password(
    data: ChangePasswordRequest = Body(...),
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> APIResponse:
    await AuthService.change_password(db, current_user["sub"], data.current_password, data.new_password)
    return APIResponse(message="Password changed successfully")


async def logout(
    data: RefreshRequest = Body(...),
    db: AsyncSession = Depends(get_db),
) -> APIResponse:
    await AuthService.logout(db, data.refresh_token)
    return APIResponse(message="Logged out successfully")