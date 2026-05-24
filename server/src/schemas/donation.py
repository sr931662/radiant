import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from src.schemas.common import PaginatedResponse


class CreateOrderRequest(BaseModel):
    amount: float = Field(..., gt=0)  # INR
    anonymous: bool = False


class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


class DonationResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID | None = None
    amount: float
    currency: str
    status: str
    anonymous: bool
    razorpay_order_id: str | None = None
    receipt_url: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class DonationListResponse(PaginatedResponse[DonationResponse]):
    pass


class DonationStatsResponse(BaseModel):
    total_donations: float
    total_count: int
    average_donation: float
    this_month_total: float
    last_month_total: float