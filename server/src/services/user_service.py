import uuid
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from src.models import User, UserRole, Role
from src.utils.exceptions import NotFoundException, BadRequestException


class UserService:
    @staticmethod
    async def list_users(db: AsyncSession, page: int, size: int, role_filter: str | None = None) -> tuple[list[User], int]:
        query = select(User).where(User.deleted_at == None)
        count_query = select(func.count(User.id)).where(User.deleted_at == None)

        if role_filter:
            query = query.join(UserRole).join(Role).where(Role.name == role_filter)
            count_query = count_query.join(UserRole).join(Role).where(Role.name == role_filter)

        total = await db.scalar(count_query) or 0
        query = query.offset((page - 1) * size).limit(size)
        result = await db.execute(query)
        users = list(result.scalars().all())
        return users, total

    @staticmethod
    async def get_user(db: AsyncSession, user_id: uuid.UUID) -> User:
        user = await db.get(User, user_id)
        if not user:
            raise NotFoundException("User not found")
        return user

    @staticmethod
    async def update_user(db: AsyncSession, user_id: uuid.UUID, data: dict) -> User:
        user = await UserService.get_user(db, user_id)
        for key, value in data.items():
            if value is not None and hasattr(user, key):
                setattr(user, key, value)
        await db.commit()
        await db.refresh(user)
        return user

    @staticmethod
    async def ban_user(db: AsyncSession, user_id: uuid.UUID, ban: bool) -> User:
        user = await UserService.get_user(db, user_id)
        user.is_banned = ban
        await db.commit()
        await db.refresh(user)
        return user

    @staticmethod
    async def change_role(db: AsyncSession, user_id: uuid.UUID, role_names: list[str]) -> User:
        user = await UserService.get_user(db, user_id)

        # Remove existing roles
        for user_role in user.roles:
            await db.delete(user_role)
        await db.commit()

        # Add new roles
        role_stmt = select(Role).where(Role.name.in_(role_names))
        result = await db.execute(role_stmt)
        roles = result.scalars().all()

        for role in roles:
            user_role = UserRole(user_id=user.id, role_id=role.id)
            db.add(user_role)
        await db.commit()
        await db.refresh(user)
        return user