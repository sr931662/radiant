import json
import uuid
from fastapi import Depends, Request, Body, Query, Path, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db
from src.dependencies import get_current_user, get_current_user_optional, get_current_admin_user
from src.schemas.donation import (
    CreateOrderRequest, VerifyPaymentRequest, DonationResponse, DonationListResponse, DonationStatsResponse,
)
from src.schemas.common import APIResponse, PaginationQuery
from src.services.donation_service import DonationService


async def create_order(
    data: CreateOrderRequest = Body(...),
    db: AsyncSession = Depends(get_db),
    current_user: dict | None = Depends(get_current_user_optional),
) -> dict:
    user_id = current_user["sub"] if current_user else None
    order = await DonationService.create_order(db, user_id, data.amount, data.anonymous)
    return order


async def verify_payment(
    data: VerifyPaymentRequest = Body(...),
    db: AsyncSession = Depends(get_db),
    current_user: dict | None = Depends(get_current_user_optional),
) -> DonationResponse:
    donation = await DonationService.verify_payment(
        db, data.razorpay_order_id, data.razorpay_payment_id, data.razorpay_signature,
    )
    return DonationResponse.model_validate(donation)


async def simulate_payment(
    data: CreateOrderRequest = Body(...),
    db: AsyncSession = Depends(get_db),
    current_user: dict | None = Depends(get_current_user_optional),
) -> DonationResponse:
    from src.config import settings
    if settings.environment == "production":
        raise HTTPException(status_code=403, detail="Simulate endpoint is disabled in production.")
    user_id = current_user["sub"] if current_user else None
    donation = await DonationService.simulate_payment(db, user_id, data.amount, data.anonymous)
    return DonationResponse.model_validate(donation)


async def webhook(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> dict:
    # Read raw bytes BEFORE json parsing — Razorpay signature is over the raw body
    raw_body = await request.body()
    signature = request.headers.get("x-razorpay-signature", "")
    try:
        payload = json.loads(raw_body)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")
    await DonationService.webhook_handler(db, raw_body, signature, payload)
    return {"status": "ok"}


async def my_history(
    pagination: PaginationQuery = Depends(),
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> DonationListResponse:
    donations, total = await DonationService.my_history(db, current_user["sub"], pagination.page, pagination.size)
    return DonationListResponse(
        items=[DonationResponse.model_validate(d) for d in donations],
        total=total,
        page=pagination.page,
        size=pagination.size,
        pages=(total + pagination.size - 1) // pagination.size,
    )


async def download_receipt(
    donation_id: uuid.UUID = Path(...),
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> dict:
    url = await DonationService.get_receipt(db, donation_id, requesting_user_id=current_user["sub"])
    return {"receipt_url": url}


# Admin
async def list_all(
    pagination: PaginationQuery = Depends(),
    status: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> DonationListResponse:
    donations, total = await DonationService.list_all(db, pagination.page, pagination.size, status)
    return DonationListResponse(
        items=[DonationResponse.model_validate(d) for d in donations],
        total=total,
        page=pagination.page,
        size=pagination.size,
        pages=(total + pagination.size - 1) // pagination.size,
    )


async def stats(
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> DonationStatsResponse:
    result = await DonationService.stats(db)
    return DonationStatsResponse(**result)


async def export_data(
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> list[DonationResponse]:
    donations = await DonationService.export_data(db)
    return [DonationResponse.model_validate(d) for d in donations]
