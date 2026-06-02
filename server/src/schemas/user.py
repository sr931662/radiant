import uuid
from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, EmailStr, Field, field_validator

from src.schemas.common import PaginatedResponse


class UserResponse(BaseModel):
    id: uuid.UUID
    email: str
    name: str
    phone: Optional[str] = None
    avatar: Optional[str] = None
    is_email_verified: bool
    is_banned: bool
    roles: list[str] = []
    created_at: datetime

    model_config = {"from_attributes": True}

    @field_validator("roles", mode="before")
    @classmethod
    def extract_role_names(cls, v: Any) -> list[str]:
        """Convert UserRole ORM objects → role name strings."""
        if not v:
            return []
        result = []
        for item in v:
            if isinstance(item, str):
                result.append(item)
            elif hasattr(item, "role") and hasattr(item.role, "name"):
                # UserRole ORM object: item.role.name
                result.append(item.role.name)
            elif hasattr(item, "name"):
                # Direct Role object
                result.append(item.name)
        return result


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