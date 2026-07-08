import uuid
from datetime import datetime

from pydantic import BaseModel, Field

from src.schemas.common import PaginatedResponse


class LandingLeadCreateRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    phone: str = Field(..., pattern=r"^[0-9]{10}$")
    state: str = Field(..., min_length=2, max_length=100)
    course_type: str = Field(..., pattern=r"^(UG|PG)$")
    course: str = Field(..., min_length=2, max_length=255)


class LandingLeadResponse(BaseModel):
    id: uuid.UUID
    name: str
    phone: str
    state: str
    course_type: str
    course: str
    status: str
    source: str
    created_at: datetime

    model_config = {"from_attributes": True}


class LandingLeadStatusUpdateRequest(BaseModel):
    status: str = Field(..., pattern=r"^(NEW|CONTACTED|CONVERTED|CLOSED)$")


class LandingLeadListResponse(PaginatedResponse[LandingLeadResponse]):
    pass
