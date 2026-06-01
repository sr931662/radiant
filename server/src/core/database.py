from collections.abc import AsyncGenerator
import asyncpg
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase

from src.config import settings


def _normalize_async_database_url(database_url: str) -> str:
    if database_url.startswith("postgresql+asyncpg://"):
        return database_url
    if database_url.startswith("postgresql://"):
        return database_url.replace("postgresql://", "postgresql+asyncpg://", 1)
    if database_url.startswith("postgres://"):
        return database_url.replace("postgres://", "postgresql+asyncpg://", 1)
    return database_url


DATABASE_URL = _normalize_async_database_url(settings.database_url)

engine = create_async_engine(
    DATABASE_URL,
    echo=settings.db_echo,                     # False in production
    pool_size=settings.db_pool_size,           # 20
    max_overflow=settings.db_max_overflow,     # 10
    pool_pre_ping=True,
)

async_session_factory = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def validate_database_connection() -> None:
    """Verify the configured PostgreSQL database exists and is reachable."""
    try:
        async with engine.connect():
            return
    except asyncpg.InvalidCatalogNameError as exc:
        raise RuntimeError(
            "Database does not exist. Verify DATABASE_URL references an existing PostgreSQL database. "
            f"Current value: {settings.database_url}"
        ) from exc


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency that provides an async database session.
    Ensures session is closed even if an exception occurs.
    """
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
