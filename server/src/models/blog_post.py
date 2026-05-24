from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.models.blog_comment import BlogComment

from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, String, Text
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship


from .base import Base, UUIDMixin, TimestampMixin, SoftDeleteMixin


class BlogPost(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "blog_posts"

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(300), unique=True, index=True, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)  # rich text
    excerpt: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    featured_image: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="DRAFT", nullable=False)  # DRAFT, PUBLISHED
    category: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    tags: Mapped[Optional[list[str]]] = mapped_column(ARRAY(String), nullable=True)
    published_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    comments: Mapped[list["BlogComment"]] = relationship(back_populates="post", lazy="selectin")
