from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.models.fdp import Fdp
    from src.models.user import User

import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship


from .base import Base, UUIDMixin


class Attendance(Base, UUIDMixin):
    __tablename__ = "attendances"

    fdp_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("fdps.id", ondelete="CASCADE"))
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False)  # PRESENT, ABSENT

    # Relationships
    fdp: Mapped["Fdp"] = relationship(back_populates="attendances")
    user: Mapped["User"] = relationship(back_populates="attendances")
