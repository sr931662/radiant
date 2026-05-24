import time
import logging
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

logger = logging.getLogger("request")


class RequestLoggerMiddleware(BaseHTTPMiddleware):
    """
    Logs each incoming request with method, path, status code, and duration.
    """
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        duration = time.time() - start_time

        logger.info(
            f"{request.method} {request.url.path} "
            f"{response.status_code} "
            f"{duration:.3f}s "
            f"{request.client.host if request.client else 'unknown'}"
        )
        return response