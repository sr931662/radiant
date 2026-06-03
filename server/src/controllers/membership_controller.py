import uuid
from fastapi import Depends, Query, Path, Body
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db
from src.dependencies import get_current_user, get_current_admin_user
from src.schemas.membership import (
    MembershipApplyRequest, MembershipResponse, MembershipListResponse,
    ApproveMembershipRequest, MembershipCardResponse, MembershipPlanResponse,
    MembershipPlanCreateRequest,
)
from src.schemas.common import APIResponse, PaginationQuery
from src.services.membership_service import MembershipService


# ── Public ──
async def get_plans(
    db: AsyncSession = Depends(get_db),
) -> list[MembershipPlanResponse]:
    plans = await MembershipService.get_plans(db)
    return [MembershipPlanResponse.model_validate(p) for p in plans]


async def apply(
    data: MembershipApplyRequest = Body(...),
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> MembershipResponse:
    membership = await MembershipService.apply(db, current_user["sub"], data.plan_id)
    return MembershipResponse.model_validate(membership)


async def my_memberships(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> list[MembershipResponse]:
    memberships = await MembershipService.my_memberships(db, current_user["sub"])
    return [MembershipResponse.model_validate(m) for m in memberships]


async def download_card(
    membership_id: uuid.UUID = Path(...),
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> MembershipCardResponse:
    card = await MembershipService.download_card(db, current_user["sub"], membership_id)
    return MembershipCardResponse(**card)


async def renew(
    membership_id: uuid.UUID = Path(...),
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> MembershipResponse:
    membership = await MembershipService.renew(db, current_user["sub"], membership_id)
    return MembershipResponse.model_validate(membership)


# ── Admin ──
async def list_all(
    pagination: PaginationQuery = Depends(),
    status: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> MembershipListResponse:
    memberships, total = await MembershipService.list_all(db, pagination.page, pagination.size, status)
    return MembershipListResponse(
        items=[MembershipResponse.model_validate(m) for m in memberships],
        total=total,
        page=pagination.page,
        size=pagination.size,
        pages=(total + pagination.size - 1) // pagination.size,
    )


async def approve_reject(
    membership_id: uuid.UUID = Path(...),
    data: ApproveMembershipRequest = Body(...),
    db: AsyncSession = Depends(get_db),
    current_admin: dict = Depends(get_current_admin_user),
) -> MembershipResponse:
    membership = await MembershipService.approve_reject(db, membership_id, data.status, current_admin["sub"])
    return MembershipResponse.model_validate(membership)


async def export_data(
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> list[MembershipResponse]:
    memberships = await MembershipService.export_data(db)
    return [MembershipResponse.model_validate(m) for m in memberships]


async def create_plan(
    data: MembershipPlanCreateRequest = Body(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> MembershipPlanResponse:
    plan = await MembershipService.create_plan(db, data.name, data.type, data.price, data.duration_days, data.benefits)
    return MembershipPlanResponse.model_validate(plan)


async def delete_plan(
    plan_id: uuid.UUID = Path(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> dict:
    await MembershipService.delete_plan(db, plan_id)
    return {"message": "Plan deleted successfully"}