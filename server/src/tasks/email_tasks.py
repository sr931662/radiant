from src.core.celery_app import celery_app
from src.services.email_service import EmailService

if celery_app is None:
    def send_welcome_email_task(email: str, name: str): pass
    def send_otp_email_task(email: str, otp: str, purpose: str): pass
    def send_donation_receipt_email_task(email: str, donation_id: str): pass
else:
    @celery_app.task(name="send_welcome_email", bind=True, max_retries=3, default_retry_delay=60)
    def send_welcome_email_task(self, email: str, name: str):
        import asyncio
        try:
            asyncio.run(EmailService.send_welcome_email(email, name))
        except Exception as exc:
            raise self.retry(exc=exc)

    @celery_app.task(name="send_otp_email", bind=True, max_retries=3, default_retry_delay=30)
    def send_otp_email_task(self, email: str, otp: str, purpose: str):
        import asyncio
        async def _send():
            if purpose == "VERIFY_EMAIL":
                await EmailService.send_verification_email(email, otp)
            elif purpose == "RESET_PASSWORD":
                await EmailService.send_password_reset_email(email, otp)
        try:
            asyncio.run(_send())
        except Exception as exc:
            raise self.retry(exc=exc)

    @celery_app.task(name="send_donation_receipt_email", bind=True, max_retries=3, default_retry_delay=60)
    def send_donation_receipt_email_task(self, email: str, donation_id: str):
        import asyncio

        async def _send():
            from src.core.database import async_session_factory
            from src.models import Donation
            async with async_session_factory() as session:
                donation = await session.get(Donation, donation_id)
                if donation:
                    await EmailService.send_donation_receipt(email, donation)

        try:
            asyncio.run(_send())
        except Exception as exc:
            raise self.retry(exc=exc)
