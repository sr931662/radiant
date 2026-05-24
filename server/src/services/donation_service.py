import uuid
import hmac
import hashlib
from datetime import datetime, timedelta
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from src.models import Donation, User
from src.services.payment_service import PaymentService
from src.services.file_upload_service import FileUploadService
from src.utils.exceptions import NotFoundException, BadRequestException, ForbiddenException
from src.config import settings


class DonationService:
    @staticmethod
    async def create_order(db: AsyncSession, user_id: uuid.UUID | None, amount: float, anonymous: bool = False) -> dict:
        donation = Donation(
            user_id=user_id,
            amount=amount,
            status="PENDING",
            anonymous=anonymous,
        )
        db.add(donation)
        await db.commit()
        await db.refresh(donation)

        order = await PaymentService.create_razorpay_order(amount, receipt=str(donation.id))
        donation.razorpay_order_id = order["id"]
        await db.commit()
        return {
            "order_id": order["id"],
            "amount": amount,
            "currency": "INR",
            "donation_id": str(donation.id),
        }

    @staticmethod
    async def verify_payment(
        db: AsyncSession,
        razorpay_order_id: str,
        razorpay_payment_id: str,
        razorpay_signature: str,
    ) -> Donation:
        stmt = select(Donation).where(Donation.razorpay_order_id == razorpay_order_id)
        result = await db.execute(stmt)
        donation = result.scalar_one_or_none()
        if not donation:
            raise NotFoundException("Donation not found")

        verified = PaymentService.verify_razorpay_signature(
            razorpay_order_id, razorpay_payment_id, razorpay_signature
        )
        if not verified:
            donation.status = "FAILED"
            await db.commit()
            raise BadRequestException("Payment verification failed")

        donation.status = "SUCCESS"
        donation.razorpay_payment_id = razorpay_payment_id
        donation.razorpay_signature = razorpay_signature
        await db.commit()
        await db.refresh(donation)

        # Generate receipt (PDF) and upload to S3/Cloudinary
        receipt_url = await FileUploadService.upload_receipt(donation)
        donation.receipt_url = receipt_url
        await db.commit()

        # Send email receipt
        if donation.user_id:
            from src.services.email_service import EmailService
            user = await db.get(User, donation.user_id)
            if user:
                await EmailService.send_donation_receipt(user.email, donation)

        return donation

    @staticmethod
    async def webhook_handler(db: AsyncSession, payload: dict, signature: str) -> None:
        if not PaymentService.verify_webhook_signature(payload, signature):
            raise ForbiddenException("Invalid webhook signature")

        order_id = payload.get("payload", {}).get("payment", {}).get("entity", {}).get("order_id")
        payment_id = payload.get("payload", {}).get("payment", {}).get("entity", {}).get("id")
        status = payload.get("payload", {}).get("payment", {}).get("entity", {}).get("status")

        if order_id and payment_id and status == "captured":
            stmt = select(Donation).where(Donation.razorpay_order_id == order_id)
            result = await db.execute(stmt)
            donation = result.scalar_one_or_none()
            if donation and donation.status != "SUCCESS":
                donation.status = "SUCCESS"
                donation.razorpay_payment_id = payment_id
                receipt_url = await FileUploadService.upload_receipt(donation)
                donation.receipt_url = receipt_url
                await db.commit()

    @staticmethod
    async def my_history(db: AsyncSession, user_id: uuid.UUID, page: int, size: int) -> tuple[list[Donation], int]:
        query = select(Donation).where(Donation.user_id == user_id, Donation.deleted_at == None).order_by(Donation.created_at.desc())
        count_query = select(func.count(Donation.id)).where(Donation.user_id == user_id, Donation.deleted_at == None)

        total = await db.scalar(count_query) or 0
        query = query.offset((page - 1) * size).limit(size)
        result = await db.execute(query)
        donations = list(result.scalars().all())
        return donations, total

    @staticmethod
    async def get_receipt(db: AsyncSession, donation_id: uuid.UUID) -> str | None:
        donation = await db.get(Donation, donation_id)
        if not donation:
            raise NotFoundException("Donation not found")
        if donation.status != "SUCCESS":
            raise BadRequestException("Donation not completed")
        return donation.receipt_url

    # Admin
    @staticmethod
    async def list_all(db: AsyncSession, page: int, size: int, status: str | None = None) -> tuple[list[Donation], int]:
        query = select(Donation).where(Donation.deleted_at == None).order_by(Donation.created_at.desc())
        count_query = select(func.count(Donation.id)).where(Donation.deleted_at == None)

        if status:
            query = query.where(Donation.status == status)
            count_query = count_query.where(Donation.status == status)

        total = await db.scalar(count_query) or 0
        query = query.offset((page - 1) * size).limit(size)
        result = await db.execute(query)
        donations = list(result.scalars().all())
        return donations, total

    @staticmethod
    async def stats(db: AsyncSession) -> dict:
        total_donations = await db.scalar(select(func.coalesce(func.sum(Donation.amount), 0)).where(Donation.status == "SUCCESS"))
        total_count = await db.scalar(select(func.count(Donation.id)).where(Donation.status == "SUCCESS"))
        average = (total_donations or 0) / total_count if total_count else 0
        # This month
        now = datetime.utcnow()
        start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        this_month = await db.scalar(
            select(func.coalesce(func.sum(Donation.amount), 0)).where(
                Donation.status == "SUCCESS", Donation.created_at >= start_of_month
            )
        )
        last_month_start = (start_of_month - timedelta(days=1)).replace(day=1)
        last_month = await db.scalar(
            select(func.coalesce(func.sum(Donation.amount), 0)).where(
                Donation.status == "SUCCESS",
                Donation.created_at >= last_month_start,
                Donation.created_at < start_of_month,
            )
        )
        return {
            "total_donations": float(total_donations or 0),
            "total_count": total_count,
            "average_donation": float(average),
            "this_month_total": float(this_month or 0),
            "last_month_total": float(last_month or 0),
        }

    @staticmethod
    async def export_data(db: AsyncSession) -> list[Donation]:
        result = await db.execute(select(Donation).where(Donation.deleted_at == None).order_by(Donation.created_at.desc()))
        return list(result.scalars().all())
