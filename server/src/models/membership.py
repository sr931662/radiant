from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.models.membership_plan import MembershipPlan
    from src.models.user import User

import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship


from .base import Base, UUIDMixin, TimestampMixin, SoftDeleteMixin


class Membership(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "memberships"

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    plan_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("membership_plans.id", ondelete="RESTRICT"))
    status: Mapped[str] = mapped_column(String(20), default="PENDING", nullable=False)  # PENDING, APPROVED, REJECTED, EXPIRED
    member_id: Mapped[Optional[str]] = mapped_column(String(50), unique=True, nullable=True)  # auto-generated unique ID
    start_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    end_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    approved_by: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("users.id"), nullable=True)

    # Relationships
    user: Mapped["User"] = relationship(back_populates="memberships", foreign_keys="[Membership.user_id]", lazy="selectin")
    plan: Mapped["MembershipPlan"] = relationship(back_populates="memberships", lazy="selectin")
