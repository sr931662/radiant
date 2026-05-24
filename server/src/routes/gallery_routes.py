from fastapi import APIRouter, Depends
from src.dependencies import get_current_admin_user
from src.schemas.gallery import AlbumResponse, MediaUploadResponse
from src.controllers.gallery_controller import (
    list_albums, get_album, create_album, update_album, delete_album, upload_media, delete_media,
)

public_router = APIRouter(prefix="/api/v1/gallery", tags=["Gallery"])
admin_router = APIRouter(
    prefix="/api/v1/admin/gallery",
    tags=["Admin-Gallery"],
    dependencies=[Depends(get_current_admin_user)],
)

public_router.get("/albums", response_model=list[AlbumResponse])(list_albums)
public_router.get("/albums/{album_id}", response_model=AlbumResponse)(get_album)

admin_router.post("/albums", response_model=AlbumResponse, status_code=201)(create_album)
admin_router.put("/albums/{album_id}", response_model=AlbumResponse)(update_album)
admin_router.delete("/albums/{album_id}")(delete_album)
admin_router.post("/media/upload", response_model=MediaUploadResponse)(upload_media)
admin_router.delete("/media/{media_id}")(delete_media)