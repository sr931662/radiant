"""Add slug column to courses table.

Revision ID: 0006_course_slug
Revises: 0005_rich_course_fdp_fields
Create Date: 2026-06-03
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import text

revision = "0006_course_slug"
down_revision = "0005_rich_course_fdp_fields"
branch_labels = None
depends_on = None


def _column_exists(table: str, column: str) -> bool:
    bind = op.get_bind()
    result = bind.execute(
        text("SELECT 1 FROM information_schema.columns WHERE table_name=:t AND column_name=:c"),
        {"t": table, "c": column},
    )
    return result.fetchone() is not None


def upgrade() -> None:
    if not _column_exists("courses", "slug"):
        op.add_column("courses", sa.Column("slug", sa.String(320), nullable=True))
        op.create_index("ix_courses_slug", "courses", ["slug"], unique=True)

        # Back-fill slugs for existing rows from title
        op.execute(text("""
            UPDATE courses
            SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(title, '[^a-zA-Z0-9\\s-]', '', 'g'), '[\\s_]+', '-', 'g'))
            WHERE slug IS NULL
        """))


def downgrade() -> None:
    try:
        op.drop_index("ix_courses_slug", table_name="courses")
    except Exception:
        pass
    if _column_exists("courses", "slug"):
        op.drop_column("courses", "slug")
