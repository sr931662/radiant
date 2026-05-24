import uuid
from datetime import datetime
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from src.models import ContactInquiry
from src.services.email_service import EmailService
from src.utils.exceptions import NotFoundException


class ContactService:
    @staticmethod
    async def submit_inquiry(db: AsyncSession, data: dict, user_id: uuid.UUID | None = None) -> ContactInquiry:
        inquiry = ContactInquiry(**data, user_id=user_id)
        db.add(inquiry)
        await db.commit()
        await db.refresh(inquiry)
        # Optionally auto-reply
        return inquiry

    @staticmethod
    async def list_inquiries(db: AsyncSession, page: int, size: int) -> tuple[list[ContactInquiry], int]:
        query = select(ContactInquiry).where(ContactInquiry.deleted_at == None).order_by(ContactInquiry.created_at.desc())
        count_query = select(func.count(ContactInquiry.id)).where(ContactInquiry.deleted_at == None)
        total = await db.scalar(count_query) or 0
        query = query.offset((page - 1) * size).limit(size)
        result = await db.execute(query)
        return list(result.scalars().all()), total

    @staticmethod
    async def reply_to_inquiry(db: AsyncSession, inquiry_id: uuid.UUID, reply: str) -> ContactInquiry:
        inquiry = await db.get(ContactInquiry, inquiry_id)
        if not inquiry:
            raise NotFoundException("Inquiry not found")
        inquiry.reply = reply
        inquiry.status = "REPLIED"
        inquiry.replied_at = datetime.utcnow()
        await db.commit()
        await db.refresh(inquiry)
        # Send reply email
        await EmailService.send_inquiry_reply(inquiry.email, inquiry.subject, reply)
        return inquiry