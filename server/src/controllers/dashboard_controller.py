from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db
from src.dependencies import get_current_admin_user
from src.schemas.dashboard import DashboardStatsResponse, RecentActivityResponse
from src.services.dashboard_service import DashboardService


async def get_stats(
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> DashboardStatsResponse:
    stats = await DashboardService.get_stats(db)
    return DashboardStatsResponse(**stats)


async def recent_activity(
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> list[RecentActivityResponse]:
    logs = await DashboardService.recent_activity(db)
    return [RecentActivityResponse(
        id=str(log.id),
        action=log.action,
        resource=log.resource,
        user=log.user.name if log.user else "System",
        timestamp=log.created_at.isoformat(),
    ) for log in logs]