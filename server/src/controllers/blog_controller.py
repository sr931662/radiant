import uuid
from fastapi import Depends, Query, Path, Body
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db
from src.dependencies import get_current_user, get_current_admin_user
from src.schemas.blog import (
    PostCreateRequest, PostUpdateRequest, PostResponse, PostListResponse,
    CommentCreateRequest, CommentResponse,
)
from src.schemas.common import APIResponse, PaginationQuery
from src.services.blog_service import BlogService


# ── Public ──
async def list_posts(
    pagination: PaginationQuery = Depends(),
    db: AsyncSession = Depends(get_db),
) -> PostListResponse:
    posts, total = await BlogService.list_posts(db, pagination.page, pagination.size)
    return PostListResponse(
        items=[PostResponse.model_validate(p) for p in posts],
        total=total,
        page=pagination.page,
        size=pagination.size,
        pages=(total + pagination.size - 1) // pagination.size,
    )


async def get_post(
    slug: str = Path(...),
    db: AsyncSession = Depends(get_db),
) -> PostResponse:
    post = await BlogService.get_post_by_slug(db, slug)
    return PostResponse.model_validate(post)


async def add_comment(
    post_id: uuid.UUID = Path(...),
    data: CommentCreateRequest = Body(...),
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> CommentResponse:
    comment = await BlogService.add_comment(db, post_id, current_user["sub"], data.content)
    return CommentResponse.model_validate(comment)


# ── Admin ──
async def create_post(
    data: PostCreateRequest = Body(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> PostResponse:
    post = await BlogService.create_post(db, data.model_dump())
    return PostResponse.model_validate(post)


async def update_post(
    post_id: uuid.UUID = Path(...),
    data: PostUpdateRequest = Body(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> PostResponse:
    post = await BlogService.update_post(db, post_id, data.model_dump(exclude_none=True))
    return PostResponse.model_validate(post)


async def delete_post(
    post_id: uuid.UUID = Path(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> APIResponse:
    await BlogService.delete_post(db, post_id)
    return APIResponse(message="Post deleted")


async def list_comments(
    pagination: PaginationQuery = Depends(),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> list[CommentResponse]:
    comments, _total = await BlogService.list_comments(db, pagination.page, pagination.size)
    return [CommentResponse.model_validate(c) for c in comments]


async def moderate_comment(
    comment_id: uuid.UUID = Path(...),
    status: str = Query(..., regex="^(APPROVED|REJECTED)$"),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin_user),
) -> APIResponse:
    await BlogService.moderate_comment(db, comment_id, status)
    return APIResponse(message="Comment moderated")