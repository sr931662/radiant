import uuid
from datetime import datetime, timezone
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from src.models import Course, Module, Lesson, Enrollment, User
from src.utils.exceptions import NotFoundException, BadRequestException


class CourseService:
    @staticmethod
    async def list_courses(db: AsyncSession, page: int, size: int) -> tuple[list[Course], int]:
        query = select(Course).where(Course.deleted_at == None, Course.is_published == True).order_by(Course.created_at.desc())
        count_query = select(func.count(Course.id)).where(Course.deleted_at == None, Course.is_published == True)
        total = await db.scalar(count_query) or 0
        query = query.offset((page - 1) * size).limit(size)
        result = await db.execute(query)
        courses = list(result.scalars().all())
        return courses, total

    @staticmethod
    async def list_all_courses(db: AsyncSession, page: int, size: int) -> tuple[list[Course], int]:
        query = select(Course).where(Course.deleted_at == None).order_by(Course.created_at.desc())
        count_query = select(func.count(Course.id)).where(Course.deleted_at == None)
        total = await db.scalar(count_query) or 0
        query = query.offset((page - 1) * size).limit(size)
        result = await db.execute(query)
        courses = list(result.scalars().all())
        return courses, total

    @staticmethod
    async def get_course(db: AsyncSession, course_id: uuid.UUID) -> Course:
        course = await db.get(Course, course_id)
        if not course:
            raise NotFoundException("Course not found")
        return course

    @staticmethod
    async def enroll(db: AsyncSession, user_id: uuid.UUID, course_id: uuid.UUID) -> Enrollment:
        course = await CourseService.get_course(db, course_id)
        # Check if already enrolled
        stmt = select(Enrollment).where(Enrollment.user_id == user_id, Enrollment.course_id == course_id)
        existing = await db.scalar(stmt)
        if existing:
            raise BadRequestException("Already enrolled")
        enrollment = Enrollment(user_id=user_id, course_id=course_id)
        db.add(enrollment)
        # Increment denormalized count for fast display
        course.enrollment_count = (course.enrollment_count or 0) + 1
        await db.commit()
        await db.refresh(enrollment)
        return enrollment

    @staticmethod
    async def my_courses(db: AsyncSession, user_id: uuid.UUID) -> list[Enrollment]:
        result = await db.execute(
            select(Enrollment).where(Enrollment.user_id == user_id).order_by(Enrollment.created_at.desc())
        )
        return list(result.scalars().all())

    @staticmethod
    async def get_lessons(db: AsyncSession, course_id: uuid.UUID) -> list[Lesson]:
        # Fetch all modules for the course and their lessons
        modules_stmt = select(Module).where(Module.course_id == course_id).order_by(Module.order)
        modules_result = await db.execute(modules_stmt)
        modules = modules_result.scalars().all()
        lessons = []
        for module in modules:
            lessons_stmt = select(Lesson).where(Lesson.module_id == module.id).order_by(Lesson.order)
            lessons_result = await db.execute(lessons_stmt)
            lessons.extend(lessons_result.scalars().all())
        return lessons

    # Admin
    @staticmethod
    async def create_course(db: AsyncSession, data: dict) -> Course:
        course = Course(**data)
        db.add(course)
        await db.commit()
        await db.refresh(course)
        return course

    @staticmethod
    async def update_course(db: AsyncSession, course_id: uuid.UUID, data: dict) -> Course:
        course = await CourseService.get_course(db, course_id)
        for key, value in data.items():
            if value is not None and hasattr(course, key):
                setattr(course, key, value)
        await db.commit()
        await db.refresh(course)
        return course

    @staticmethod
    async def delete_course(db: AsyncSession, course_id: uuid.UUID) -> None:
        course = await CourseService.get_course(db, course_id)
        course.deleted_at = datetime.now(timezone.utc)
        await db.commit()

    @staticmethod
    async def create_module(db: AsyncSession, course_id: uuid.UUID, data: dict) -> Module:
        module = Module(course_id=course_id, **data)
        db.add(module)
        await db.commit()
        await db.refresh(module)
        return module

    @staticmethod
    async def create_lesson(db: AsyncSession, module_id: uuid.UUID, data: dict) -> Lesson:
        lesson = Lesson(module_id=module_id, **data)
        db.add(lesson)
        await db.commit()
        await db.refresh(lesson)
        return lesson

    @staticmethod
    async def all_enrollments(db: AsyncSession, page: int = 1, size: int = 20) -> tuple[list[Enrollment], int]:
        count_q = select(func.count(Enrollment.id))
        total = await db.scalar(count_q) or 0
        result = await db.execute(
            select(Enrollment).order_by(Enrollment.created_at.desc()).offset((page - 1) * size).limit(size)
        )
        return list(result.scalars().all()), total