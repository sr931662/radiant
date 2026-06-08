import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class BannerCreateRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    badge_text: str | None = Field(None, max_length=50)
    type: str = Field(default="info", pattern="^(info|warning|success|urgent)$")
    cta_text: str | None = Field(None, max_length=100)
    cta_url: str | None = Field(None, max_length=500)
    is_active: bool = False


class BannerUpdateRequest(BaseModel):
    message: str | None = Field(None, min_length=1, max_length=2000)
    badge_text: str | None = Field(None, max_length=50)
    type: str | None = Field(None, pattern="^(info|warning|success|urgent)$")
    cta_text: str | None = Field(None, max_length=100)
    cta_url: str | None = Field(None, max_length=500)
    is_active: bool | None = None


class BannerResponse(BaseModel):
    id: uuid.UUID
    message: str
    badge_text: str | None
    type: str
    cta_text: str | None
    cta_url: str | None
    is_active: bool
    created_at: datetime
    updated_at: datetime | None = None

    model_config = {"from_attributes": True}
