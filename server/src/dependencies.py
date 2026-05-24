from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db
from src.core.security import verify_token
from src.models import User, UserRole, Role, RolePermission, Permission

# Token scheme for Swagger UI
security_scheme = HTTPBearer()


async def get_current_user_payload(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
) -> dict:
    """
    Extracts and verifies the access token from the Authorization header.
    Returns the decoded payload containing: sub (user_id), roles, permissions.
    """
    token = credentials.credentials
    payload = verify_token(token, token_type="access")
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token",
        )
    return payload


async def get_current_user(
    payload: dict = Depends(get_current_user_payload),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """
    Checks that the user exists and is not banned.
    Returns a dict with user info for easy access in controllers.
    """
    user_id = payload.get("sub")
    user = await db.get(User, user_id)
    if not user or user.is_banned:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or banned",
        )
    # Merge payload with user details if needed
    return {
        "sub": str(user.id),
        "email": user.email,
        "name": user.name,
        "roles": payload.get("roles", []),
        "permissions": payload.get("permissions", []),
    }


def require_role(required_role: str):
    """
    Factory that returns a dependency enforcing a specific role.
    Usage: @router.get("/", dependencies=[Depends(require_role("ADMIN"))])
    """
    async def role_checker(current_user: dict = Depends(get_current_user)):
        if required_role not in current_user.get("roles", []):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role '{required_role}' required",
            )
        return current_user
    return role_checker


def require_permission(permission: str):
    """
    Factory that returns a dependency enforcing a specific permission.
    Usage: Depends(require_permission("membership:approve"))
    """
    async def permission_checker(current_user: dict = Depends(get_current_user)):
        if permission not in current_user.get("permissions", []):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission '{permission}' required",
            )
        return current_user
    return permission_checker


# Pre-built dependency for admin users (Super Admin or Admin)
async def get_current_admin_user(
    current_user: dict = Depends(get_current_user),
) -> dict:
    """
    Ensures the user has at least ADMIN role.
    """
    if "SUPER_ADMIN" not in current_user["roles"] and "ADMIN" not in current_user["roles"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user


# Pre-built dependency for super admin only
async def get_current_super_admin(
    current_user: dict = Depends(get_current_user),
) -> dict:
    if "SUPER_ADMIN" not in current_user["roles"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Super Admin access required",
        )
    return current_user