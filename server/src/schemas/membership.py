import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from src.schemas.common import PaginatedResponse


class MembershipPlanResponse(BaseModel):
    id: uuid.UUID
    name: str
    type: str
    price: float
    duration_days: int
    benefits: dict | None = None

    model_config = {"from_attributes": True}


class MembershipApplyRequest(BaseModel):
    plan_id: uuid.UUID


class MembershipResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    plan: MembershipPlanResponse
    status: str
    member_id: str | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class ApproveMembershipRequest(BaseModel):
    status: str = Field(..., pattern="^(APPROVED|REJECTED)$")
    remarks: str | None = None


class MembershipListResponse(PaginatedResponse[MembershipResponse]):
    pass


class MembershipCardResponse(BaseModel):
    member_id: str
    name: str
    plan_name: str
    valid_until: datetime | None
    qr_code: str | None = None  # base64 or URL