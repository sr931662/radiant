import uuid
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from src.models import VolunteerApplication, InternshipApplication
from src.utils.exceptions import NotFoundException


class VolunteerService:
    @staticmethod
    async def apply_volunteer(db: AsyncSession, user_id: uuid.UUID, data: dict) -> VolunteerApplication:
        application = VolunteerApplication(user_id=user_id, **data)
        db.add(application)
        await db.commit()
        await db.refresh(application)
        return application

    @staticmethod
    async def apply_internship(db: AsyncSession, user_id: uuid.UUID, data: dict) -> InternshipApplication:
        application = InternshipApplication(user_id=user_id, **data)
        db.add(application)
        await db.commit()
        await db.refresh(application)
        return application

    @staticmethod
    async def my_applications(db: AsyncSession, user_id: uuid.UUID) -> list:
        volunteer_stmt = select(VolunteerApplication).where(VolunteerApplication.user_id == user_id)
        internship_stmt = select(InternshipApplication).where(InternshipApplication.user_id == user_id)
        volunteer_result = await db.execute(volunteer_stmt)
        internship_result = await db.execute(internship_stmt)
        return list(volunteer_result.scalars().all()) + list(internship_result.scalars().all())

    # Admin
    @staticmethod
    async def list_all(db: AsyncSession, page: int, size: int) -> tuple[list, int]:
        volunteer_query = select(VolunteerApplication).where(VolunteerApplication.deleted_at == None)
        internship_query = select(InternshipApplication).where(InternshipApplication.deleted_at == None)
        # Combine? We'll treat them as separate collections. For simplicity, return both but can be refined.
        volunteer_result = await db.execute(volunteer_query)
        internship_result = await db.execute(internship_query)
        all_apps = list(volunteer_result.scalars().all()) + list(internship_result.scalars().all())
        total = len(all_apps)
        # Pagination manually
        start = (page - 1) * size
        end = start + size
        return all_apps[start:end], total

    @staticmethod
    async def update_status(db: AsyncSession, application_id: uuid.UUID, app_type: str, status: str, remarks: str | None = None):
        if app_type == "volunteer":
            app = await db.get(VolunteerApplication, application_id)
        else:
            app = await db.get(InternshipApplication, application_id)
        if not app:
            raise NotFoundException("Application not found")
        app.status = status
        if remarks:
            app.remarks = remarks
        await db.commit()
        await db.refresh(app)
        return app