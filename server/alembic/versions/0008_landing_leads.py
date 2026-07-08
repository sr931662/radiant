"""Create landing_leads table.

Revision ID: 0008_landing_leads
Revises: 0007_banners
Create Date: 2026-07-08
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import text

revision = "0008_landing_leads"
down_revision = "0007_banners"
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
    if not _table_exists("landing_leads"):
        op.create_table(
            "landing_leads",
            sa.Column("id", sa.UUID(), nullable=False),
            sa.Column("name", sa.String(255), nullable=False),
            sa.Column("phone", sa.String(20), nullable=False),
            sa.Column("state", sa.String(100), nullable=False),
            sa.Column("course_type", sa.String(10), nullable=False),
            sa.Column("course", sa.String(255), nullable=False),
            sa.Column("status", sa.String(20), nullable=False, server_default="NEW"),
            sa.Column("source", sa.String(50), nullable=False, server_default="main_site"),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
            sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
            sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index("ix_landing_leads_status", "landing_leads", ["status"])
        op.create_index("ix_landing_leads_deleted_at", "landing_leads", ["deleted_at"])


def downgrade() -> None:
    try:
        op.drop_index("ix_landing_leads_status", table_name="landing_leads")
        op.drop_index("ix_landing_leads_deleted_at", table_name="landing_leads")
    except Exception:
        pass
    if _table_exists("landing_leads"):
        op.drop_table("landing_leads")
