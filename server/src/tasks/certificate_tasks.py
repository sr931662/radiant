from src.core.celery_app import celery_app


@celery_app.task(name="generate_certificate_bulk")
def generate_certificate_bulk_task(fdp_id: str, user_ids: list[str]):
    """Background task to generate certificates for multiple users."""
    import asyncio
    loop = asyncio.get_event_loop()
    async def _generate():
        from src.core.database import async_session_factory
        from src.services.certificate_service import CertificateService
        import uuid
        async with async_session_factory() as session:
            await CertificateService.bulk_generate_for_fdp(
                session,
                uuid.UUID(fdp_id),
                [uuid.UUID(uid) for uid in user_ids],
            )
            await session.commit()
    loop.run_until_complete(_generate())