from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.models.course import Course
    from src.models.user import User

import uuid

from sqlalchemy import Boolean, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship


from .base import Base, UUIDMixin, TimestampMixin, SoftDeleteMixin


class Enrollment(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "enrollments"

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    course_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("courses.id", ondelete="CASCADE"))
    progress: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)  # percentage 0-100
    completed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Relationships
    user: Mapped["User"] = relationship(back_populates="enrollments", lazy="selectin")
    course: Mapped["Course"] = relationship(back_populates="enrollments", lazy="selectin")
