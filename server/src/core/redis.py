import redis.asyncio as aioredis
from src.config import settings

redis_client: aioredis.Redis | None = None


async def init_redis() -> None:
    global redis_client
    redis_client = aioredis.from_url(
        settings.redis_url,
        max_connections=settings.redis_max_connections,
        decode_responses=True,
    )


async def close_redis() -> None:
    global redis_client
    if redis_client:
        await redis_client.aclose()
        redis_client = None


async def get_redis() -> aioredis.Redis:
    if redis_client is None:
        raise RuntimeError("Redis not initialised")
    return redis_client
