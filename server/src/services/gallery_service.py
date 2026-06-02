from datetime import datetime, timezone
import uuid
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models import GalleryAlbum, GalleryMedia
from src.services.file_upload_service import FileUploadService
from src.utils.exceptions import NotFoundException


class GalleryService:
    @staticmethod
    async def list_albums(db: AsyncSession) -> list[GalleryAlbum]:
        result = await db.execute(select(GalleryAlbum).where(GalleryAlbum.deleted_at == None).order_by(GalleryAlbum.created_at.desc()))
        albums = list(result.scalars().all())
        for album in albums:
            count_stmt = select(func.count(GalleryMedia.id)).where(GalleryMedia.album_id == album.id, GalleryMedia.deleted_at == None)
            setattr(album, "media_count", await db.scalar(count_stmt) or 0)
        return albums

    @staticmethod
    async def get_album(db: AsyncSession, album_id: uuid.UUID) -> GalleryAlbum:
        album = await db.get(GalleryAlbum, album_id)
        if not album:
            raise NotFoundException("Album not found")
        return album

    @staticmethod
    async def create_album(db: AsyncSession, data: dict) -> GalleryAlbum:
        album = GalleryAlbum(**data)
        db.add(album)
        await db.commit()
        await db.refresh(album)
        return album

    @staticmethod
    async def update_album(db: AsyncSession, album_id: uuid.UUID, data: dict) -> GalleryAlbum:
        album = await GalleryService.get_album(db, album_id)
        for key, value in data.items():
            if value is not None and hasattr(album, key):
                setattr(album, key, value)
        await db.commit()
        await db.refresh(album)
        return album

    @staticmethod
    async def delete_album(db: AsyncSession, album_id: uuid.UUID) -> None:
        album = await GalleryService.get_album(db, album_id)
        album.deleted_at = datetime.now(timezone.utc)
        await db.commit()

    @staticmethod
    async def upload_media(db: AsyncSession, album_id: uuid.UUID, file, file_type: str, caption: str | None = None) -> GalleryMedia:
        url = await FileUploadService.upload_gallery_media(file, file_type)
        media = GalleryMedia(album_id=album_id, url=url, type=file_type, caption=caption)
        db.add(media)
        await db.commit()
        await db.refresh(media)
        return media

    @staticmethod
    async def delete_media(db: AsyncSession, media_id: uuid.UUID) -> None:
        media = await db.get(GalleryMedia, media_id)
        if not media:
            raise NotFoundException("Media not found")
        await db.delete(media)
        await db.commit()