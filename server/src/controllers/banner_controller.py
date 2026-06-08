import uuid
from fastapi import Depends, Path, Body
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db
from src.dependencies import get_current_admin_user
from src.schemas.banner import BannerCreateRequest, BannerUpdateRequest, BannerResponse
from src.schemas.common import APIResponse
from src.services.banner_service import BannerService
from src.core.cache import cache_get, cache_set, cache_delete


_ACTIVE_CACHE_KEY = "banners:active"


# ── Public ──
async def list_active_banners(
    db: AsyncSession = Depends(get_db),
) -> list[BannerResponse]:
    cached = await cache_get(_ACTIVE_CACHE_KEY)
    if cached:
        return [BannerResponse(**b) for b in cached]
    banners = await BannerService.list_active(db)
    response = [BannerResponse.model_validate(b) for b in banners]
    await cache_set(_ACTIVE_CACHE_KEY, [r.model_dump(mode="json") for r in response], ttl=300)
    return response


# ── Admin ──
async def list_all_banners(
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> list[BannerResponse]:
    banners = await BannerService.list_all(db)
    return [BannerResponse.model_validate(b) for b in banners]


async def create_banner(
    data: BannerCreateRequest = Body(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> BannerResponse:
    banner = await BannerService.create(db, data.model_dump())
    await cache_delete(_ACTIVE_CACHE_KEY)
    return BannerResponse.model_validate(banner)


async def update_banner(
    banner_id: uuid.UUID = Path(...),
    data: BannerUpdateRequest = Body(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> BannerResponse:
    banner = await BannerService.update(db, banner_id, data.model_dump(exclude_none=True))
    await cache_delete(_ACTIVE_CACHE_KEY)
    return BannerResponse.model_validate(banner)


async def delete_banner(
    banner_id: uuid.UUID = Path(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> APIResponse:
    await BannerService.delete(db, banner_id)
    await cache_delete(_ACTIVE_CACHE_KEY)
    return APIResponse(message="Banner deleted")
