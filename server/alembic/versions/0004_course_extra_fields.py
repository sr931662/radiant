"""Add level, mode, duration_weeks, max_seats to courses table.

Revision ID: 0004_course_extra_fields
Revises: 0003_gallery_album_tag
Create Date: 2026-06-02
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import text

revision = "0004_course_extra_fields"
down_revision = "0003_gallery_album_tag"
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
    if not _column_exists("courses", "level"):
        op.add_column("courses", sa.Column("level", sa.String(20), nullable=True))
    if not _column_exists("courses", "mode"):
        op.add_column("courses", sa.Column("mode", sa.String(20), nullable=True))
    if not _column_exists("courses", "duration_weeks"):
        op.add_column("courses", sa.Column("duration_weeks", sa.Integer(), nullable=True))
    if not _column_exists("courses", "max_seats"):
        op.add_column("courses", sa.Column("max_seats", sa.Integer(), nullable=True))


def downgrade() -> None:
    for col in ("max_seats", "duration_weeks", "mode", "level"):
        if _column_exists("courses", col):
            op.drop_column("courses", col)
