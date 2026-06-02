from typing import Optional

from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

_PLACEHOLDER_SECRETS = {
    "super-secret-access-key-change-me",
    "super-secret-refresh-key-change-me",
    "changeme",
    "secret",
    "your-secret-here",
}


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", case_sensitive=False)

    # ── App ──
    app_name: str = "Radiant Education Trust API"
    app_version: str = "1.0.0"
    debug: bool = False
    environment: str = "production"  # development, staging, production
    frontend_url: str = "https://radiant.sr931662.workers.dev"

    # ── Database ──
    database_url: str
    db_pool_size: int = 20
    db_max_overflow: int = 10
    db_echo: bool = False

    # ── Redis (optional — leave unset to disable Redis and Celery) ──
    redis_url: Optional[str] = None
    redis_max_connections: int = 50

    # ── JWT ──
    jwt_access_secret: str
    jwt_refresh_secret: str
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 7

    # ── Razorpay ──
    razorpay_key_id: str
    razorpay_key_secret: str
    razorpay_webhook_secret: str

    # ── Email (Resend or SMTP) ──
    email_provider: str = "resend"  # resend or smtp
    resend_api_key: Optional[str] = None
    email_from: str = "noreply@radianttrust.org"
    smtp_host: Optional[str] = None
    smtp_port: Optional[int] = 587
    smtp_user: Optional[str] = None
    smtp_password: Optional[str] = None
    smtp_use_tls: bool = True

    # ── Cloudinary ──
    cloudinary_cloud_name: Optional[str] = None
    cloudinary_api_key: Optional[str] = None
    cloudinary_api_secret: Optional[str] = None
    cloudinary_folder: str = "radiant-trust"

    # ── Celery (auto-derived from redis_url when not explicitly set) ──
    celery_broker_url: Optional[str] = None
    celery_result_backend: Optional[str] = None

    # ── CORS ──
    cors_origins: list[str] = [
        "https://radiant-54m.pages.dev",
        "https://radiant.sr931662.workers.dev",
        "https://radianttrust.sr931662.workers.dev",
        "http://localhost:3000",
        "http://localhost:5173",
    ]

    # ── Rate Limiting ──
    rate_limit_global: str = "100/minute"
    rate_limit_auth: str = "5/minute"

    @field_validator("cors_origins", mode="after")
    @classmethod
    def ensure_required_origins(cls, v: list[str]) -> list[str]:
        required = [
            "https://radiant-54m.pages.dev",
            "https://radiant.sr931662.workers.dev",
            "https://radianttrust.sr931662.workers.dev",
        ]
        for origin in required:
            if origin not in v:
                v.append(origin)
        return v

    @field_validator("debug", mode="before")
    @classmethod
    def parse_debug(cls, value):
        if isinstance(value, bool):
            return value
        if isinstance(value, str):
            normalized = value.strip().lower()
            if normalized in {"1", "true", "yes", "on", "debug", "development", "dev"}:
                return True
            if normalized in {"0", "false", "no", "off", "release", "production", "prod"}:
                return False
        return value

    @model_validator(mode="after")
    def validate_secrets_in_production(self) -> "Settings":
        if self.environment == "production":
            import logging
            _log = logging.getLogger(__name__)
            if self.jwt_access_secret in _PLACEHOLDER_SECRETS:
                raise ValueError("JWT_ACCESS_SECRET must be changed from the placeholder before deploying to production")
            if self.jwt_refresh_secret in _PLACEHOLDER_SECRETS:
                raise ValueError("JWT_REFRESH_SECRET must be changed from the placeholder before deploying to production")
            if len(self.jwt_access_secret) < 32:
                _log.warning("JWT_ACCESS_SECRET is shorter than 32 characters — consider using secrets.token_hex(32)")
        return self


settings = Settings()  # type: ignore[call-arg]
