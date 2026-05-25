from __future__ import annotations
import logging
from typing import Any

from src.config import settings

logger = logging.getLogger(__name__)

celery_app: Any = None


def _make_celery() -> Any:
    broker = settings.celery_broker_url or (
        settings.redis_url.replace("/0", "/1") if settings.redis_url else None
    )
    backend = settings.celery_result_backend or (
        settings.redis_url.replace("/0", "/2") if settings.redis_url else None
    )
    if not broker:
        logger.info("Celery not configured — background tasks disabled")
        return None

    try:
        from celery import Celery
        app = Celery(
            "radiant_worker",
            broker=broker,
            backend=backend,
            include=[
                "src.tasks.email_tasks",
                "src.tasks.certificate_tasks",
                "src.tasks.report_tasks",
                "src.tasks.cleanup_tasks",
            ],
        )
        app.conf.update(
            task_serializer="json",
            accept_content=["json"],
            result_serializer="json",
            timezone="UTC",
            enable_utc=True,
            task_track_started=True,
            task_acks_late=True,
            worker_prefetch_multiplier=1,
        )
        return app
    except Exception as exc:
        logger.warning("Celery init failed (%s) — background tasks disabled", exc)
        return None


celery_app = _make_celery()
