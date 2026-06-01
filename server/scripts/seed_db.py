"""Seed database with default roles and a super-admin user."""
import asyncio
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy import select

from src.config import settings
from src.models import Base, Role, User, UserRole
from src.core.security import hash_password

ROLE_NAMES = ["SUPER_ADMIN", "ADMIN", "FACULTY", "STUDENT", "VOLUNTEER", "PUBLIC"]

ADMIN_EMAIL = "admin@radiantngo.org"
ADMIN_PASSWORD = "Admin@1234"
ADMIN_NAME = "Super Admin"


def _normalize_url(url: str) -> str:
    url = url.replace("sslmode=require", "ssl=require")
    if url.startswith("postgresql+asyncpg://"):
        return url
    if url.startswith("postgresql://"):
        return url.replace("postgresql://", "postgresql+asyncpg://", 1)
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql+asyncpg://", 1)
    return url


async def seed() -> None:
    engine = create_async_engine(_normalize_url(settings.database_url), echo=False)
    session_factory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Tables ensured.")

    async with session_factory() as db:
        # Seed roles
        for role_name in ROLE_NAMES:
            existing = await db.scalar(select(Role).where(Role.name == role_name))
            if not existing:
                db.add(Role(name=role_name))
                print(f"  + Role: {role_name}")
        await db.commit()

        # Seed super-admin user
        admin = await db.scalar(select(User).where(User.email == ADMIN_EMAIL))
        if admin:
            print(f"Admin already exists: {ADMIN_EMAIL}")
        else:
            super_admin_role = await db.scalar(select(Role).where(Role.name == "SUPER_ADMIN"))
            if not super_admin_role:
                raise RuntimeError("SUPER_ADMIN role not found — role seeding may have failed.")

            admin = User(
                email=ADMIN_EMAIL,
                password=hash_password(ADMIN_PASSWORD),
                name=ADMIN_NAME,
                is_email_verified=True,
            )
            db.add(admin)
            await db.flush()  # populate admin.id before creating UserRole

            db.add(UserRole(user_id=admin.id, role_id=super_admin_role.id))
            await db.commit()
            print(f"Admin user created: {ADMIN_EMAIL} / {ADMIN_PASSWORD}")

    print("Database seeded successfully.")
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed())
