from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.models.attendance import Attendance
    from src.models.fdp_registration import FdpRegistration

import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import Boolean, DateTime, Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship


from .base import Base, UUIDMixin, TimestampMixin, SoftDeleteMixin


class Fdp(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "fdps"

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    start_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    end_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    max_seats: Mapped[int] = mapped_column(Integer, nullable=False)
    venue: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    resource_person: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    fee: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    hotel_info: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    registrations: Mapped[list["FdpRegistration"]] = relationship(back_populates="fdp", lazy="selectin")
    attendances: Mapped[list["Attendance"]] = relationship(back_populates="fdp", lazy="selectin")
