"""Add tag column to gallery_albums for frontend category filtering.

Revision ID: 0003_gallery_album_tag
Revises: 0002_production_safety_fixes
Create Date: 2026-06-02
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import text

revision = "0003_gallery_album_tag"
down_revision = "0002_production_safety_fixes"
branch_labels = None
depends_on = None


def _column_exists(table: str, column: str) -> bool:
    bind = op.get_bind()
    result = bind.execute(
        text(
            "SELECT 1 FROM information_schema.columns "
            "WHERE table_name = :t AND column_name = :c"
        ),
        {"t": table, "c": column},
    )
    return result.fetchone() is not None


def upgrade() -> None:
    if not _column_exists("gallery_albums", "tag"):
        op.add_column(
            "gallery_albums",
            sa.Column("tag", sa.String(100), nullable=True),
        )


def downgrade() -> None:
    if _column_exists("gallery_albums", "tag"):
        op.drop_column("gallery_albums", "tag")
