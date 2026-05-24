from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.models.enrollment import Enrollment
    from src.models.module import Module

from ast import Module
from typing import Optional
from sqlalchemy import Boolean, Float, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship


from .base import Base, UUIDMixin, TimestampMixin, SoftDeleteMixin


class Course(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "courses"

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    thumbnail: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    price: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    is_published: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Relationships
    modules: Mapped[list["Module"]] = relationship(back_populates="course", lazy="selectin", order_by="Module.order")
    enrollments: Mapped[list["Enrollment"]] = relationship(back_populates="course")
