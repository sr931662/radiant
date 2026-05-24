from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.models.user import User

import uuid
from typing import Optional

from sqlalchemy import Boolean, Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship


from .base import Base, UUIDMixin, TimestampMixin, SoftDeleteMixin


class Donation(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "donations"

    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    currency: Mapped[str] = mapped_column(String(10), default="INR", nullable=False)
    razorpay_order_id: Mapped[Optional[str]] = mapped_column(String(255), unique=True, index=True, nullable=True)
    razorpay_payment_id: Mapped[Optional[str]] = mapped_column(String(255), unique=True, nullable=True)
    razorpay_signature: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="PENDING", nullable=False)  # PENDING, SUCCESS, FAILED
    anonymous: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    receipt_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    # Relationships
    user: Mapped[Optional["User"]] = relationship(back_populates="donations")
