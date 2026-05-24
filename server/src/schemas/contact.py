import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field

from src.schemas.common import PaginatedResponse


class ContactFormRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    subject: str = Field(..., min_length=5, max_length=255)
    message: str = Field(..., min_length=10, max_length=5000)


class InquiryResponse(BaseModel):
    id: uuid.UUID
    name: str
    email: str
    subject: str
    message: str
    status: str
    reply: str | None = None
    replied_at: datetime | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class InquiryReplyRequest(BaseModel):
    reply: str = Field(..., min_length=1, max_length=5000)


class InquiryListResponse(PaginatedResponse[InquiryResponse]):
    pass