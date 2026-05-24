import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class AlbumCreateRequest(BaseModel):
    title: str = Field(..., min_length=2, max_length=255)
    description: str | None = None


class AlbumResponse(BaseModel):
    id: uuid.UUID
    title: str
    description: str | None
    cover_image: str | None = None
    created_at: datetime
    media_count: int = 0

    model_config = {"from_attributes": True}


class MediaUploadResponse(BaseModel):
    id: uuid.UUID
    album_id: uuid.UUID
    url: str
    type: str
    caption: str | None = None

    model_config = {"from_attributes": True}