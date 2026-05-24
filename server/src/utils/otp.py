import random
from datetime import datetime


def generate_otp() -> str:
    """Generate a 6-digit OTP."""
    return f"{random.randint(100000, 999999)}"


def verify_otp(otp_record, provided_code: str) -> bool:
    """Check OTP validity: not used, not expired, matches code."""
    if otp_record.used or otp_record.expires_at < datetime.utcnow():
        return False
    return otp_record.code == provided_code