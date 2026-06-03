"""Seed database with default roles, super-admin user, and membership plans."""
import asyncio
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy import select

from src.config import settings
from src.models import Base, Role, User, UserRole
from src.models.membership_plan import MembershipPlan
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
            await db.flush()
            db.add(UserRole(user_id=admin.id, role_id=super_admin_role.id))
            await db.commit()
            print(f"Admin user created: {ADMIN_EMAIL} / {ADMIN_PASSWORD}")

        # Seed membership plans
        MEMBERSHIP_PLANS = [
            {
                "name": "Student Member",
                "type": "STUDENT",
                "price": 500.0,
                "duration_days": 365,
                "benefits": {
                    "1": "Certificate of Membership issued by the Trust",
                    "2": "Access to seminars, workshops, and training programs",
                    "3": "Eligibility to volunteer and participate in Trust projects",
                    "4": "Regular updates on Trust activities and events",
                    "5": "Support for skill development and education initiatives",
                },
            },
            {
                "name": "Annual Member",
                "type": "ANNUAL",
                "price": 1100.0,
                "duration_days": 365,
                "benefits": {
                    "1": "Certificate of Membership issued by the Trust",
                    "2": "Access to seminars, workshops, training programs, and awareness campaigns",
                    "3": "Networking with professionals, educators, researchers, and community leaders",
                    "4": "Eligibility to volunteer and participate in Trust projects and outreach programs",
                    "5": "Regular updates on Trust activities, events, and development initiatives",
                    "6": "Opportunity to serve on committees, project teams, and advisory groups",
                    "7": "Recognition and appreciation for outstanding contributions",
                },
            },
            {
                "name": "Life Member",
                "type": "LIFE",
                "price": 5000.0,
                "duration_days": 36500,
                "benefits": {
                    "1": "Lifetime Certificate of Membership issued by the Trust",
                    "2": "Access to all seminars, workshops, training programs, and awareness campaigns",
                    "3": "Networking with professionals, educators, researchers, social workers, and community leaders",
                    "4": "Eligibility to volunteer and participate in all Trust projects and outreach programs",
                    "5": "Regular updates on Trust activities, events, and development initiatives",
                    "6": "Opportunity to serve on committees, project teams, and advisory groups",
                    "7": "Recognition and appreciation for outstanding contributions to the Trust",
                    "8": "Participation in meetings subject to Trust rules and regulations",
                    "9": "Access to selected educational, career guidance, and community service programs",
                    "10": "Priority consideration for leadership roles within the Trust",
                },
            },
        ]

        for plan_data in MEMBERSHIP_PLANS:
            existing_plan = await db.scalar(
                select(MembershipPlan).where(
                    MembershipPlan.name == plan_data["name"],
                    MembershipPlan.deleted_at == None,
                )
            )
            if not existing_plan:
                db.add(MembershipPlan(**plan_data))
                print(f"  + Membership Plan: {plan_data['name']} (₹{plan_data['price']})")
            else:
                print(f"  Plan already exists: {plan_data['name']}")
        await db.commit()

    print("Database seeded successfully.")
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed())
