from fastapi import APIRouter, Depends
from src.dependencies import get_current_user, get_current_admin_user
from src.schemas.donation import DonationResponse, DonationListResponse, DonationStatsResponse
from src.controllers.donation_controller import (
    create_order, verify_payment, webhook, my_history, download_receipt,
    list_all, stats, export_data,
)

public_router = APIRouter(prefix="/api/v1/donations", tags=["Donations"])
admin_router = APIRouter(
    prefix="/api/v1/admin/donations",
    tags=["Admin-Donations"],
    dependencies=[Depends(get_current_admin_user)],
)

public_router.post("/create-order")(create_order)
public_router.post("/verify", response_model=DonationResponse)(verify_payment)
public_router.post("/webhook", include_in_schema=False)(webhook)
public_router.get("/history", response_model=DonationListResponse)(my_history)
public_router.get("/{donation_id}/receipt")(download_receipt)

admin_router.get("/", response_model=DonationListResponse)(list_all)
admin_router.get("/stats", response_model=DonationStatsResponse)(stats)
admin_router.get("/export")(export_data)