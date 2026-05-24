import uuid
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from src.models import Admission
from src.utils.exceptions import NotFoundException, BadRequestException


class AdmissionService:
    @staticmethod
    async def apply(db: AsyncSession, user_id: uuid.UUID, data: dict) -> Admission:
        admission = Admission(user_id=user_id, **data)
        db.add(admission)
        await db.commit()
        await db.refresh(admission)
        return admission

    @staticmethod
    async def my_applications(db: AsyncSession, user_id: uuid.UUID) -> list[Admission]:
        result = await db.execute(
            select(Admission).where(Admission.user_id == user_id, Admission.deleted_at == None)
        )
        return list(result.scalars().all())

    # Admin
    @staticmethod
    async def list_all(db: AsyncSession, page: int, size: int, status: str | None = None) -> tuple[list[Admission], int]:
        query = select(Admission).where(Admission.deleted_at == None)
        count_query = select(func.count(Admission.id)).where(Admission.deleted_at == None)

        if status:
            query = query.where(Admission.status == status)
            count_query = count_query.where(Admission.status == status)

        total = await db.scalar(count_query) or 0
        query = query.offset((page - 1) * size).limit(size)
        result = await db.execute(query)
        admissions = list(result.scalars().all())
        return admissions, total

    @staticmethod
    async def get_one(db: AsyncSession, admission_id: uuid.UUID) -> Admission:
        admission = await db.get(Admission, admission_id)
        if not admission:
            raise NotFoundException("Admission application not found")
        return admission

    @staticmethod
    async def update_status(db: AsyncSession, admission_id: uuid.UUID, status: str, remarks: str | None = None) -> Admission:
        admission = await AdmissionService.get_one(db, admission_id)
        admission.status = status
        if remarks:
            admission.remarks = remarks
        await db.commit()
        await db.refresh(admission)
        return admission