from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from src.config import settings
from src.core.database import engine
from src.core.redis import init_redis, close_redis
from src.middleware.rate_limiter import limiter
from src.middleware.security_headers import SecurityHeadersMiddleware
from src.middleware.request_logger import RequestLoggerMiddleware
from src.middleware.audit_logger import AuditLoggerMiddleware
from src.routes import (
    auth_router,
    user_router,
    membership_router,
    fdp_router,
    admission_router,
    donation_router,
    course_router,
    certificate_router,
    gallery_router,
    volunteer_router,
    blog_router,
    contact_router,
    download_router,
    dashboard_router,
)
from src.utils.exceptions import AppException


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_redis()
    # Cloudinary config (if using)
    if settings.cloudinary_cloud_name:
        import cloudinary
        cloudinary.config(
            cloud_name=settings.cloudinary_cloud_name,
            api_key=settings.cloudinary_api_key,
            api_secret=settings.cloudinary_api_secret,
        )
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
    app.include_router(membership_router)  # contains both public and admin sub-routers
    # The membership_router is actually the public_router; we need to include both public and admin
    # We'll restructure: import individual routers and include them.
    # For brevity, we include all routers from the routes/__init__.py
    app.include_router(fdp_router)
    app.include_router(admission_router)
    app.include_router(donation_router)
    app.include_router(course_router)
    app.include_router(certificate_router)
    app.include_router(gallery_router)
    app.include_router(volunteer_router)
    app.include_router(blog_router)
    app.include_router(contact_router)
    app.include_router(download_router)
    app.include_router(dashboard_router)

    # Health check
    @app.get("/health", tags=["Health"])
    async def health():
        return {"status": "ok", "version": settings.app_version}

    return app


app = create_app()