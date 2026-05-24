from fastapi import APIRouter
from src.schemas.auth import TokenResponse
from src.controllers.auth_controller import (
    register, login, refresh_token, verify_email, forgot_password,
    reset_password, change_password, logout,
)

router = APIRouter(prefix="/api/v1/auth", tags=["Auth"])

router.post("/register", response_model=TokenResponse, status_code=201)(register)
router.post("/login", response_model=TokenResponse)(login)
router.post("/refresh", response_model=TokenResponse)(refresh_token)
router.post("/verify-email")(verify_email)
router.post("/forgot-password")(forgot_password)
router.post("/reset-password")(reset_password)
router.post("/change-password")(change_password)
router.post("/logout")(logout)