from slowapi import Limiter
from slowapi.util import get_remote_address

# Global rate limiter instance
limiter = Limiter(key_func=get_remote_address)


class RateLimitMiddleware:
    """
    Wraps the Slowapi limiter so it can be added as middleware.
    Actually Slowapi provides its own middleware; we use it directly in main.py.
    This file just exports the limiter instance.
    """
    pass