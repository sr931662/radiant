from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base, UUIDMixin, TimestampMixin, SoftDeleteMixin


class LandingLead(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "landing_leads"

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=False)
    state: Mapped[str] = mapped_column(String(100), nullable=False)
    course_type: Mapped[str] = mapped_column(String(10), nullable=False)  # UG, PG
    course: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="NEW", nullable=False)  # NEW, CONTACTED, CONVERTED, CLOSED
    source: Mapped[str] = mapped_column(String(50), default="main_site", nullable=False)
