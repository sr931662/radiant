from typing import Optional
from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base, UUIDMixin, TimestampMixin, SoftDeleteMixin


class DownloadItem(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "download_items"

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    file_url: Mapped[str] = mapped_column(String(500), nullable=False)
    category: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)  # BROCHURE, FORM, REPORT
    size: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)  # in bytes
    access_level: Mapped[str] = mapped_column(String(20), default="PUBLIC", nullable=False)  # PUBLIC, MEMBER, ADMIN