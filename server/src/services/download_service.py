from datetime import datetime, timezone
import uuid
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models import DownloadItem
from src.utils.exceptions import NotFoundException


class DownloadService:
    @staticmethod
    async def list_items(db: AsyncSession, access_levels: list[str] | None = None) -> list[DownloadItem]:
        stmt = select(DownloadItem).where(DownloadItem.deleted_at == None)
        if access_levels:
            stmt = stmt.where(DownloadItem.access_level.in_(access_levels))
        result = await db.execute(
            stmt.order_by(DownloadItem.created_at.desc())
        )
        return list(result.scalars().all())

    @staticmethod
    async def get_item(db: AsyncSession, item_id: uuid.UUID) -> DownloadItem:
        item = await db.get(DownloadItem, item_id)
        if not item:
            raise NotFoundException("Download item not found")
        return item

    @staticmethod
    async def create_item(db: AsyncSession, data: dict) -> DownloadItem:
        item = DownloadItem(**data)
        db.add(item)
        await db.commit()
        await db.refresh(item)
        return item

    @staticmethod
    async def delete_item(db: AsyncSession, item_id: uuid.UUID) -> None:
        item = await DownloadService.get_item(db, item_id)
        item.deleted_at = datetime.now(timezone.utc)
        await db.commit()
