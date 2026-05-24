from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.models.user import User

import uuid
from typing import Optional

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship


from .base import Base, UUIDMixin, TimestampMixin, SoftDeleteMixin


class Admission(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "admissions"

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    course_name: Mapped[str] = mapped_column(String(255), nullable=False)
    documents: Mapped[Optional[list[str]]] = mapped_column(ARRAY(String), nullable=True)  # URLs
    status: Mapped[str] = mapped_column(String(20), default="PENDING", nullable=False)  # PENDING, APPROVED, REJECTED
    remarks: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    user: Mapped["User"] = relationship(back_populates="admissions")
