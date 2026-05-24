import uuid
from fastapi import Depends, Path, Body, Response
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db
from src.dependencies import get_current_admin_user
from src.schemas.download import DownloadItemCreateRequest, DownloadItemResponse
from src.schemas.common import APIResponse
from src.services.download_service import DownloadService
from starlette.responses import RedirectResponse


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
    return RedirectResponse(url=item.file_url)


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