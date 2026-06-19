import uuid
from datetime import datetime, timedelta, timezone
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from src.models import Membership, MembershipPlan, User
from src.services.payment_service import PaymentService
from src.utils.id_generator import generate_member_id
from src.utils.exceptions import NotFoundException, BadRequestException, ForbiddenException


class MembershipService:
    @staticmethod
    async def get_plans(db: AsyncSession) -> list[MembershipPlan]:
        result = await db.execute(select(MembershipPlan).where(MembershipPlan.deleted_at == None))
        return list(result.scalars().all())

    @staticmethod
    async def apply(db: AsyncSession, user_id: uuid.UUID, plan_id: uuid.UUID) -> Membership:
        plan = await db.get(MembershipPlan, plan_id)
        if not plan:
            raise NotFoundException("Membership plan not found")

        # Lock the user's existing memberships to prevent duplicate concurrent applications
        stmt = select(Membership).where(
            Membership.user_id == user_id,
            Membership.status.in_(["PENDING", "APPROVED"]),
            Membership.deleted_at == None,
        ).with_for_update()
        result = await db.execute(stmt)
        existing = result.scalar_one_or_none()
        if existing:
            raise BadRequestException("You already have an active membership application")

        membership = Membership(
            user_id=user_id,
            plan_id=plan_id,
            status="PENDING",
        )
        db.add(membership)
        await db.commit()
        await db.refresh(membership)
        return membership

    @staticmethod
    async def my_memberships(db: AsyncSession, user_id: uuid.UUID) -> list[Membership]:
        result = await db.execute(
            select(Membership)
            .where(Membership.user_id == user_id, Membership.deleted_at == None)
            .order_by(Membership.created_at.desc())
        )
        return list(result.scalars().all())

    @staticmethod
    async def renew(db: AsyncSession, user_id: uuid.UUID, membership_id: uuid.UUID) -> Membership:
        membership = await db.get(Membership, membership_id)
        if not membership or membership.user_id != user_id:
            raise NotFoundException("Membership not found")
        if membership.status != "EXPIRED":
            raise BadRequestException("Only expired memberships can be renewed")

        membership.status = "PENDING"
        membership.start_date = None
        membership.end_date = None
        await db.commit()
        await db.refresh(membership)
        return membership

    @staticmethod
    async def download_card(db: AsyncSession, user_id: uuid.UUID, membership_id: uuid.UUID) -> dict:
        membership = await db.get(Membership, membership_id)
        if not membership or membership.user_id != user_id:
            raise NotFoundException("Membership not found")
        if membership.status != "APPROVED":
            raise ForbiddenException("Membership not approved yet")

        user = await db.get(User, user_id)
        plan = await db.get(MembershipPlan, membership.plan_id)
        if not user or not plan:
            raise NotFoundException("User or plan not found")
        return {
            "member_id": membership.member_id,
            "name": user.name,
            "plan_name": plan.name,
            "valid_until": membership.end_date,
        }

    @staticmethod
    async def create_plan(db: AsyncSession, name: str, type: str, price: float, duration_days: int, benefits: dict | None) -> MembershipPlan:
        plan = MembershipPlan(name=name, type=type, price=price, duration_days=duration_days, benefits=benefits)
        db.add(plan)
        await db.commit()
        await db.refresh(plan)
        return plan

    @staticmethod
    async def delete_plan(db: AsyncSession, plan_id: uuid.UUID) -> None:
        from datetime import datetime, timezone
        plan = await db.get(MembershipPlan, plan_id)
        if not plan:
            raise NotFoundException("Membership plan not found")
        plan.deleted_at = datetime.now(timezone.utc)
        await db.commit()

    @staticmethod
    async def create_payment_order(db: AsyncSession, plan_id: uuid.UUID) -> dict:
        plan = await db.get(MembershipPlan, plan_id)
        if not plan:
            raise NotFoundException("Membership plan not found")
        if not plan.price or plan.price <= 0:
            raise BadRequestException("This plan is free — no payment required")
        order = await PaymentService.create_razorpay_order(plan.price, receipt=f"mem_{plan_id.hex[:16]}")
        return {
            "order_id": order["id"],
            "amount": order["amount"],
            "currency": order.get("currency", "INR"),
        }

    @staticmethod
    async def verify_and_apply(
        db: AsyncSession,
        user_id: uuid.UUID,
        plan_id: uuid.UUID,
        razorpay_order_id: str,
        razorpay_payment_id: str,
        razorpay_signature: str,
    ) -> Membership:
        if not PaymentService.verify_razorpay_signature(razorpay_order_id, razorpay_payment_id, razorpay_signature):
            raise BadRequestException("Payment verification failed — signature mismatch")

        # Create the membership record
        membership = await MembershipService.apply(db, user_id, plan_id)

        # Auto-approve immediately — Razorpay payment is already verified, no admin review needed
        plan = await db.get(MembershipPlan, membership.plan_id)
        now = datetime.now(timezone.utc)
        membership.status = "APPROVED"
        for _ in range(5):
            try:
                membership.member_id = generate_member_id()
                break
            except Exception:
                continue
        membership.start_date = now
        membership.end_date = now + timedelta(days=plan.duration_days)
        await db.commit()
        await db.refresh(membership)
        return membership

    # Admin
    @staticmethod
    async def list_all(db: AsyncSession, page: int, size: int, status: str | None = None) -> tuple[list[Membership], int]:
        query = select(Membership).where(Membership.deleted_at == None)
        count_query = select(func.count(Membership.id)).where(Membership.deleted_at == None)

        if status:
            query = query.where(Membership.status == status)
            count_query = count_query.where(Membership.status == status)

        total = await db.scalar(count_query) or 0
        query = query.offset((page - 1) * size).limit(size)
        result = await db.execute(query)
        memberships = list(result.scalars().all())
        return memberships, total

    @staticmethod
    async def approve_reject(db: AsyncSession, membership_id: uuid.UUID, status: str, approver_id: uuid.UUID) -> Membership:
        membership = await db.get(Membership, membership_id)
        if not membership:
            raise NotFoundException("Membership not found")

        membership.status = status
        if status == "APPROVED":
            # Retry on member_id collision (rare but possible with random IDs)
            for _ in range(5):
                try:
                    membership.member_id = generate_member_id()
                    break
                except Exception:
                    continue
            membership.start_date = datetime.now(timezone.utc)
            plan = await db.get(MembershipPlan, membership.plan_id)
            if not plan:
                raise NotFoundException("Membership plan not found")
            membership.end_date = datetime.now(timezone.utc) + timedelta(days=plan.duration_days)
            membership.approved_by = approver_id

        await db.commit()
        await db.refresh(membership)
        return membership

    @staticmethod
    async def export_data(db: AsyncSession) -> list[Membership]:
        result = await db.execute(
            select(Membership).where(Membership.deleted_at == None).order_by(Membership.created_at.desc())
        )
        return list(result.scalars().all())
