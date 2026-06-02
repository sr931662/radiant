"""Add rich content fields to courses and fdp tables.

Revision ID: 0005_rich_course_fdp_fields
Revises: 0004_course_extra_fields
Create Date: 2026-06-03
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import text
from sqlalchemy.dialects.postgresql import ARRAY

revision = "0005_rich_course_fdp_fields"
down_revision = "0004_course_extra_fields"
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
    # ── courses ──
    course_cols = [
        ("instructor",         sa.Column("instructor", sa.String(255), nullable=True)),
        ("instructor_bio",     sa.Column("instructor_bio", sa.Text(), nullable=True)),
        ("what_you_learn",     sa.Column("what_you_learn", ARRAY(sa.String()), nullable=True)),
        ("prerequisites",      sa.Column("prerequisites", sa.Text(), nullable=True)),
        ("target_audience",    sa.Column("target_audience", sa.Text(), nullable=True)),
        ("language",           sa.Column("language", sa.String(100), nullable=True, server_default="Hindi / English")),
        ("certificate_offered",sa.Column("certificate_offered", sa.Boolean(), nullable=False, server_default="true")),
        ("enrollment_count",   sa.Column("enrollment_count", sa.Integer(), nullable=False, server_default="0")),
    ]
    for col_name, col_def in course_cols:
        if not _column_exists("courses", col_name):
            op.add_column("courses", col_def)

    # ── fdps ──
    fdp_cols = [
        ("resource_person", sa.Column("resource_person", sa.String(255), nullable=True)),
        ("fee",             sa.Column("fee", sa.Float(), nullable=False, server_default="0.0")),
    ]
    for col_name, col_def in fdp_cols:
        if not _column_exists("fdps", col_name):
            op.add_column("fdps", col_def)


def downgrade() -> None:
    for col in ("enrollment_count", "certificate_offered", "language",
                "target_audience", "prerequisites", "what_you_learn",
                "instructor_bio", "instructor"):
        if _column_exists("courses", col):
            op.drop_column("courses", col)

    for col in ("fee", "resource_person"):
        if _column_exists("fdps", col):
            op.drop_column("fdps", col)
