import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, model_validator

from src.schemas.common import PaginatedResponse


class VolunteerApplyRequest(BaseModel):
    type: str = Field(..., pattern="^(VOLUNTEER|AMBASSADOR)$")
    skills: str | None = None


class InternshipApplyRequest(BaseModel):
    position: str = Field(..., min_length=2, max_length=255)


class VolunteerResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    type: str
    skills: str | None = None
    resume_url: str | None = None
    status: str
    created_at: datetime
    # Populated from the user relationship
    name: str | None = None
    email: str | None = None

    model_config = {"from_attributes": True}

    @model_validator(mode="after")
    def populate_user_fields(self) -> "VolunteerResponse":
        return self

    @classmethod
    def model_validate(cls, obj, **kwargs):
        instance = super().model_validate(obj, **kwargs)
        if hasattr(obj, "user") and obj.user:
            instance.name = obj.user.name
            instance.email = obj.user.email
        return instance


class InternshipResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    position: str
    resume_url: str | None = None
    status: str
    created_at: datetime
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


class VolunteerListResponse(PaginatedResponse[VolunteerResponse]):
    pass


class MixedVolunteerListResponse(PaginatedResponse[VolunteerResponse | InternshipResponse]):
    pass


class ApplicationStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(APPROVED|REJECTED)$")
    remarks: str | None = None
