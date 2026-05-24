import uuid
from fastapi import Depends, Query, Path, Body
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db
from src.dependencies import get_current_admin_user, get_current_user
from src.schemas.contact import ContactFormRequest, InquiryResponse, InquiryListResponse, InquiryReplyRequest
from src.schemas.common import APIResponse, PaginationQuery
from src.services.contact_service import ContactService


async def submit_inquiry(
    data: ContactFormRequest = Body(...),
    db: AsyncSession = Depends(get_db),
    current_user: dict | None = Depends(get_current_user),
) -> APIResponse:
    user_id = current_user["sub"] if current_user else None
    await ContactService.submit_inquiry(db, data.model_dump(), user_id)
    return APIResponse(message="Inquiry submitted")


async def list_inquiries(
    pagination: PaginationQuery = Depends(),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> InquiryListResponse:
    inquiries, total = await ContactService.list_inquiries(db, pagination.page, pagination.size)
    return InquiryListResponse(
        items=[InquiryResponse.model_validate(i) for i in inquiries],
        total=total,
        page=pagination.page,
        size=pagination.size,
        pages=(total + pagination.size - 1) // pagination.size,
    )


async def reply_to_inquiry(
    inquiry_id: uuid.UUID = Path(...),
    data: InquiryReplyRequest = Body(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> APIResponse:
    await ContactService.reply_to_inquiry(db, inquiry_id, data.reply)
    return APIResponse(message="Reply sent")