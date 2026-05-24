import uuid
from fastapi import Depends, Query, Body
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db
from src.dependencies import get_current_admin_user
from src.schemas.certificate import (
    CertificateVerifyResponse, CertificateGenerateRequest, CertificateResponse,
)
from src.services.certificate_service import CertificateService


async def verify(
    unique_id: str = Query(...),
    db: AsyncSession = Depends(get_db),
) -> CertificateVerifyResponse:
    result = await CertificateService.verify(db, unique_id)
    return CertificateVerifyResponse(**result)


async def generate(
    data: CertificateGenerateRequest = Body(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> CertificateResponse:
    cert = await CertificateService.generate_certificate(db, data.type, data.entity_id, data.user_id)
    return CertificateResponse.model_validate(cert)