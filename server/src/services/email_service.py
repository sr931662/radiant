import logging
from fastapi.templating import Jinja2Templates
from src.config import settings
import httpx

logger = logging.getLogger(__name__)
templates = Jinja2Templates(directory="src/templates/emails")


class EmailService:
    @staticmethod
    async def send_email(to_email: str, subject: str, html_content: str) -> None:
        try:
            if settings.email_provider == "resend":
                await EmailService._send_via_resend(to_email, subject, html_content)
            else:
                await EmailService._send_via_smtp(to_email, subject, html_content)
            logger.info(f"[EMAIL] Sent to {to_email} — {subject}")
        except Exception as exc:
            logger.error(f"[EMAIL] FAILED to {to_email} — {subject}: {exc}")
            raise

    @staticmethod
    async def _send_via_resend(to_email: str, subject: str, html_content: str) -> None:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {settings.resend_api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "from": settings.email_from,
                    "to": to_email,
                    "subject": subject,
                    "html": html_content,
                },
            )
            response.raise_for_status()

    @staticmethod
    async def _send_via_smtp(to_email: str, subject: str, html_content: str) -> None:
        import aiosmtplib
        from email.mime.text import MIMEText
        from email.mime.multipart import MIMEMultipart

        message = MIMEMultipart()
        message["From"] = settings.email_from
        message["To"] = to_email
        message["Subject"] = subject
        message.attach(MIMEText(html_content, "html"))

        await aiosmtplib.send(
            message,
            hostname=settings.smtp_host,
            port=settings.smtp_port,
            username=settings.smtp_user,
            password=settings.smtp_password,
            use_tls=settings.smtp_use_tls,
        )

    @staticmethod
    async def send_verification_email(email: str, otp: str) -> None:
        logger.info(f"[OTP] Verification OTP for {email}: {otp}")
        template = templates.get_template("verify_email.html")
        html = template.render({"otp": otp, "email": email})
        await EmailService.send_email(email, "Verify Your Email", html)

    @staticmethod
    async def send_password_reset_email(email: str, otp: str) -> None:
        logger.info(f"[OTP] Password reset OTP for {email}: {otp}")
        template = templates.get_template("password_reset.html")
        html = template.render({"otp": otp, "email": email})
        await EmailService.send_email(email, "Reset Your Password", html)

    @staticmethod
    async def send_donation_receipt(email: str, donation) -> None:
        template = templates.get_template("donation_receipt.html")
        html = template.render({"donation": donation})
        await EmailService.send_email(email, "Donation Receipt", html)

    @staticmethod
    async def send_welcome_email(email: str, name: str) -> None:
        template = templates.get_template("welcome.html")
        html = template.render({"name": name})
        await EmailService.send_email(email, "Welcome to Radiant Education Trust", html)

    @staticmethod
    async def send_inquiry_reply(email: str, subject: str, reply: str) -> None:
        template = templates.get_template("inquiry_reply.html")
        html = template.render({"subject": subject, "reply": reply})
        await EmailService.send_email(email, "Response to Your Inquiry", html)
