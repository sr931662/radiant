import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from src.schemas.common import PaginatedResponse


class FdpCreateRequest(BaseModel):
    title: str = Field(..., min_length=5, max_length=255)
    description: str | None = None
    start_date: datetime
    end_date: datetime
    max_seats: int = Field(..., gt=0)
    venue: str | None = None
    resource_person: str | None = None
    fee: float = 0.0
    is_active: bool = True


class FdpUpdateRequest(BaseModel):
    title: str | None = Field(None, min_length=5, max_length=255)
    description: str | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None
    max_seats: int | None = Field(None, gt=0)
    venue: str | None = None
    resource_person: str | None = None
    fee: float | None = None
    is_active: bool | None = None


class FdpResponse(BaseModel):
    id: uuid.UUID
    title: str
    description: str | None
    start_date: datetime
    end_date: datetime
    max_seats: int
    venue: str | None
    resource_person: str | None = None
    fee: float = 0.0
    is_active: bool
    seats_remaining: int = 0  # computed field
    created_at: datetime

    model_config = {"from_attributes": True}


class FdpRegistrationRequest(BaseModel):
    fdp_id: uuid.UUID


class FdpRegistrationResponse(BaseModel):
    id: uuid.UUID
    fdp_id: uuid.UUID
    user_id: uuid.UUID
    status: str
    remarks: str | None = None
    created_at: datetime
    # Populated from the user relationship
    name: str | None = None
    email: str | None = None

    model_config = {"from_attributes": True}

    @classmethod
    def model_validate(cls, obj, **kwargs):
        instance = super().model_validate(obj, **kwargs)
        if hasattr(obj, "user") and obj.user:
            instance.name = obj.user.name
            instance.email = obj.user.email
        return instance


class AttendanceRequest(BaseModel):
    user_id: uuid.UUID
    date: datetime
    status: str = Field(..., pattern="^(PRESENT|ABSENT)$")


class AttendanceBulkItem(BaseModel):
    user_id: uuid.UUID
    attended: bool


class FdpListResponse(PaginatedResponse[FdpResponse]):
    pass