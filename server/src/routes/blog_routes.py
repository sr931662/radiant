from fastapi import APIRouter, Depends
from src.dependencies import get_current_user, get_current_admin_user
from src.schemas.blog import PostListResponse, PostResponse, CommentResponse
from src.controllers.blog_controller import (
    list_posts, get_post, add_comment,
    create_post, update_post, delete_post, list_comments, moderate_comment,
)

public_router = APIRouter(prefix="/api/v1/blog", tags=["Blog"])
admin_router = APIRouter(
    prefix="/api/v1/admin/blog",
    tags=["Admin-Blog"],
    dependencies=[Depends(get_current_admin_user)],
)

public_router.get("/posts", response_model=PostListResponse)(list_posts)
public_router.get("/posts/{slug}", response_model=PostResponse)(get_post)
public_router.post("/posts/{post_id}/comments", response_model=CommentResponse)(add_comment)

admin_router.post("/posts", response_model=PostResponse, status_code=201)(create_post)
admin_router.put("/posts/{post_id}", response_model=PostResponse)(update_post)
admin_router.delete("/posts/{post_id}")(delete_post)
admin_router.get("/comments", response_model=list[CommentResponse])(list_comments)
admin_router.patch("/comments/{comment_id}")(moderate_comment)