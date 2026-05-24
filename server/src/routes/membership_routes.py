from fastapi import APIRouter, Depends
from src.dependencies import get_current_user, get_current_admin_user
from src.schemas.membership import MembershipPlanResponse, MembershipResponse, MembershipListResponse, MembershipCardResponse
from src.controllers.membership_controller import (
    get_plans, apply, my_memberships, download_card, renew,
    list_all, approve_reject, export_data,
)

public_router = APIRouter(prefix="/api/v1/memberships", tags=["Memberships"])
admin_router = APIRouter(
    prefix="/api/v1/admin/memberships",
    tags=["Admin-Memberships"],
    dependencies=[Depends(get_current_admin_user)],
)

public_router.get("/plans", response_model=list[MembershipPlanResponse])(get_plans)
public_router.post("/apply", response_model=MembershipResponse, status_code=201)(apply)
public_router.get("/my-memberships", response_model=list[MembershipResponse])(my_memberships)
public_router.get("/{membership_id}/card", response_model=MembershipCardResponse)(download_card)
public_router.post("/{membership_id}/renew", response_model=MembershipResponse)(renew)

admin_router.get("/", response_model=MembershipListResponse)(list_all)
admin_router.patch("/{membership_id}/approve", response_model=MembershipResponse)(approve_reject)
admin_router.get("/export")(export_data)