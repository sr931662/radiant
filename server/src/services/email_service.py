import logging
from pathlib import Path
from fastapi.templating import Jinja2Templates
from src.config import settings
import httpx

logger = logging.getLogger(__name__)

_TEMPLATES_DIR = Path(__file__).parent.parent / "templates" / "emails"
templates = Jinja2Templates(directory=str(_TEMPLATES_DIR))


class EmailService:
    @staticmethod
    async def send_email(to_email: str, subject: str, html_content: str) -> None:
        try:
            if settings.email_provider == "resend":
                await EmailService._send_via_resend(to_email, subject, html_content)
            else:
                await EmailService._send_via_smtp(to_email, subject, html_content)
            logger.info("[EMAIL] Sent → %s | %s", to_email, subject)
        except Exception as exc:
            logger.error("[EMAIL] FAILED → %s | %s | %s: %s", to_email, subject, type(exc).__name__, exc)
            raise

    @staticmethod
    async def _send_via_resend(to_email: str, subject: str, html_content: str) -> None:
        if not settings.resend_api_key:
            raise RuntimeError("RESEND_API_KEY is not configured")
        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {settings.resend_api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "from": settings.email_from,
                    "to": [to_email],
                    "subject": subject,
                    "html": html_content,
                },
            )
            if not response.is_success:
                raise RuntimeError(f"Resend API error {response.status_code}: {response.text}")

    @staticmethod
    async def _send_via_smtp(to_email: str, subject: str, html_content: str) -> None:
        import aiosmtplib
        from email.mime.text import MIMEText
        from email.mime.multipart import MIMEMultipart

        message = MIMEMultipart("alternative")
        message["From"] = settings.email_from
        message["To"] = to_email
        message["Subject"] = subject
        message.attach(MIMEText(html_content, "html", "utf-8"))

        port = settings.smtp_port or 587
        use_tls   = (port == 465)
        start_tls = (port == 587)

        await aiosmtplib.send(
            message,
            hostname=settings.smtp_host,
            port=port,
            username=settings.smtp_user,
            password=settings.smtp_password,
            use_tls=use_tls,
            start_tls=start_tls,
            timeout=15,
        )

    # ── Specific senders ──────────────────────────────────────────────────────

    @staticmethod
    async def send_verification_email(email: str, otp: str) -> None:
        # OTP is NOT logged to prevent credential exposure via log aggregators
        html = templates.get_template("verify_email.html").render({"otp": otp, "email": email})
        await EmailService.send_email(email, "Verify your email — Radiant Education Trust", html)

    @staticmethod
    async def send_password_reset_email(email: str, otp: str) -> None:
        # OTP is NOT logged to prevent credential exposure via log aggregators
        html = templates.get_template("password_reset.html").render({"otp": otp, "email": email})
        await EmailService.send_email(email, "Reset your password — Radiant Education Trust", html)

    @staticmethod
    async def send_donation_receipt(email: str, donation) -> None:
        html = templates.get_template("donation_receipt.html").render({"donation": donation})
        await EmailService.send_email(email, "Donation receipt — Radiant Education Trust", html)

    @staticmethod
    async def send_welcome_email(email: str, name: str) -> None:
        html = templates.get_template("welcome.html").render({"name": name})
        await EmailService.send_email(email, "Welcome to Radiant Education Trust", html)

    @staticmethod
    async def send_inquiry_reply(email: str, subject: str, reply: str) -> None:
        html = templates.get_template("inquiry_reply.html").render({"subject": subject, "reply": reply})
        await EmailService.send_email(email, f"Re: {subject} — Radiant Education Trust", html)

    @staticmethod
    async def send_membership_approved_email(email: str, name: str, plan_name: str, member_id: str, end_date) -> None:
        html = templates.get_template("membership_approved.html").render({
            "name": name,
            "plan_name": plan_name,
            "member_id": member_id,
            "end_date": end_date.strftime("%d %B %Y") if end_date else "—",
        })
        await EmailService.send_email(email, "Membership Approved — Radiant Education Trust", html)
