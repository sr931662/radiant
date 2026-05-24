import uuid
from fastapi import Depends, Query, Path, Body
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db
from src.dependencies import get_current_user, get_current_admin_user
from src.schemas.admission import (
    AdmissionApplyRequest, AdmissionResponse, AdmissionListResponse, AdmissionStatusUpdateRequest,
)
from src.schemas.common import APIResponse, PaginationQuery
from src.services.admission_service import AdmissionService


async def apply(
    data: AdmissionApplyRequest = Body(...),
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> AdmissionResponse:
    admission = await AdmissionService.apply(db, current_user["sub"], data.model_dump())
    return AdmissionResponse.model_validate(admission)


async def my_applications(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> list[AdmissionResponse]:
    applications = await AdmissionService.my_applications(db, current_user["sub"])
    return [AdmissionResponse.model_validate(a) for a in applications]


# Admin
async def list_all(
    pagination: PaginationQuery = Depends(),
    status: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> AdmissionListResponse:
    admissions, total = await AdmissionService.list_all(db, pagination.page, pagination.size, status)
    return AdmissionListResponse(
        items=[AdmissionResponse.model_validate(a) for a in admissions],
        total=total,
        page=pagination.page,
        size=pagination.size,
        pages=(total + pagination.size - 1) // pagination.size,
    )


async def get_one(
    admission_id: uuid.UUID = Path(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> AdmissionResponse:
    admission = await AdmissionService.get_one(db, admission_id)
    return AdmissionResponse.model_validate(admission)


async def update_status(
    admission_id: uuid.UUID = Path(...),
    data: AdmissionStatusUpdateRequest = Body(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> AdmissionResponse:
    admission = await AdmissionService.update_status(db, admission_id, data.status, data.remarks)
    return AdmissionResponse.model_validate(admission)