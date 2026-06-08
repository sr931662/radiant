from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from src.config import settings
from src.core.database import engine, validate_database_connection
from src.core.redis import init_redis, close_redis
from src.middleware.rate_limiter import limiter
from src.middleware.security_headers import SecurityHeadersMiddleware
from src.middleware.request_logger import RequestLoggerMiddleware
from src.middleware.audit_logger import AuditLoggerMiddleware
from src.routes import (
    auth_router,
    user_router,
    membership_router,
    admin_membership_router,
    fdp_router,
    admin_fdp_router,
    admission_router,
    admin_admission_router,
    donation_router,
    admin_donation_router,
    course_router,
    admin_course_router,
    certificate_router,
    admin_certificate_router,
    gallery_router,
    admin_gallery_router,
    volunteer_router,
    admin_volunteer_router,
    blog_router,
    admin_blog_router,
    contact_router,
    admin_contact_router,
    download_router,
    admin_download_router,
    banner_router,
    admin_banner_router,
    dashboard_router,
    public_router,
)
from src.utils.exceptions import AppException


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup — wrap each check so a single failure never prevents the server from binding
    import logging as _log
    _logger = _log.getLogger(__name__)

    try:
        await validate_database_connection()
    except Exception as _e:
        _logger.error("DB startup check failed (server starting anyway): %s", _e)

    # Log email configuration so failures are visible in Cloud Run logs
    _logger.info(
        "[EMAIL CONFIG] provider=%s from=%s smtp_host=%s smtp_port=%s smtp_user=%s",
        settings.email_provider,
        settings.email_from,
        settings.smtp_host,
        settings.smtp_port,
        settings.smtp_user,
    )

    try:
        await init_redis()
    except Exception as _e:
        _log.getLogger(__name__).warning("Redis unavailable at startup: %s", _e)

    if settings.cloudinary_cloud_name:
        try:
            import cloudinary
            cloudinary.config(
                cloud_name=settings.cloudinary_cloud_name,
                api_key=settings.cloudinary_api_key,
                api_secret=settings.cloudinary_api_secret,
            )
        except Exception as _e:
            _log.getLogger(__name__).warning("Cloudinary config failed: %s", _e)
    yield
    # Shutdown
    await close_redis()
    await engine.dispose()


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        docs_url="/docs" if settings.debug else None,
        redoc_url="/redoc" if settings.debug else None,
        lifespan=lifespan,
        redirect_slashes=False,
    )

    # ── Middleware (order matters — last added = outermost = first to run) ──

    # Innermost: security, logging, audit (run close to the route handler)
    app.add_middleware(SecurityHeadersMiddleware)
    app.add_middleware(RequestLoggerMiddleware)
    app.add_middleware(AuditLoggerMiddleware)

    # Rate limiting — runs before CORS so OPTIONS preflights are not rate-limited
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)  # type: ignore[arg-type]
    app.add_middleware(SlowAPIMiddleware)

    # CORS must be outermost so it handles OPTIONS preflights first.
    # allow_origin_regex covers any *.pages.dev / *.workers.dev deployment
    # so CORS works even when VITE_API_URL points directly at Cloud Run.
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_origin_regex=r"https?://(localhost(:\d+)?|[\w-]+\.(pages\.dev|workers\.dev))",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── Global Exception Handler ──
    def _cors_headers(request: Request) -> dict:
        """Return CORS headers for the given request's origin.
        Used as a safety net: CORSMiddleware normally adds these, but if an
        exception propagates past CORSMiddleware (e.g. from middleware code),
        the browser would see a response with no CORS headers and block it.
        Adding them here ensures they're always present on error responses.
        """
        origin = request.headers.get("origin", "")
        if not origin:
            return {}
        # Allow any origin that matches our configured list or regex
        import re
        allowed = list(settings.cors_origins)
        regex = r"https?://(localhost(:\d+)?|[\w-]+\.(pages\.dev|workers\.dev))"
        if origin in allowed or re.match(regex, origin):
            return {
                "Access-Control-Allow-Origin": origin,
                "Access-Control-Allow-Credentials": "true",
                "Vary": "Origin",
            }
        return {}

    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "message": exc.detail,
                "error_code": exc.error_code,
            },
            headers=_cors_headers(request),
        )

    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception):
        import logging
        logger = logging.getLogger("app")
        logger.exception("Unhandled exception: %s", exc)
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": "Internal server error", "error_code": "INTERNAL_ERROR"},
            headers=_cors_headers(request),
        )

    # ── Routers ──
    app.include_router(auth_router)
    app.include_router(user_router)
    app.include_router(membership_router)
    app.include_router(admin_membership_router)
    app.include_router(fdp_router)
    app.include_router(admin_fdp_router)
    app.include_router(admission_router)
    app.include_router(admin_admission_router)
    app.include_router(donation_router)
    app.include_router(admin_donation_router)
    app.include_router(course_router)
    app.include_router(admin_course_router)
    app.include_router(certificate_router)
    app.include_router(admin_certificate_router)
    app.include_router(gallery_router)
    app.include_router(admin_gallery_router)
    app.include_router(volunteer_router)
    app.include_router(admin_volunteer_router)
    app.include_router(blog_router)
    app.include_router(admin_blog_router)
    app.include_router(contact_router)
    app.include_router(admin_contact_router)
    app.include_router(download_router)
    app.include_router(admin_download_router)
    app.include_router(banner_router)
    app.include_router(admin_banner_router)
    app.include_router(dashboard_router)
    app.include_router(public_router)

    # Health check — verifies DB and Redis connectivity, not just "am I alive"
    @app.get("/health", tags=["Health"])
    async def health():
        import time
        checks: dict[str, str] = {}

        # Database check
        try:
            async with engine.connect() as conn:
                await conn.execute(__import__("sqlalchemy", fromlist=["text"]).text("SELECT 1"))
            checks["database"] = "ok"
        except Exception as e:
            checks["database"] = f"error: {e}"

        # Redis check
        try:
            from src.core.redis import get_redis
            r = await get_redis()
            if r:
                await r.ping()
                checks["redis"] = "ok"
            else:
                checks["redis"] = "not_configured"
        except Exception as e:
            checks["redis"] = f"error: {e}"

        overall = "ok" if all(v in ("ok", "not_configured") for v in checks.values()) else "degraded"
        return {"status": overall, "version": settings.app_version, "checks": checks}

    return app


app = create_app()
