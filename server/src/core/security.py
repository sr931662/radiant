import uuid
from datetime import datetime, timedelta, timezone

from jose import jwt, JWTError, ExpiredSignatureError
from passlib.context import CryptContext

from src.config import settings

# Argon2id hashing
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(
    *,
    data: dict,
    expires_delta: timedelta | None = None,
) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=settings.access_token_expire_minutes))
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, settings.jwt_access_secret, algorithm=ALGORITHM)


def create_refresh_token(
    *,
    data: dict,
    expires_delta: timedelta | None = None,
) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(days=settings.refresh_token_expire_days))
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, settings.jwt_refresh_secret, algorithm=ALGORITHM)


def verify_token(token: str, token_type: str = "access") -> dict | None:
    """
    Verify a JWT token.
    Returns the decoded payload if valid, else None.
    """
    secret = settings.jwt_access_secret if token_type == "access" else settings.jwt_refresh_secret
    try:
        payload = jwt.decode(token, secret, algorithms=[ALGORITHM])
        if payload.get("type") != token_type:
            return None
        return payload
    except (JWTError, ExpiredSignatureError):
        return None