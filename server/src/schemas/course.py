import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from src.schemas.common import PaginatedResponse


class CourseCreateRequest(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    description: str | None = None
    thumbnail: str | None = None
    price: float = 0.0
    level: str | None = None          # BEGINNER, INTERMEDIATE, ADVANCED
    mode: str | None = None           # ONLINE, OFFLINE, HYBRID
    duration_weeks: int | None = None
    max_seats: int | None = None
    is_active: bool = False           # frontend uses is_active; we map it to is_published

    def to_model_dict(self) -> dict:
        d = self.model_dump(exclude={"is_active"})
        d["is_published"] = self.is_active
        return d


class CourseUpdateRequest(BaseModel):
    title: str | None = Field(None, min_length=3, max_length=255)
    description: str | None = None
    thumbnail: str | None = None
    price: float | None = None
    level: str | None = None
    mode: str | None = None
    duration_weeks: int | None = None
    max_seats: int | None = None
    is_active: bool | None = None

    def to_model_dict(self) -> dict:
        d = self.model_dump(exclude_none=True, exclude={"is_active"})
        if self.is_active is not None:
            d["is_published"] = self.is_active
        return d


class CourseResponse(BaseModel):
    id: uuid.UUID
    title: str
    description: str | None
    thumbnail: str | None
    price: float
    is_published: bool
    level: str | None = None
    mode: str | None = None
    duration_weeks: int | None = None
    max_seats: int | None = None
    created_at: datetime

    @property
    def is_active(self) -> bool:
        return self.is_published

    model_config = {"from_attributes": True}


class LessonCreateRequest(BaseModel):
    title: str = Field(..., min_length=2, max_length=255)
    content: str | None = None
    video_url: str | None = None
    files: list[str] | None = None
    order: int = 0


class LessonResponse(BaseModel):
    id: uuid.UUID
    module_id: uuid.UUID
    title: str
    content: str | None
    video_url: str | None
    files: list[str] | None
    order: int

    model_config = {"from_attributes": True}


class ModuleCreateRequest(BaseModel):
    title: str = Field(..., min_length=2, max_length=255)
    order: int = 0


class ModuleResponse(BaseModel):
    id: uuid.UUID
    course_id: uuid.UUID
    title: str
    order: int

    model_config = {"from_attributes": True}


class ModuleWithLessonsResponse(BaseModel):
    id: uuid.UUID
    course_id: uuid.UUID
    title: str
    order: int
    lessons: list[LessonResponse] = []

    model_config = {"from_attributes": True}


class CourseDetailResponse(CourseResponse):
    """Full course detail including nested modules and lessons."""
    modules: list[ModuleWithLessonsResponse] = []


class EnrollmentRequest(BaseModel):
    course_id: uuid.UUID


class EnrollmentResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    course: CourseResponse
    progress: float
    completed: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class CourseListResponse(PaginatedResponse[CourseResponse]):
    pass


class EnrollmentListResponse(PaginatedResponse[EnrollmentResponse]):
    pass
