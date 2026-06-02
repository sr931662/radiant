import secrets
import string
import uuid


def generate_member_id() -> str:
    """Generate a cryptographically random membership ID like RET-MEM-ABC123."""
    alphabet = string.ascii_uppercase + string.digits
    random_part = ''.join(secrets.choice(alphabet) for _ in range(6))
    return f"RET-MEM-{random_part}"


def generate_certificate_unique_id() -> str:
    return str(uuid.uuid4())
