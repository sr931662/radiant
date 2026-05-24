from src.core.celery_app import celery_app


@celery_app.task(name="tasks.cleanup_expired_otps")
def cleanup_expired_otps():
    import asyncio
    from datetime import datetime, timezone
    from src.core.database import AsyncSessionLocal
    from sqlalchemy import delete
    from src.models.otp import OTP

    async def _run():
        async with AsyncSessionLocal() as db:
            await db.execute(
                delete(OTP).where(OTP.expires_at < datetime.now(timezone.utc))
            )
            await db.commit()

    asyncio.run(_run())


@celery_app.task(name="tasks.cleanup_revoked_tokens")
def cleanup_revoked_tokens():
    import asyncio
    from datetime import datetime, timezone
    from src.core.database import AsyncSessionLocal
    from sqlalchemy import delete
    from src.models.refresh_token import RefreshToken

    async def _run():
        async with AsyncSessionLocal() as db:
            await db.execute(
                delete(RefreshToken).where(
                    RefreshToken.expires_at < datetime.now(timezone.utc)
                )
            )
            await db.commit()

    asyncio.run(_run())
