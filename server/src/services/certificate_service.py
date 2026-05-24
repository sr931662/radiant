import uuid
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models import Certificate, User
from src.utils.qr import generate_qr_code
from src.utils.exceptions import NotFoundException
from src.config import settings


class CertificateService:
    @staticmethod
    async def verify(db: AsyncSession, unique_id: str) -> dict:
        stmt = select(Certificate).where(Certificate.unique_id == unique_id, Certificate.deleted_at == None)
        result = await db.execute(stmt)
        certificate = result.scalar_one_or_none()

        if not certificate:
            return {"valid": False, "certificate": None}

        user_name = None
        if certificate.user_id:
            user = await db.get(User, certificate.user_id)
            if user:
                user_name = user.name

        return {
            "valid": True,
            "certificate": {
                "id": certificate.id,
                "unique_id": certificate.unique_id,
                "type": certificate.type,
                "user_name": user_name,
                "issued_at": certificate.issued_at,
                "qr_code_data": certificate.qr_code_data,
            },
        }

    @staticmethod
    async def generate_certificate(db: AsyncSession, cert_type: str, entity_id: uuid.UUID, user_id: uuid.UUID) -> Certificate:
        # Create a new certificate
        certificate = Certificate(
            type=cert_type,
            user_id=user_id,
            metadata={"entity_id": str(entity_id)},
        )
        # Generate unique ID (already in model default, but can enforce)
        certificate.unique_id = str(uuid.uuid4())
        verification_url = f"{settings.frontend_url}/verify-certificate?uniqueId={certificate.unique_id}"
        certificate.qr_code_data = generate_qr_code(verification_url)

        db.add(certificate)
        await db.commit()
        await db.refresh(certificate)
        return certificate

    @staticmethod
    async def bulk_generate_for_fdp(db: AsyncSession, fdp_id: uuid.UUID, user_ids: list[uuid.UUID]) -> list[Certificate]:
        certs = []
        for user_id in user_ids:
            certificate = await CertificateService.generate_certificate(db, "FDP", fdp_id, user_id)
            certs.append(certificate)
        return certs