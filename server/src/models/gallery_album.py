from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.models.gallery_media import GalleryMedia

from typing import Optional
from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship


from .base import Base, UUIDMixin, TimestampMixin, SoftDeleteMixin


class GalleryAlbum(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "gallery_albums"

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    cover_image: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    tag: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)  # e.g. Events, Programs

    # Relationships
    media: Mapped[list["GalleryMedia"]] = relationship(back_populates="album", lazy="selectin")
