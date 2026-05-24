import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field

from src.schemas.common import PaginatedResponse


class UserResponse(BaseModel):
    id: uuid.UUID
    email: str
    name: str
    phone: Optional[str] = None
    avatar: Optional[str] = None
    is_email_verified: bool
    is_banned: bool
    roles: list[str] = []  # e.g., ["STUDENT", "FACULTY"]
    created_at: datetime

    model_config = {"from_attributes": True}


class UserUpdateRequest(BaseModel):
    name: str | None = Field(None, min_length=2, max_length=255)
    phone: str | None = None
    avatar: str | None = None


class ChangeRoleRequest(BaseModel):
    user_id: uuid.UUID
    role_names: list[str]  # ["ADMIN", "FACULTY"]


class BanUserRequest(BaseModel):
    ban: bool  # True = ban, False = unban


class UserListResponse(PaginatedResponse[UserResponse]):
    pass