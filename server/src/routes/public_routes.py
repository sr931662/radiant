from fastapi import APIRouter, Depends
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db
from src.models import Course, Enrollment, VolunteerApplication, InternshipApplication, Donation, BlogPost, User, UserRole, Role

router = APIRouter(prefix="/api/v1/public", tags=["Public"])


@router.get("/stats")
async def get_public_stats(db: AsyncSession = Depends(get_db)):
    total_courses = await db.scalar(
        select(func.count(Course.id)).where(Course.deleted_at == None, Course.is_published == True)
    ) or 0

    total_enrollments = await db.scalar(
        select(func.count(Enrollment.id))
    ) or 0

    total_volunteers = await db.scalar(
        select(func.count(VolunteerApplication.id))
    ) or 0

    total_donations = await db.scalar(
        select(func.coalesce(func.sum(Donation.amount), 0)).where(Donation.status == "SUCCESS")
    ) or 0

    total_students = await db.scalar(
        select(func.count(User.id)).join(UserRole).join(Role)
        .where(Role.name == "STUDENT", User.is_banned == False, User.deleted_at == None)
    ) or 0

    total_blog_posts = await db.scalar(
        select(func.count(BlogPost.id)).where(BlogPost.status == "PUBLISHED", BlogPost.deleted_at == None)
    ) or 0

    return {
        "success": True,
        "data": {
            "total_courses": total_courses,
            "total_enrollments": total_enrollments,
            "total_volunteers": total_volunteers,
            "total_donations": float(total_donations),
            "total_students": total_students,
            "total_blog_posts": total_blog_posts,
        }
    }
