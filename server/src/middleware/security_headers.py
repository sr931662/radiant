from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Adds Helmet-like security headers to every response.
    """
    async def dispatch(self, request: Request, call_next) -> Response:
        response: Response = await call_next(request)

        headers = response.headers
        headers["X-Content-Type-Options"] = "nosniff"
        headers["X-Frame-Options"] = "DENY"
        headers["X-XSS-Protection"] = "1; mode=block"
        headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        # Only set CSP on HTML responses — setting it on JSON API responses is wasteful
        # and a restrictive connect-src on API responses would confuse browsers if
        # ever evaluated in a document context.
        content_type = response.headers.get("content-type", "")
        if "text/html" in content_type:
            headers["Content-Security-Policy"] = (
                "default-src 'self'; "
                "script-src 'self' https://checkout.razorpay.com; "
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
                "font-src 'self' https://fonts.gstatic.com; "
                "img-src 'self' data: https://res.cloudinary.com https://*.cloudinary.com; "
                "frame-src https://api.razorpay.com https://checkout.razorpay.com; "
                "connect-src 'self' https://api.razorpay.com https://radianttrust-611643978472.asia-south2.run.app"
            )
        headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"

        return response