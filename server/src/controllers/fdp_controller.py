import uuid
from fastapi import Depends, Query, Path, Body
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db
from src.dependencies import get_current_user, get_current_admin_user
from src.schemas.fdp import (
    FdpCreateRequest, FdpUpdateRequest, FdpResponse, FdpListResponse,
    FdpRegistrationRequest, FdpRegistrationResponse, AttendanceBulkItem,
)
from src.schemas.common import APIResponse, PaginationQuery
from src.services.fdp_service import FdpService
from src.core.cache import cache_get, cache_set, cache_delete


# ── Public ──
async def list_fdps(
    pagination: PaginationQuery = Depends(),
    db: AsyncSession = Depends(get_db),
) -> FdpListResponse:
    cache_key = f"fdp:list:{pagination.page}:{pagination.size}"
    cached = await cache_get(cache_key)
    if cached:
        return FdpListResponse(**cached)

    fdps, total = await FdpService.list_fdps(db, pagination.page, pagination.size)
    response = FdpListResponse(
        items=[FdpResponse.model_validate(f) for f in fdps],
        total=total,
        page=pagination.page,
        size=pagination.size,
        pages=(total + pagination.size - 1) // pagination.size,
    )
    await cache_set(cache_key, response.model_dump(), ttl=60)
    return response


async def get_fdp(
    fdp_id: uuid.UUID = Path(...),
    db: AsyncSession = Depends(get_db),
) -> FdpResponse:
    fdp = await FdpService.get_fdp(db, fdp_id)
    return FdpResponse.model_validate(fdp)


async def register(
    fdp_id: uuid.UUID = Path(...),
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> FdpRegistrationResponse:
    reg = await FdpService.register(db, current_user["sub"], fdp_id)
    return FdpRegistrationResponse.model_validate(reg)


async def my_registrations(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> list[FdpRegistrationResponse]:
    registrations = await FdpService.my_registrations(db, current_user["sub"])
    return [FdpRegistrationResponse.model_validate(r) for r in registrations]


# ── Admin ──
async def create_fdp(
    data: FdpCreateRequest = Body(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> FdpResponse:
    fdp = await FdpService.create_fdp(db, data.model_dump())
    await cache_delete("fdp:list:*")
    return FdpResponse.model_validate(fdp)


async def update_fdp(
    fdp_id: uuid.UUID = Path(...),
    data: FdpUpdateRequest = Body(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> FdpResponse:
    fdp = await FdpService.update_fdp(db, fdp_id, data.model_dump(exclude_none=True))
    await cache_delete("fdp:list:*")
    return FdpResponse.model_validate(fdp)


async def delete_fdp(
    fdp_id: uuid.UUID = Path(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> APIResponse:
    await FdpService.delete_fdp(db, fdp_id)
    await cache_delete("fdp:list:*")
    return APIResponse(message="FDP deleted")


async def get_registrations(
    fdp_id: uuid.UUID = Path(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> list[FdpRegistrationResponse]:
    registrations = await FdpService.get_registrations(db, fdp_id)
    return [FdpRegistrationResponse.model_validate(r) for r in registrations]


async def update_registration_status(
    fdp_id: uuid.UUID = Path(...),
    registration_id: uuid.UUID = Path(...),
    status: str = Query(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> FdpRegistrationResponse:
    reg = await FdpService.update_registration_status(db, registration_id, status)
    return FdpRegistrationResponse.model_validate(reg)


async def mark_attendance(
    fdp_id: uuid.UUID = Path(...),
    records: list[AttendanceBulkItem] = Body(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> APIResponse:
    await FdpService.mark_attendance(db, fdp_id, [r.model_dump() for r in records])
    return APIResponse(message="Attendance marked")


async def generate_certificates(
    fdp_id: uuid.UUID = Path(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> APIResponse:
    certs = await FdpService.generate_certificates(db, fdp_id)
    return APIResponse(message=f"{len(certs)} certificates generated")