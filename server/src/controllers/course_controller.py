import uuid
from fastapi import Depends, Query, Path, Body
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db
from src.dependencies import get_current_user, get_current_admin_user
from src.schemas.course import (
    CourseCreateRequest, CourseUpdateRequest, CourseResponse, CourseDetailResponse,
    CourseListResponse, ModuleCreateRequest, ModuleResponse, LessonCreateRequest,
    LessonResponse, EnrollmentResponse, EnrollmentListResponse,
)
from src.schemas.common import APIResponse, PaginationQuery
from src.services.course_service import CourseService


# ── Public ──
async def list_courses(
    pagination: PaginationQuery = Depends(),
    db: AsyncSession = Depends(get_db),
) -> CourseListResponse:
    courses, total = await CourseService.list_courses(db, pagination.page, pagination.size)
    return CourseListResponse(
        items=[CourseResponse.model_validate(c) for c in courses],
        total=total,
        page=pagination.page,
        size=pagination.size,
        pages=(total + pagination.size - 1) // pagination.size,
    )


async def get_course(
    course_id: uuid.UUID = Path(...),
    db: AsyncSession = Depends(get_db),
) -> CourseDetailResponse:
    course = await CourseService.get_course(db, course_id)
    return CourseDetailResponse.model_validate(course)


async def enroll(
    course_id: uuid.UUID = Path(...),
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> EnrollmentResponse:
    enrollment = await CourseService.enroll(db, current_user["sub"], course_id)
    return EnrollmentResponse.model_validate(enrollment)


async def my_courses(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> EnrollmentListResponse:
    enrollments = await CourseService.my_courses(db, current_user["sub"])
    return EnrollmentListResponse(
        items=[EnrollmentResponse.model_validate(e) for e in enrollments],
        total=len(enrollments),
        page=1,
        size=len(enrollments),
        pages=1,
    )


async def get_lessons(
    course_id: uuid.UUID = Path(...),
    db: AsyncSession = Depends(get_db),
) -> list[LessonResponse]:
    lessons = await CourseService.get_lessons(db, course_id)
    return [LessonResponse.model_validate(l) for l in lessons]


# ── Admin ──
async def admin_list_courses(
    pagination: PaginationQuery = Depends(),
    db: AsyncSession = Depends(get_db),
) -> CourseListResponse:
    courses, total = await CourseService.list_courses(db, pagination.page, pagination.size)
    return CourseListResponse(
        items=[CourseResponse.model_validate(c) for c in courses],
        total=total,
        page=pagination.page,
        size=pagination.size,
        pages=(total + pagination.size - 1) // pagination.size,
    )


async def create_course(
    data: CourseCreateRequest = Body(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> CourseResponse:
    course = await CourseService.create_course(db, data.model_dump())
    return CourseResponse.model_validate(course)


async def update_course(
    course_id: uuid.UUID = Path(...),
    data: CourseUpdateRequest = Body(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> CourseResponse:
    course = await CourseService.update_course(db, course_id, data.model_dump(exclude_none=True))
    return CourseResponse.model_validate(course)


async def delete_course(
    course_id: uuid.UUID = Path(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> APIResponse:
    await CourseService.delete_course(db, course_id)
    return APIResponse(message="Course deleted")


async def create_module(
    course_id: uuid.UUID = Path(...),
    data: ModuleCreateRequest = Body(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> ModuleResponse:
    module = await CourseService.create_module(db, course_id, data.model_dump())
    return ModuleResponse.model_validate(module)


async def create_lesson(
    module_id: uuid.UUID = Path(...),
    data: LessonCreateRequest = Body(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> LessonResponse:
    lesson = await CourseService.create_lesson(db, module_id, data.model_dump())
    return LessonResponse.model_validate(lesson)


async def all_enrollments(
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> EnrollmentListResponse:
    enrollments = await CourseService.all_enrollments(db)
    return EnrollmentListResponse(
        items=[EnrollmentResponse.model_validate(e) for e in enrollments],
        total=len(enrollments),
        page=1,
        size=len(enrollments),
        pages=1,
    )