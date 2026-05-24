import secrets
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from fastapi import status

SAFE_METHODS = {"GET", "HEAD", "OPTIONS", "TRACE"}
CSRF_HEADER = "X-CSRF-Token"
CSRF_COOKIE = "csrf_token"


class CSRFMiddleware(BaseHTTPMiddleware):
    """CSRF protection for cookie-based auth flows."""

    async def dispatch(self, request: Request, call_next) -> Response:
        if request.method not in SAFE_METHODS:
            cookie_token = request.cookies.get(CSRF_COOKIE)
            header_token = request.headers.get(CSRF_HEADER)
            if not cookie_token or cookie_token != header_token:
                return Response(
                    content='{"success":false,"message":"CSRF token mismatch"}',
                    status_code=status.HTTP_403_FORBIDDEN,
                    media_type="application/json",
                )

        response = await call_next(request)

        if CSRF_COOKIE not in request.cookies:
            token = secrets.token_urlsafe(32)
            response.set_cookie(CSRF_COOKIE, token, httponly=False, samesite="strict")

        return response
