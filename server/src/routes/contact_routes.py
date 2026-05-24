from fastapi import APIRouter, Depends
from src.dependencies import get_current_admin_user
from src.schemas.contact import InquiryListResponse
from src.controllers.contact_controller import submit_inquiry, list_inquiries, reply_to_inquiry

public_router = APIRouter(prefix="/api/v1/contact", tags=["Contact"])
admin_router = APIRouter(
    prefix="/api/v1/admin/contacts",
    tags=["Admin-Contact"],
    dependencies=[Depends(get_current_admin_user)],
)

public_router.post("/", status_code=201)(submit_inquiry)
admin_router.get("/", response_model=InquiryListResponse)(list_inquiries)
admin_router.patch("/{inquiry_id}/reply")(reply_to_inquiry)