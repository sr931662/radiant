from src.core.celery_app import celery_app
from src.services.email_service import EmailService


@celery_app.task(name="send_welcome_email")
def send_welcome_email_task(email: str, name: str):
    """Background task to send welcome email."""
    import asyncio
    loop = asyncio.get_event_loop()
    loop.run_until_complete(EmailService.send_welcome_email(email, name))


@celery_app.task(name="send_otp_email")
def send_otp_email_task(email: str, otp: str, purpose: str):
    """Background task to send OTP email."""
    import asyncio
    loop = asyncio.get_event_loop()
    if purpose == "VERIFY_EMAIL":
        loop.run_until_complete(EmailService.send_verification_email(email, otp))
    elif purpose == "RESET_PASSWORD":
        loop.run_until_complete(EmailService.send_password_reset_email(email, otp))


@celery_app.task(name="send_donation_receipt_email")
def send_donation_receipt_email_task(email: str, donation_id: str):
    """Background task to send donation receipt."""
    import asyncio
    loop = asyncio.get_event_loop()
    # Fetch donation from DB inside async context
    async def _send():
        from src.core.database import async_session_factory
        from src.models import Donation
        async with async_session_factory() as session:
            donation = await session.get(Donation, donation_id)
            if donation:
                await EmailService.send_donation_receipt(email, donation)
    loop.run_until_complete(_send())