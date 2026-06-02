from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta, timezone

from src.models import User, UserRole, Role, Donation, Admission, AuditLog, Membership


class DashboardService:
    @staticmethod
    async def get_stats(db: AsyncSession) -> dict:
        # User stats
        total_users = await db.scalar(select(func.count(User.id)).where(User.deleted_at == None))
        active_students = await db.scalar(
            select(func.count(User.id)).join(UserRole).join(Role)
            .where(Role.name == "STUDENT", User.is_banned == False, User.deleted_at == None)
        )
        active_faculty = await db.scalar(
            select(func.count(User.id)).join(UserRole).join(Role)
            .where(Role.name == "FACULTY", User.is_banned == False, User.deleted_at == None)
        )
        active_volunteers = await db.scalar(
            select(func.count(User.id)).join(UserRole).join(Role)
            .where(Role.name == "VOLUNTEER", User.is_banned == False, User.deleted_at == None)
        )
        banned_users = await db.scalar(select(func.count(User.id)).where(User.is_banned == True, User.deleted_at == None))

        # Donation stats
        total_donations = await db.scalar(select(func.coalesce(func.sum(Donation.amount), 0)).where(Donation.status == "SUCCESS"))
        donation_count = await db.scalar(select(func.count(Donation.id)).where(Donation.status == "SUCCESS"))
        average_donation = (total_donations or 0) / donation_count if donation_count else 0
        this_month_start = datetime.now(timezone.utc).replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        this_month_donations = await db.scalar(
            select(func.coalesce(func.sum(Donation.amount), 0)).where(Donation.status == "SUCCESS", Donation.created_at >= this_month_start)
        )

        # Monthly breakdown (last 6 months)
        monthly_breakdown = []
        for i in range(5, -1, -1):
            month_start = (this_month_start - timedelta(days=i*30)).replace(day=1)
            month_end = (month_start + timedelta(days=32)).replace(day=1)
            monthly_total = await db.scalar(
                select(func.coalesce(func.sum(Donation.amount), 0)).where(
                    Donation.status == "SUCCESS",
                    Donation.created_at >= month_start,
                    Donation.created_at < month_end,
                )
            )
            monthly_breakdown.append({"month": month_start.strftime("%Y-%m"), "total": float(monthly_total or 0)})

        # Admission stats
        total_applications = await db.scalar(select(func.count(Admission.id)).where(Admission.deleted_at == None))
        pending_admissions = await db.scalar(select(func.count(Admission.id)).where(Admission.status == "PENDING", Admission.deleted_at == None))
        approved_admissions = await db.scalar(select(func.count(Admission.id)).where(Admission.status == "APPROVED", Admission.deleted_at == None))
        rejected_admissions = await db.scalar(select(func.count(Admission.id)).where(Admission.status == "REJECTED", Admission.deleted_at == None))

        # Recent activity
        activity_query = select(AuditLog).order_by(AuditLog.created_at.desc()).limit(10)
        activity_result = await db.execute(activity_query)
        recent_activity = []
        for log in activity_result.scalars().all():
            recent_activity.append({
                "id": str(log.id),
                "action": log.action,
                "resource": log.resource,
                "user": log.user.name if log.user else "System",
                "timestamp": log.created_at.isoformat(),
            })

        return {
            "users": {
                "total_users": total_users,
                "active_students": active_students,
                "active_faculty": active_faculty,
                "active_volunteers": active_volunteers,
                "banned_users": banned_users,
            },
            "donations": {
                "total_donations": float(total_donations or 0),
                "total_count": donation_count,
                "average_donation": float(average_donation),
                "monthly_breakdown": monthly_breakdown,
            },
            "admissions": {
                "total_applications": total_applications,
                "pending": pending_admissions,
                "approved": approved_admissions,
                "rejected": rejected_admissions,
            },
            "recent_activity": recent_activity,
        }

    @staticmethod
    async def recent_activity(db: AsyncSession) -> list[AuditLog]:
        result = await db.execute(select(AuditLog).order_by(AuditLog.created_at.desc()).limit(50))
        return list(result.scalars().all())