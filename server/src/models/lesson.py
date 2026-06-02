from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.models.module import Module

from typing import Optional
import uuid
from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, UUIDMixin, TimestampMixin, SoftDeleteMixin


class Lesson(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "lessons"

    module_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("modules.id", ondelete="CASCADE"))
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    content: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # rich text / markdown
    video_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    files: Mapped[Optional[list[str]]] = mapped_column(ARRAY(String), nullable=True)  # URLs
    order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Relationships
    module: Mapped["Module"] = relationship(back_populates="lessons")