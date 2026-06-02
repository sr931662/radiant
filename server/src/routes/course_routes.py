from fastapi import APIRouter, Depends
from src.dependencies import get_current_user, get_current_admin_user
from src.schemas.course import CourseListResponse, CourseResponse, EnrollmentResponse, EnrollmentListResponse, LessonResponse, ModuleResponse
from src.controllers.course_controller import (
    list_courses, get_course, enroll, my_courses, get_lessons,
    admin_list_courses, create_course, update_course, delete_course,
    create_module, create_lesson, all_enrollments,
)

public_router = APIRouter(prefix="/api/v1/courses", tags=["Courses"])
admin_router = APIRouter(
    prefix="/api/v1/admin/courses",
    tags=["Admin-Courses"],
    dependencies=[Depends(get_current_admin_user)],
)

public_router.get("", response_model=CourseListResponse)(list_courses)
public_router.get("/my-courses", response_model=EnrollmentListResponse)(my_courses)
public_router.get("/{course_id}", response_model=CourseResponse)(get_course)
public_router.post("/{course_id}/enroll", response_model=EnrollmentResponse)(enroll)
public_router.get("/{course_id}/lessons", response_model=list[LessonResponse])(get_lessons)

admin_router.get("", response_model=CourseListResponse)(admin_list_courses)
admin_router.post("", response_model=CourseResponse, status_code=201)(create_course)
admin_router.put("/{course_id}", response_model=CourseResponse)(update_course)
admin_router.delete("/{course_id}")(delete_course)
admin_router.post("/{course_id}/modules", response_model=ModuleResponse)(create_module)
admin_router.post("/modules/{module_id}/lessons", response_model=LessonResponse)(create_lesson)
admin_router.get("/enrollments", response_model=EnrollmentListResponse)(all_enrollments)