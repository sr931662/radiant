from __future__ import annotations
import logging
from typing import Any

from src.config import settings

logger = logging.getLogger(__name__)

redis_client: Any = None


async def init_redis() -> None:
    global redis_client
    if not settings.redis_url:
        logger.info("Redis not configured — running without Redis")
        return
    try:
        import redis.asyncio as aioredis
        client = aioredis.from_url(
            settings.redis_url,
            max_connections=settings.redis_max_connections,
            decode_responses=True,
        )
        await client.ping()
        redis_client = client
        logger.info("Redis connected: %s", settings.redis_url)
    except Exception as exc:
        logger.warning("Redis unavailable (%s) — continuing without it", exc)
        redis_client = None


async def close_redis() -> None:
    global redis_client
    if redis_client is not None:
        await redis_client.aclose()
        redis_client = None


async def get_redis() -> Any:
    """Return the Redis client, or None if Redis is not available."""
    return redis_client


def redis_available() -> bool:
    return redis_client is not None
