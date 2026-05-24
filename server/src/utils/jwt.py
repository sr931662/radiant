from datetime import datetime, timedelta
from jose import jwt, JWTError, ExpiredSignatureError
from src.config import settings

ALGORITHM = "HS256"


def create_access_token(*, data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.access_token_expire_minutes))
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, settings.jwt_access_secret, algorithm=ALGORITHM)


def create_refresh_token(*, data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(days=settings.refresh_token_expire_days))
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, settings.jwt_refresh_secret, algorithm=ALGORITHM)


def verify_token(token: str, token_type: str = "access") -> dict | None:
    secret = settings.jwt_access_secret if token_type == "access" else settings.jwt_refresh_secret
    try:
        payload = jwt.decode(token, secret, algorithms=[ALGORITHM])
        if payload.get("type") != token_type:
            return None
        return payload
    except (JWTError, ExpiredSignatureError):
        return None