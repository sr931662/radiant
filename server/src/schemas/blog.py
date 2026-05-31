import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from src.schemas.common import PaginatedResponse


class PostCreateRequest(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    content: str = Field(..., min_length=10)
    excerpt: str | None = None
    featured_image: str | None = None
    category: str | None = None
    tags: list[str] | None = None
    status: str = Field(default="DRAFT", pattern="^(DRAFT|PUBLISHED)$")


class PostUpdateRequest(BaseModel):
    title: str | None = Field(None, min_length=3, max_length=255)
    content: str | None = Field(None, min_length=10)
    excerpt: str | None = None
    featured_image: str | None = None
    category: str | None = None
    tags: list[str] | None = None
    status: str | None = Field(None, pattern="^(DRAFT|PUBLISHED)$")


class PostResponse(BaseModel):
    id: uuid.UUID
    title: str
    slug: str
    content: str
    excerpt: str | None
    featured_image: str | None
    category: str | None
    tags: list[str] | None
    status: str
    published_at: datetime | None
    created_at: datetime
    comment_count: int = 0

    model_config = {"from_attributes": True}


class CommentCreateRequest(BaseModel):
    content: str = Field(..., min_length=1, max_length=2000)


class CommentResponse(BaseModel):
    id: uuid.UUID
    post_id: uuid.UUID
    user_id: uuid.UUID
    user_name: str
    content: str
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class PostListResponse(PaginatedResponse[PostResponse]):
    pass
