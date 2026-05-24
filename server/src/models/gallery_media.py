from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.models.gallery_album import GalleryAlbum

from typing import Optional
import uuid

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship


from .base import Base, UUIDMixin, TimestampMixin, SoftDeleteMixin


class GalleryMedia(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "gallery_media"

    album_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("gallery_albums.id", ondelete="CASCADE"))
    url: Mapped[str] = mapped_column(String(500), nullable=False)
    type: Mapped[str] = mapped_column(String(20), nullable=False)  # IMAGE, VIDEO
    caption: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    # Relationships
    album: Mapped["GalleryAlbum"] = relationship(back_populates="media")
