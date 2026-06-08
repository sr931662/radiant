"""Create banners table.

Revision ID: 0007_banners
Revises: 0006_course_slug
Create Date: 2026-06-08
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import text

revision = "0007_banners"
down_revision = "0006_course_slug"
branch_labels = None
depends_on = None


def _table_exists(table: str) -> bool:
    bind = op.get_bind()
    result = bind.execute(
        text("SELECT 1 FROM information_schema.tables WHERE table_name=:t"),
        {"t": table},
    )
    return result.fetchone() is not None


def upgrade() -> None:
    if not _table_exists("banners"):
        op.create_table(
            "banners",
            sa.Column("id", sa.UUID(), nullable=False),
            sa.Column("message", sa.Text(), nullable=False),
            sa.Column("badge_text", sa.String(50), nullable=True),
            sa.Column("type", sa.String(20), nullable=False, server_default="info"),
            sa.Column("cta_text", sa.String(100), nullable=True),
            sa.Column("cta_url", sa.String(500), nullable=True),
            sa.Column("is_active", sa.Boolean(), nullable=False, server_default="false"),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
            sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
            sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index("ix_banners_is_active", "banners", ["is_active"])
        op.create_index("ix_banners_deleted_at", "banners", ["deleted_at"])


def downgrade() -> None:
    try:
        op.drop_index("ix_banners_is_active", table_name="banners")
        op.drop_index("ix_banners_deleted_at", table_name="banners")
    except Exception:
        pass
    if _table_exists("banners"):
        op.drop_table("banners")
