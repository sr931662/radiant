import random
import string


def generate_member_id() -> str:
    """Generate a unique membership ID like RET-MEM-ABC123."""
    random_part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"RET-MEM-{random_part}"


def generate_certificate_unique_id() -> str:
    """Generate a UUID-like string for certificate verification."""
    import uuid
    return str(uuid.uuid4())