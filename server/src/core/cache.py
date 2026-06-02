"""Simple Redis-backed response cache. Falls back to no-cache if Redis is unavailable."""
from __future__ import annotations

import json
import logging
from typing import Any

from src.core.redis import get_redis

logger = logging.getLogger(__name__)

_MISSING = object()


async def cache_get(key: str) -> Any:
    r = await get_redis()
    if not r:
        return None
    try:
        val = await r.get(key)
        return json.loads(val) if val else None
    except Exception as exc:
        logger.warning("cache_get failed for %s: %s", key, exc)
        return None


async def cache_set(key: str, value: Any, ttl: int = 300) -> None:
    r = await get_redis()
    if not r:
        return
    try:
        await r.set(key, json.dumps(value, default=str), ex=ttl)
    except Exception as exc:
        logger.warning("cache_set failed for %s: %s", key, exc)


async def cache_delete(pattern: str) -> None:
    """Delete all keys matching a pattern (e.g. 'courses:*')."""
    r = await get_redis()
    if not r:
        return
    try:
        keys = await r.keys(pattern)
        if keys:
            await r.delete(*keys)
    except Exception as exc:
        logger.warning("cache_delete failed for %s: %s", pattern, exc)
