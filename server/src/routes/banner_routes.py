from fastapi import APIRouter, Depends
from src.dependencies import get_current_admin_user
from src.schemas.banner import BannerResponse
from src.schemas.common import APIResponse
from src.controllers.banner_controller import (
    list_active_banners,
    list_all_banners,
    create_banner,
    update_banner,
    delete_banner,
)

public_router = APIRouter(prefix="/api/v1/banners", tags=["Banners"])
admin_router = APIRouter(
    prefix="/api/v1/admin/banners",
    tags=["Admin-Banners"],
    dependencies=[Depends(get_current_admin_user)],
)

public_router.get("", response_model=list[BannerResponse])(list_active_banners)

admin_router.get("", response_model=list[BannerResponse])(list_all_banners)
admin_router.post("", response_model=BannerResponse, status_code=201)(create_banner)
admin_router.put("/{banner_id}", response_model=BannerResponse)(update_banner)
admin_router.delete("/{banner_id}", response_model=APIResponse)(delete_banner)
