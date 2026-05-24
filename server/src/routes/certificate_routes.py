from fastapi import APIRouter, Depends
from src.dependencies import get_current_admin_user
from src.schemas.certificate import CertificateVerifyResponse, CertificateResponse
from src.controllers.certificate_controller import verify, generate

public_router = APIRouter(prefix="/api/v1/certificates", tags=["Certificates"])
admin_router = APIRouter(
    prefix="/api/v1/admin/certificates",
    tags=["Admin-Certificates"],
    dependencies=[Depends(get_current_admin_user)],
)

public_router.get("/verify", response_model=CertificateVerifyResponse)(verify)
admin_router.post("/generate", response_model=CertificateResponse, status_code=201)(generate)