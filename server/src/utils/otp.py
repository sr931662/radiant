import hmac
import secrets
from datetime import datetime, timezone


def generate_otp() -> str:
    """Generate a cryptographically secure 6-digit OTP."""
    return f"{secrets.randbelow(900000) + 100000}"


def verify_otp(otp_record, provided_code: str) -> bool:
    """Check OTP validity: not used, not expired, code matches (constant-time)."""
    now = datetime.now(timezone.utc)
    if otp_record.used or otp_record.expires_at < now:
        return False
    return hmac.compare_digest(otp_record.code, provided_code)
