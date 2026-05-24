from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from src.models import AuditLog
from src.core.database import async_session_factory


class AuditLoggerMiddleware(BaseHTTPMiddleware):
    """
    Captures admin write operations (POST, PUT, PATCH, DELETE) on /admin routes
    and stores them in the AuditLog table.

    This is a simple implementation; for production you'd extract user from JWT.
    """
    AUDIT_METHODS = {"POST", "PUT", "PATCH", "DELETE"}

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        path = request.url.path
        if "/admin/" in path and request.method in self.AUDIT_METHODS:
            # Get user from request state (set by JWT dependency if available)
            user_id = None
            if hasattr(request.state, "user_id"):
                user_id = request.state.user_id

            resource = path.split("/")[3] if len(path.split("/")) > 3 else "unknown"

            # Run DB insert in a background task to not block response
            async with async_session_factory() as session:
                log_entry = AuditLog(
                    user_id=user_id,
                    action=request.method,
                    resource=resource,
                    ip_address=request.client.host if request.client else None,
                )
                session.add(log_entry)
                await session.commit()

        return response