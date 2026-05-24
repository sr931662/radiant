import uuid
from fastapi import Depends, Query, Path, Body
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db
from src.dependencies import get_current_user, get_current_admin_user
from src.schemas.volunteer import (
    VolunteerApplyRequest, InternshipApplyRequest, VolunteerResponse, InternshipResponse,
    VolunteerListResponse, ApplicationStatusUpdate,
)
from src.schemas.common import APIResponse, PaginationQuery
from src.services.volunteer_service import VolunteerService


async def apply_volunteer(
    data: VolunteerApplyRequest = Body(...),
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> VolunteerResponse:
    app = await VolunteerService.apply_volunteer(db, current_user["sub"], data.model_dump())
    return VolunteerResponse.model_validate(app)


async def apply_internship(
    data: InternshipApplyRequest = Body(...),
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> InternshipResponse:
    app = await VolunteerService.apply_internship(db, current_user["sub"], data.model_dump())
    return InternshipResponse.model_validate(app)


async def my_applications(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> list[VolunteerResponse | InternshipResponse]:
    applications = await VolunteerService.my_applications(db, current_user["sub"])
    # Determine type and return appropriate schema
    result = []
    for a in applications:
        if hasattr(a, "position"):
            result.append(InternshipResponse.model_validate(a))
        else:
            result.append(VolunteerResponse.model_validate(a))
    return result


# Admin
async def list_all(
    pagination: PaginationQuery = Depends(),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> VolunteerListResponse:
    apps, total = await VolunteerService.list_all(db, pagination.page, pagination.size)
    volunteer_items = [VolunteerResponse.model_validate(a) for a in apps if not hasattr(a, "position")]
    return VolunteerListResponse(
        items=volunteer_items,
        total=total,
        page=pagination.page,
        size=pagination.size,
        pages=(total + pagination.size - 1) // pagination.size,
    )


async def update_status(
    application_id: uuid.UUID = Path(...),
    type: str = Path(..., description="volunteer or internship"),
    data: ApplicationStatusUpdate = Body(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> APIResponse:
    await VolunteerService.update_status(db, application_id, type, data.status, data.remarks)
    return APIResponse(message="Application updated")