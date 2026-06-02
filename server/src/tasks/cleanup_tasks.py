from src.core.celery_app import celery_app

if celery_app is None:
    def cleanup_expired_otps(): pass
    def cleanup_revoked_tokens(): pass
else:
    @celery_app.task(name="tasks.cleanup_expired_otps", bind=True, max_retries=3, default_retry_delay=60)
    def cleanup_expired_otps(self):
        import asyncio
        from datetime import datetime, timezone
        from src.core.database import async_session_factory
        from sqlalchemy import delete
        from src.models.otp import OTP

        async def _run():
            async with async_session_factory() as db:
                await db.execute(
                    delete(OTP).where(OTP.expires_at < datetime.now(timezone.utc))
                )
                await db.commit()

        try:
            asyncio.run(_run())
        except Exception as exc:
            raise self.retry(exc=exc)

    @celery_app.task(name="tasks.cleanup_revoked_tokens", bind=True, max_retries=3, default_retry_delay=60)
    def cleanup_revoked_tokens(self):
        import asyncio
        from datetime import datetime, timezone
        from src.core.database import async_session_factory
        from sqlalchemy import delete
        from src.models.refresh_token import RefreshToken

        async def _run():
            async with async_session_factory() as db:
                await db.execute(
                    delete(RefreshToken).where(
                        RefreshToken.expires_at < datetime.now(timezone.utc)
                    )
                )
                await db.commit()

        try:
            asyncio.run(_run())
        except Exception as exc:
            raise self.retry(exc=exc)
