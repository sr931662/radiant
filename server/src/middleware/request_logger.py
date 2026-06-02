import time
import logging
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

logger = logging.getLogger("request")


class RequestLoggerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        try:
            response = await call_next(request)
        except Exception:
            duration = time.time() - start_time
            logger.error(
                "%s %s ERROR %.3fs %s",
                request.method,
                request.url.path,
                duration,
                request.client.host if request.client else "unknown",
            )
            raise
        duration = time.time() - start_time
        logger.info(
            "%s %s %s %.3fs %s",
            request.method,
            request.url.path,
            response.status_code,
            duration,
            request.client.host if request.client else "unknown",
        )
        return response
