import uuid
from fastapi import Depends, Query, Path, Body
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db
from src.dependencies import get_current_admin_user
from src.schemas.user import UserResponse, UserListResponse, UserUpdateRequest, ChangeRoleRequest, BanUserRequest
from src.schemas.common import APIResponse, PaginationQuery
from src.services.user_service import UserService


async def list_users(
    pagination: PaginationQuery = Depends(),
    role: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> UserListResponse:
    users, total = await UserService.list_users(db, pagination.page, pagination.size, role)
    return UserListResponse(
        items=[UserResponse.model_validate(u) for u in users],
        total=total,
        page=pagination.page,
        size=pagination.size,
        pages=(total + pagination.size - 1) // pagination.size,
    )


async def get_user(
    user_id: uuid.UUID = Path(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> UserResponse:
    user = await UserService.get_user(db, user_id)
    return UserResponse.model_validate(user)


async def update_user(
    user_id: uuid.UUID = Path(...),
    data: UserUpdateRequest = Body(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> UserResponse:
    user = await UserService.update_user(db, user_id, data.model_dump(exclude_none=True))
    return UserResponse.model_validate(user)


async def ban_user(
    user_id: uuid.UUID = Path(...),
    data: BanUserRequest = Body(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> APIResponse:
    await UserService.ban_user(db, user_id, data.ban)
    return APIResponse(message=f"User {'banned' if data.ban else 'unbanned'}")


async def change_role(
    user_id: uuid.UUID = Path(...),
    data: ChangeRoleRequest = Body(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> APIResponse:
    await UserService.change_role(db, user_id, data.role_names)
    return APIResponse(message="Roles updated")