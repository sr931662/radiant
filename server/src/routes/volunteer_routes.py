from fastapi import APIRouter, Depends
from src.dependencies import get_current_user, get_current_admin_user
from src.schemas.volunteer import VolunteerResponse, InternshipResponse, VolunteerListResponse
from src.controllers.volunteer_controller import (
    apply_volunteer, apply_internship, my_applications, list_all, update_status,
)

public_router = APIRouter(prefix="/api/v1/volunteers", tags=["Volunteers"])
admin_router = APIRouter(
    prefix="/api/v1/admin/volunteers",
    tags=["Admin-Volunteers"],
    dependencies=[Depends(get_current_admin_user)],
)

public_router.post("/apply/volunteer", response_model=VolunteerResponse, status_code=201)(apply_volunteer)
public_router.post("/apply/internship", response_model=InternshipResponse, status_code=201)(apply_internship)
public_router.get("/my-applications", response_model=list[VolunteerResponse | InternshipResponse])(my_applications)

admin_router.get("", response_model=VolunteerListResponse)(list_all)
admin_router.patch("/{application_id}/{type}")(update_status)