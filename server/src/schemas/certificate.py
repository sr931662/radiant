import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class CertificateVerifyResponse(BaseModel):
    valid: bool
    certificate: "CertificateResponse | None" = None


class CertificateResponse(BaseModel):
    id: uuid.UUID
    unique_id: str
    type: str
    user_name: str | None = None
    issued_at: datetime
    qr_code_data: str | None = None

    model_config = {"from_attributes": True}


class CertificateGenerateRequest(BaseModel):
    type: str = Field(..., pattern="^(FDP|COURSE|MEMBERSHIP)$")
    entity_id: uuid.UUID  # fdp_id, course_id, or membership_id
    user_id: uuid.UUID