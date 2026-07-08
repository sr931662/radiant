import uuid
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from src.models import LandingLead
from src.utils.exceptions import NotFoundException


class LandingLeadService:
    @staticmethod
    async def submit_lead(db: AsyncSession, data: dict) -> LandingLead:
        lead = LandingLead(**data)
        db.add(lead)
        await db.commit()
        await db.refresh(lead)
        return lead

    @staticmethod
    async def list_leads(db: AsyncSession, page: int, size: int) -> tuple[list[LandingLead], int]:
        query = select(LandingLead).where(LandingLead.deleted_at == None).order_by(LandingLead.created_at.desc())
        count_query = select(func.count(LandingLead.id)).where(LandingLead.deleted_at == None)
        total = await db.scalar(count_query) or 0
        query = query.offset((page - 1) * size).limit(size)
        result = await db.execute(query)
        return list(result.scalars().all()), total

    @staticmethod
    async def update_status(db: AsyncSession, lead_id: uuid.UUID, status: str) -> LandingLead:
        lead = await db.get(LandingLead, lead_id)
        if not lead:
            raise NotFoundException("Lead not found")
        lead.status = status
        await db.commit()
        await db.refresh(lead)
        return lead
