import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

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

    model_config = {"from_attributes": True}


class InternshipResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    position: str
    resume_url: str | None = None
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class VolunteerListResponse(PaginatedResponse[VolunteerResponse]):
    pass


class ApplicationStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(APPROVED|REJECTED)$")
    remarks: str | None = None