import uuid
from datetime import datetime
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from src.models import BlogPost, BlogComment
from src.utils.slug import generate_slug
from src.utils.exceptions import NotFoundException, BadRequestException


class BlogService:
    @staticmethod
    async def list_posts(db: AsyncSession, page: int, size: int) -> tuple[list[BlogPost], int]:
        query = select(BlogPost).where(BlogPost.deleted_at == None, BlogPost.status == "PUBLISHED").order_by(BlogPost.created_at.desc())
        count_query = select(func.count(BlogPost.id)).where(BlogPost.deleted_at == None, BlogPost.status == "PUBLISHED")
        total = await db.scalar(count_query) or 0
        query = query.offset((page - 1) * size).limit(size)
        result = await db.execute(query)
        posts = list(result.scalars().all())
        for post in posts:
            comment_count_stmt = select(func.count(BlogComment.id)).where(BlogComment.post_id == post.id, BlogComment.status == "APPROVED")
            setattr(post, "comment_count", await db.scalar(comment_count_stmt) or 0)
        return posts, total

    @staticmethod
    async def list_all_posts(db: AsyncSession, page: int, size: int) -> tuple[list[BlogPost], int]:
        query = select(BlogPost).where(BlogPost.deleted_at == None).order_by(BlogPost.created_at.desc())
        count_query = select(func.count(BlogPost.id)).where(BlogPost.deleted_at == None)
        total = await db.scalar(count_query) or 0
        query = query.offset((page - 1) * size).limit(size)
        result = await db.execute(query)
        posts = list(result.scalars().all())
        for post in posts:
            comment_count_stmt = select(func.count(BlogComment.id)).where(
                BlogComment.post_id == post.id,
                BlogComment.status == "APPROVED",
            )
            setattr(post, "comment_count", await db.scalar(comment_count_stmt) or 0)
        return posts, total

    @staticmethod
    async def get_post_by_slug(db: AsyncSession, slug: str) -> BlogPost:
        stmt = select(BlogPost).where(BlogPost.slug == slug, BlogPost.deleted_at == None, BlogPost.status == "PUBLISHED")
        result = await db.execute(stmt)
        post = result.scalar_one_or_none()
        if not post:
            raise NotFoundException("Post not found")
        return post

    @staticmethod
    async def add_comment(db: AsyncSession, post_id: uuid.UUID, user_id: uuid.UUID, content: str) -> BlogComment:
        post = await db.get(BlogPost, post_id)
        if not post:
            raise NotFoundException("Post not found")
        comment = BlogComment(post_id=post_id, user_id=user_id, content=content, status="PENDING")
        db.add(comment)
        await db.commit()
        await db.refresh(comment)
        return comment

    # Admin
    @staticmethod
    async def create_post(db: AsyncSession, data: dict) -> BlogPost:
        slug = generate_slug(data["title"])
        post = BlogPost(**data, slug=slug)
        if data.get("status") == "PUBLISHED":
            post.published_at = datetime.utcnow()
        db.add(post)
        await db.commit()
        await db.refresh(post)
        return post

    @staticmethod
    async def update_post(db: AsyncSession, post_id: uuid.UUID, data: dict) -> BlogPost:
        post = await db.get(BlogPost, post_id)
        if not post:
            raise NotFoundException("Post not found")
        if "title" in data and data["title"]:
            post.slug = generate_slug(data["title"])
        for key, value in data.items():
            if value is not None and hasattr(post, key):
                setattr(post, key, value)
        if data.get("status") == "PUBLISHED" and not post.published_at:
            post.published_at = datetime.utcnow()
        await db.commit()
        await db.refresh(post)
        return post

    @staticmethod
    async def delete_post(db: AsyncSession, post_id: uuid.UUID) -> None:
        post = await db.get(BlogPost, post_id)
        if not post:
            raise NotFoundException("Post not found")
        post.deleted_at = datetime.utcnow()
        await db.commit()

    @staticmethod
    async def list_comments(db: AsyncSession, page: int, size: int) -> tuple[list[BlogComment], int]:
        query = select(BlogComment).order_by(BlogComment.created_at.desc())
        count_query = select(func.count(BlogComment.id))
        total = await db.scalar(count_query) or 0
        query = query.offset((page - 1) * size).limit(size)
        result = await db.execute(query)
        return list(result.scalars().all()), total

    @staticmethod
    async def moderate_comment(db: AsyncSession, comment_id: uuid.UUID, status: str) -> BlogComment:
        comment = await db.get(BlogComment, comment_id)
        if not comment:
            raise NotFoundException("Comment not found")
        comment.status = status
        await db.commit()
        await db.refresh(comment)
        return comment
