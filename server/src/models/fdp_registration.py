from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.models.fdp import Fdp
    from src.models.user import User

import uuid
from typing import Optional

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship


from .base import Base, UUIDMixin, TimestampMixin, SoftDeleteMixin


class FdpRegistration(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "fdp_registrations"

    fdp_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("fdps.id", ondelete="CASCADE"))
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    status: Mapped[str] = mapped_column(String(20), default="PENDING", nullable=False)  # PENDING, CONFIRMED, CANCELLED
    remarks: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    # Relationships
    fdp: Mapped["Fdp"] = relationship(back_populates="registrations")
    user: Mapped["User"] = relationship(back_populates="fdp_registrations")
