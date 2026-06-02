from fastapi import APIRouter, Depends
from src.dependencies import get_current_admin_user
from src.schemas.user import UserListResponse, UserResponse
from src.controllers.user_controller import list_users, get_user, update_user, ban_user, change_role

router = APIRouter(
    prefix="/api/v1/admin/users",
    tags=["Users"],
    dependencies=[Depends(get_current_admin_user)],
)

router.get("", response_model=UserListResponse)(list_users)
router.get("/{user_id}", response_model=UserResponse)(get_user)
router.patch("/{user_id}", response_model=UserResponse)(update_user)
router.patch("/{user_id}/ban")(ban_user)
router.patch("/{user_id}/roles")(change_role)