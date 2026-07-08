from fastapi import APIRouter, Depends
from src.dependencies import get_current_admin_user
from src.schemas.landing_lead import LandingLeadListResponse, LandingLeadResponse
from src.controllers.landing_lead_controller import submit_lead, list_leads, update_lead_status

public_router = APIRouter(prefix="/api/v1/landing-leads", tags=["Landing-Leads"])
admin_router = APIRouter(
    prefix="/api/v1/admin/landing-leads",
    tags=["Admin-Landing-Leads"],
    dependencies=[Depends(get_current_admin_user)],
)

public_router.post("", status_code=201)(submit_lead)
admin_router.get("", response_model=LandingLeadListResponse)(list_leads)
admin_router.patch("/{lead_id}/status", response_model=LandingLeadResponse)(update_lead_status)
