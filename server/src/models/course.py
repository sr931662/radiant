from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.models.enrollment import Enrollment
    from src.models.module import Module

from typing import Optional
from sqlalchemy import Boolean, Float, Integer, String, Text
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship


from .base import Base, UUIDMixin, TimestampMixin, SoftDeleteMixin


class Course(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "courses"

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    thumbnail: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    price: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    is_published: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    level: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)           # BEGINNER, INTERMEDIATE, ADVANCED
    mode: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)            # ONLINE, OFFLINE, HYBRID
    duration_weeks: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    max_seats: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    # Rich content fields
    instructor: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    instructor_bio: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    what_you_learn: Mapped[Optional[list[str]]] = mapped_column(ARRAY(String), nullable=True)
    prerequisites: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    target_audience: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    language: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, default="Hindi / English")
    certificate_offered: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    enrollment_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Relationships
    modules: Mapped[list["Module"]] = relationship(back_populates="course", lazy="selectin", order_by="Module.order")
    enrollments: Mapped[list["Enrollment"]] = relationship(back_populates="course")
