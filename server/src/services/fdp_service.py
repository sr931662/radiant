from datetime import datetime, timezone
import uuid
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from src.models import Fdp, FdpRegistration, User, Certificate
from src.utils.exceptions import NotFoundException, BadRequestException, ForbiddenException


class FdpService:
    @staticmethod
    async def list_fdps(db: AsyncSession, page: int, size: int) -> tuple[list[Fdp], int]:
        query = select(Fdp).where(Fdp.deleted_at == None).order_by(Fdp.start_date.desc())
        count_query = select(func.count(Fdp.id)).where(Fdp.deleted_at == None)

        total = await db.scalar(count_query) or 0
        query = query.offset((page - 1) * size).limit(size)
        result = await db.execute(query)
        fdps = list(result.scalars().all())
        return fdps, total

    @staticmethod
    async def get_fdp(db: AsyncSession, fdp_id: uuid.UUID) -> Fdp:
        fdp = await db.get(Fdp, fdp_id)
        if not fdp:
            raise NotFoundException("FDP not found")
        reg_count_stmt = select(func.count(FdpRegistration.id)).where(
            FdpRegistration.fdp_id == fdp_id, FdpRegistration.status != "CANCELLED"
        )
        reg_count = await db.scalar(reg_count_stmt) or 0
        setattr(fdp, "seats_remaining", max(0, fdp.max_seats - reg_count))
        return fdp

    @staticmethod
    async def register(db: AsyncSession, user_id: uuid.UUID, fdp_id: uuid.UUID) -> FdpRegistration:
        # Lock the FDP row first to prevent concurrent overbooking
        fdp_result = await db.execute(
            select(Fdp).where(Fdp.id == fdp_id, Fdp.deleted_at == None).with_for_update()
        )
        fdp = fdp_result.scalar_one_or_none()
        if not fdp:
            raise NotFoundException("FDP not found")
        if not fdp.is_active:
            raise BadRequestException("FDP is not active")

        # Check duplicate registration (inside the lock)
        existing_stmt = select(FdpRegistration).where(
            FdpRegistration.user_id == user_id,
            FdpRegistration.fdp_id == fdp_id,
            FdpRegistration.deleted_at == None,
        )
        existing = await db.scalar(existing_stmt)
        if existing:
            raise BadRequestException("You are already registered for this FDP")

        # Check seat limit (inside the lock — consistent read)
        reg_count_stmt = select(func.count(FdpRegistration.id)).where(
            FdpRegistration.fdp_id == fdp_id, FdpRegistration.status != "CANCELLED"
        )
        reg_count = await db.scalar(reg_count_stmt) or 0
        if reg_count >= fdp.max_seats:
            raise ForbiddenException("No seats available")

        registration = FdpRegistration(
            fdp_id=fdp_id,
            user_id=user_id,
            status="CONFIRMED",
        )
        db.add(registration)
        await db.commit()
        await db.refresh(registration)
        return registration

    @staticmethod
    async def my_registrations(db: AsyncSession, user_id: uuid.UUID) -> list[FdpRegistration]:
        result = await db.execute(
            select(FdpRegistration).where(FdpRegistration.user_id == user_id, FdpRegistration.deleted_at == None)
        )
        return list(result.scalars().all())

    # Admin
    @staticmethod
    async def create_fdp(db: AsyncSession, data: dict) -> Fdp:
        fdp = Fdp(**data)
        db.add(fdp)
        await db.commit()
        await db.refresh(fdp)
        return fdp

    @staticmethod
    async def update_fdp(db: AsyncSession, fdp_id: uuid.UUID, data: dict) -> Fdp:
        fdp = await FdpService.get_fdp(db, fdp_id)
        for key, value in data.items():
            if value is not None and hasattr(fdp, key):
                setattr(fdp, key, value)
        await db.commit()
        await db.refresh(fdp)
        return fdp

    @staticmethod
    async def delete_fdp(db: AsyncSession, fdp_id: uuid.UUID) -> None:
        fdp = await FdpService.get_fdp(db, fdp_id)
        fdp.deleted_at = datetime.now(timezone.utc)
        await db.commit()

    @staticmethod
    async def get_registrations(db: AsyncSession, fdp_id: uuid.UUID) -> list[FdpRegistration]:
        result = await db.execute(
            select(FdpRegistration).where(FdpRegistration.fdp_id == fdp_id, FdpRegistration.deleted_at == None)
        )
        return list(result.scalars().all())

    @staticmethod
    async def update_registration_status(db: AsyncSession, registration_id: uuid.UUID, status: str) -> FdpRegistration:
        reg = await db.get(FdpRegistration, registration_id)
        if not reg:
            raise NotFoundException("Registration not found")
        reg.status = status
        await db.commit()
        await db.refresh(reg)
        return reg

    @staticmethod
    async def mark_attendance(db: AsyncSession, fdp_id: uuid.UUID, attendance_records: list[dict]) -> list:
        from src.models import Attendance
        attendance_list = []
        for rec in attendance_records:
            attendance = Attendance(**rec, fdp_id=fdp_id)
            db.add(attendance)
            attendance_list.append(attendance)
        await db.commit()
        return attendance_list

    @staticmethod
    async def generate_certificates(db: AsyncSession, fdp_id: uuid.UUID) -> list[Certificate]:
        regs_stmt = select(FdpRegistration).where(FdpRegistration.fdp_id == fdp_id, FdpRegistration.status == "CONFIRMED")
        result = await db.execute(regs_stmt)
        registrations = result.scalars().all()

        certs = []
        for reg in registrations:
            existing_cert_stmt = select(Certificate).where(
                Certificate.user_id == reg.user_id,
                Certificate.type == "FDP",
                Certificate.extra_data["fdp_id"].astext == str(fdp_id),
            )
            existing = await db.scalar(existing_cert_stmt)
            if not existing:
                cert = Certificate(
                    user_id=reg.user_id,
                    type="FDP",
                    extra_data={"fdp_id": str(fdp_id), "registration_id": str(reg.id)},
                )
                db.add(cert)
                certs.append(cert)
        await db.commit()
        return certs
