from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.models.blog_post import BlogPost
    from src.models.user import User

import uuid

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, UUIDMixin, TimestampMixin, SoftDeleteMixin


class BlogComment(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "blog_comments"

    post_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("blog_posts.id", ondelete="CASCADE"))
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    content: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="PENDING", nullable=False)  # PENDING, APPROVED, REJECTED

    # Relationships
    post: Mapped["BlogPost"] = relationship(back_populates="comments")
    user: Mapped["User"] = relationship(back_populates="blog_comments", lazy="selectin")
