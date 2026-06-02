import logging
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from src.models import AuditLog
from src.core.database import async_session_factory

logger = logging.getLogger(__name__)


class AuditLoggerMiddleware(BaseHTTPMiddleware):
    AUDIT_METHODS = {"POST", "PUT", "PATCH", "DELETE"}

    async def dispatch(self, request: Request, call_next):
        # Always call the next handler first — never let audit logic block the request
        try:
            response = await call_next(request)
        except Exception:
            # Re-raise so upper middleware (CORS etc.) can still handle it
            raise

        path = request.url.path
        if "/admin/" in path and request.method in self.AUDIT_METHODS:
            user_id = None
            if hasattr(request.state, "user_id"):
                user_id = request.state.user_id

            resource = path.split("/")[3] if len(path.split("/")) > 3 else "unknown"

            try:
                async with async_session_factory() as session:
                    log_entry = AuditLog(
                        user_id=user_id,
                        action=request.method,
                        resource=resource,
                        ip_address=request.client.host if request.client else None,
                    )
                    session.add(log_entry)
                    await session.commit()
            except Exception as exc:
                # Audit log failure must NEVER affect the response to the client
                logger.warning("[AuditLog] Failed to write audit entry: %s", exc)

        return response
