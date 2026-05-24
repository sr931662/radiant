"""Seed database with default roles, permissions, admin user."""
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy import select

from src.config import settings
from src.models.base import Base
from src.models.role import Role, RoleName
from src.models.user import User
from src.core.security import hash_password

engine = create_async_engine(settings.DATABASE_URL)
SessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with SessionLocal() as db:
        for role_name in RoleName:
            existing = await db.scalar(select(Role).where(Role.name == role_name))
            if not existing:
                db.add(Role(name=role_name))
        await db.commit()

        admin_email = "admin@radiantngo.org"
        admin = await db.scalar(select(User).where(User.email == admin_email))
        if not admin:
            super_admin_role = await db.scalar(select(Role).where(Role.name == RoleName.SUPER_ADMIN))
            admin = User(
                email=admin_email,
                password_hash=hash_password("Admin@1234"),
                first_name="Super",
                last_name="Admin",
                is_email_verified=True,
            )
            admin.roles = [super_admin_role]
            db.add(admin)
            await db.commit()
            print(f"Admin user created: {admin_email}")

    print("Database seeded successfully.")


if __name__ == "__main__":
    asyncio.run(seed())
