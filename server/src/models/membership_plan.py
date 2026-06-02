from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.models.membership import Membership

from typing import Optional
from sqlalchemy import Numeric, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship


from .base import Base, UUIDMixin, TimestampMixin, SoftDeleteMixin


class MembershipPlan(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "membership_plans"

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    type: Mapped[str] = mapped_column(String(20), nullable=False)  # STUDENT, TEACHER
    price: Mapped[float] = mapped_column(Numeric(10, 2), default=0.0, nullable=False)
    duration_days: Mapped[int] = mapped_column(Integer, nullable=False)
    benefits: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    # Relationships
    memberships: Mapped[list["Membership"]] = relationship(back_populates="plan")
