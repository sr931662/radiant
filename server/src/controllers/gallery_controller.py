import uuid
from fastapi import Depends, Path, Body, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db
from src.dependencies import get_current_admin_user
from src.schemas.gallery import AlbumCreateRequest, AlbumUpdateRequest, AlbumResponse, MediaUploadResponse
from src.schemas.common import APIResponse
from src.services.gallery_service import GalleryService
from src.core.cache import cache_get, cache_set, cache_delete


async def list_albums(
    db: AsyncSession = Depends(get_db),
) -> list[AlbumResponse]:
    cache_key = "gallery:albums"
    cached = await cache_get(cache_key)
    if cached:
        return [AlbumResponse(**a) for a in cached]

    albums = await GalleryService.list_albums(db)
    response = [AlbumResponse.model_validate(a) for a in albums]
    await cache_set(cache_key, [r.model_dump() for r in response], ttl=300)
    return response


async def get_album(
    album_id: uuid.UUID = Path(...),
    db: AsyncSession = Depends(get_db),
) -> AlbumResponse:
    album = await GalleryService.get_album(db, album_id)
    return AlbumResponse.model_validate(album)


async def create_album(
    data: AlbumCreateRequest = Body(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> AlbumResponse:
    album = await GalleryService.create_album(db, data.model_dump())
    await cache_delete("gallery:albums")
    return AlbumResponse.model_validate(album)


async def update_album(
    album_id: uuid.UUID = Path(...),
    data: AlbumUpdateRequest = Body(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> AlbumResponse:
    album = await GalleryService.update_album(db, album_id, data.model_dump(exclude_none=True))
    await cache_delete("gallery:albums")
    return AlbumResponse.model_validate(album)


async def delete_album(
    album_id: uuid.UUID = Path(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> APIResponse:
    await GalleryService.delete_album(db, album_id)
    await cache_delete("gallery:albums")
    return APIResponse(message="Album deleted")


async def upload_media(
    album_id: uuid.UUID = Form(...),
    file: UploadFile = File(...),
    caption: str | None = Form(None),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> MediaUploadResponse:
    file_type = "VIDEO" if (file.content_type or "").startswith("video") else "IMAGE"
    media = await GalleryService.upload_media(db, album_id, file, file_type, caption)
    return MediaUploadResponse.model_validate(media)


async def delete_media(
    media_id: uuid.UUID = Path(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> APIResponse:
    await GalleryService.delete_media(db, media_id)
    return APIResponse(message="Media deleted")