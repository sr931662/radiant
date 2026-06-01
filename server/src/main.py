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
    dashboard_router,
)
from src.utils.exceptions import AppException


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup — wrap each check so a single failure never prevents the server from binding
    import logging as _log
    try:
        await validate_database_connection()
    except Exception as _e:
        _log.getLogger(__name__).error("DB startup check failed (server starting anyway): %s", _e)

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
    )

    # ── Middleware (order matters!) ──
    app.add_middleware(SecurityHeadersMiddleware)
    app.add_middleware(RequestLoggerMiddleware)
    app.add_middleware(AuditLoggerMiddleware)

    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Rate Limiting (Slowapi)
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)  # type: ignore[arg-type]
    app.add_middleware(SlowAPIMiddleware)

    # ── Global Exception Handler ──
    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "message": exc.detail,
                "error_code": exc.error_code,
            },
        )

    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception):
        import logging
        logger = logging.getLogger("app")
        logger.exception(f"Unhandled exception: {exc}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": "Internal server error", "error_code": "INTERNAL_ERROR"},
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
    app.include_router(dashboard_router)

    # Health check
    @app.get("/health", tags=["Health"])
    async def health():
        return {"status": "ok", "version": settings.app_version}

    return app


app = create_app()
