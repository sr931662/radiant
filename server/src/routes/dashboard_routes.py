from fastapi import APIRouter, Depends
from src.dependencies import get_current_admin_user
from src.schemas.dashboard import DashboardStatsResponse, RecentActivityResponse
from src.controllers.dashboard_controller import get_stats, recent_activity

router = APIRouter(
    prefix="/api/v1/admin/dashboard",
    tags=["Dashboard"],
    dependencies=[Depends(get_current_admin_user)],
)

router.get("/stats", response_model=DashboardStatsResponse)(get_stats)
router.get("/activity", response_model=list[RecentActivityResponse])(recent_activity)