import uuid
from urllib.parse import urlparse
from fastapi import Depends, Path, Body, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db
from src.dependencies import get_current_admin_user
from src.schemas.download import DownloadItemCreateRequest, DownloadItemResponse
from src.schemas.common import APIResponse
from src.services.download_service import DownloadService
from starlette.responses import RedirectResponse

# Only allow redirects to trusted domains
_ALLOWED_REDIRECT_HOSTS = {
    "res.cloudinary.com",
    "storage.googleapis.com",
    "s3.amazonaws.com",
}


def _validate_redirect_url(url: str) -> str:
    """Raise 400 if the redirect target is not on an allowlisted host."""
    try:
        parsed = urlparse(url)
        host = parsed.hostname or ""
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid file URL")
    if not any(host == allowed or host.endswith(f".{allowed}") for allowed in _ALLOWED_REDIRECT_HOSTS):
        raise HTTPException(
            status_code=400,
            detail="File URL host is not permitted",
        )
    return url


async def list_items(
    db: AsyncSession = Depends(get_db),
) -> list[DownloadItemResponse]:
    items = await DownloadService.list_items(db)
    return [DownloadItemResponse.model_validate(i) for i in items]


async def download_file(
    item_id: uuid.UUID = Path(...),
    db: AsyncSession = Depends(get_db),
) -> RedirectResponse:
    item = await DownloadService.get_item(db, item_id)
    safe_url = _validate_redirect_url(item.file_url)
    return RedirectResponse(url=safe_url)


async def create_item(
    data: DownloadItemCreateRequest = Body(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> DownloadItemResponse:
    item = await DownloadService.create_item(db, data.model_dump())
    return DownloadItemResponse.model_validate(item)


async def delete_item(
    item_id: uuid.UUID = Path(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> APIResponse:
    await DownloadService.delete_item(db, item_id)
    return APIResponse(message="Item deleted")
