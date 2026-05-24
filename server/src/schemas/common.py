from typing import Any, Generic, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    items: list[T]
    total: int
    page: int
    size: int
    pages: int

    model_config = {"from_attributes": True}


class APIResponse(BaseModel, Generic[T]):
    success: bool = True
    message: str = "Operation successful"
    data: T | None = None

    model_config = {"from_attributes": True}


class ErrorResponse(BaseModel):
    success: bool = False
    message: str
    error_code: str | None = None
    details: Any | None = None


class PaginationQuery(BaseModel):
    page: int = Field(default=1, ge=1)
    size: int = Field(default=20, ge=1, le=100)