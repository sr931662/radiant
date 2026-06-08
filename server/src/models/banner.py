from sqlalchemy import Boolean, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base, UUIDMixin, TimestampMixin, SoftDeleteMixin


class Banner(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "banners"

    message: Mapped[str] = mapped_column(Text, nullable=False)
    badge_text: Mapped[str | None] = mapped_column(String(50), nullable=True)
    type: Mapped[str] = mapped_column(String(20), default="info", nullable=False)
    cta_text: Mapped[str | None] = mapped_column(String(100), nullable=True)
    cta_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
