import uuid
from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.banner import Banner
from src.utils.exceptions import NotFoundException


class BannerService:
    @staticmethod
    async def list_active(db: AsyncSession) -> list[Banner]:
        stmt = (
            select(Banner)
            .where(Banner.deleted_at == None, Banner.is_active == True)
            .order_by(Banner.created_at.desc())
        )
        result = await db.execute(stmt)
        return list(result.scalars().all())

    @staticmethod
    async def list_all(db: AsyncSession) -> list[Banner]:
        stmt = select(Banner).where(Banner.deleted_at == None).order_by(Banner.created_at.desc())
        result = await db.execute(stmt)
        return list(result.scalars().all())

    @staticmethod
    async def create(db: AsyncSession, data: dict) -> Banner:
        banner = Banner(**data)
        db.add(banner)
        await db.commit()
        await db.refresh(banner)
        return banner

    @staticmethod
    async def update(db: AsyncSession, banner_id: uuid.UUID, data: dict) -> Banner:
        banner = await db.get(Banner, banner_id)
        if not banner or banner.deleted_at is not None:
            raise NotFoundException("Banner not found")
        for key, value in data.items():
            if hasattr(banner, key):
                setattr(banner, key, value)
        await db.commit()
        await db.refresh(banner)
        return banner

    @staticmethod
    async def delete(db: AsyncSession, banner_id: uuid.UUID) -> None:
        banner = await db.get(Banner, banner_id)
        if not banner or banner.deleted_at is not None:
            raise NotFoundException("Banner not found")
        banner.deleted_at = datetime.now(timezone.utc)
        await db.commit()
