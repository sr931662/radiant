import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class DownloadItemCreateRequest(BaseModel):
    title: str = Field(..., min_length=2, max_length=255)
    file_url: str
    category: str | None = None
    size: int | None = None
    access_level: str = Field(default="PUBLIC", pattern="^(PUBLIC|MEMBER|ADMIN)$")


class DownloadItemResponse(BaseModel):
    id: uuid.UUID
    title: str
    file_url: str
    category: str | None
    size: int | None
    access_level: str
    created_at: datetime

    model_config = {"from_attributes": True}