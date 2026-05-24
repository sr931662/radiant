from fastapi import APIRouter, Depends
from src.dependencies import get_current_user, get_current_admin_user
from src.controllers.admission_controller import apply, my_applications, list_all, get_one, update_status
from src.schemas.admission import AdmissionResponse, AdmissionListResponse

public_router = APIRouter(prefix="/api/v1/admissions", tags=["Admissions"])
admin_router = APIRouter(
    prefix="/api/v1/admin/admissions",
    tags=["Admin-Admissions"],
    dependencies=[Depends(get_current_admin_user)],
)

public_router.post("/", response_model=AdmissionResponse, status_code=201)(apply)
public_router.get("/my-applications", response_model=list[AdmissionResponse])(my_applications)

admin_router.get("/", response_model=AdmissionListResponse)(list_all)
admin_router.get("/{admission_id}", response_model=AdmissionResponse)(get_one)
admin_router.patch("/{admission_id}/status", response_model=AdmissionResponse)(update_status)