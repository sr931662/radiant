from fastapi import APIRouter, Depends
from src.dependencies import get_current_user, get_current_admin_user
from src.schemas.fdp import FdpListResponse, FdpResponse, FdpRegistrationResponse
from src.controllers.fdp_controller import (
    list_fdps, get_fdp, register, my_registrations,
    create_fdp, update_fdp, delete_fdp, get_registrations,
    update_registration_status, mark_attendance, generate_certificates,
)

public_router = APIRouter(prefix="/api/v1/fdp", tags=["FDPs"])
admin_router = APIRouter(
    prefix="/api/v1/admin/fdp",
    tags=["Admin-FDPs"],
    dependencies=[Depends(get_current_admin_user)],
)

public_router.get("", response_model=FdpListResponse)(list_fdps)
public_router.get("/my-registrations", response_model=list[FdpRegistrationResponse])(my_registrations)
public_router.get("/{fdp_id}", response_model=FdpResponse)(get_fdp)
public_router.post("/{fdp_id}/register", response_model=FdpRegistrationResponse)(register)

admin_router.get("", response_model=FdpListResponse)(list_fdps)
admin_router.post("", response_model=FdpResponse, status_code=201)(create_fdp)
admin_router.put("/{fdp_id}", response_model=FdpResponse)(update_fdp)
admin_router.delete("/{fdp_id}")(delete_fdp)
admin_router.get("/{fdp_id}/registrations", response_model=list[FdpRegistrationResponse])(get_registrations)
admin_router.patch("/{fdp_id}/registrations/{registration_id}", response_model=FdpRegistrationResponse)(update_registration_status)
admin_router.post("/{fdp_id}/attendance")(mark_attendance)
admin_router.post("/{fdp_id}/generate-certificates")(generate_certificates)