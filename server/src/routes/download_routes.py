from fastapi import APIRouter, Depends
from src.dependencies import get_current_admin_user
from src.schemas.download import DownloadItemResponse
from src.controllers.download_controller import list_items, download_file, create_item, delete_item

public_router = APIRouter(prefix="/api/v1/downloads", tags=["Downloads"])
admin_router = APIRouter(
    prefix="/api/v1/admin/downloads",
    tags=["Admin-Downloads"],
    dependencies=[Depends(get_current_admin_user)],
)

public_router.get("/", response_model=list[DownloadItemResponse])(list_items)
public_router.get("/{item_id}")(download_file)

admin_router.post("/", response_model=DownloadItemResponse, status_code=201)(create_item)
admin_router.delete("/{item_id}")(delete_item)