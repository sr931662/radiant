import uuid
from fastapi import Depends, Body, Path
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db
from src.dependencies import get_current_admin_user
from src.schemas.landing_lead import (
    LandingLeadCreateRequest, LandingLeadResponse, LandingLeadListResponse, LandingLeadStatusUpdateRequest,
)
from src.schemas.common import APIResponse, PaginationQuery
from src.services.landing_lead_service import LandingLeadService


async def submit_lead(
    data: LandingLeadCreateRequest = Body(...),
    db: AsyncSession = Depends(get_db),
) -> APIResponse:
    await LandingLeadService.submit_lead(db, data.model_dump())
    return APIResponse(message="Lead submitted")


async def list_leads(
    pagination: PaginationQuery = Depends(),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> LandingLeadListResponse:
    leads, total = await LandingLeadService.list_leads(db, pagination.page, pagination.size)
    return LandingLeadListResponse(
        items=[LandingLeadResponse.model_validate(l) for l in leads],
        total=total,
        page=pagination.page,
        size=pagination.size,
        pages=(total + pagination.size - 1) // pagination.size,
    )


async def update_lead_status(
    lead_id: uuid.UUID = Path(...),
    data: LandingLeadStatusUpdateRequest = Body(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> LandingLeadResponse:
    lead = await LandingLeadService.update_status(db, lead_id, data.status)
    return LandingLeadResponse.model_validate(lead)
