import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from src.schemas.common import PaginatedResponse


class AdmissionApplyRequest(BaseModel):
    course_name: str = Field(..., min_length=2, max_length=255)
    # Documents are uploaded separately, so not included here


class AdmissionResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    course_name: str
    documents: list[str] | None = None
    status: str
    remarks: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class AdmissionStatusUpdateRequest(BaseModel):
    status: str = Field(..., pattern="^(APPROVED|REJECTED)$")
    remarks: str | None = None


class AdmissionListResponse(PaginatedResponse[AdmissionResponse]):
    pass