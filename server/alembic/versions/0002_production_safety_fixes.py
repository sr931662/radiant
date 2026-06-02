"""Production safety fixes: Numeric money columns, wider password column, OTP indexes and new columns.

Revision ID: 0002_production_safety_fixes
Revises: 0001_baseline
Create Date: 2026-06-02
"""
from alembic import op
import sqlalchemy as sa

revision = "0002_production_safety_fixes"
down_revision = "0001_baseline"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ── Monetary columns: Float → NUMERIC(10,2) ──────────────────────────────
    op.alter_column(
        "donations", "amount",
        existing_type=sa.Float(),
        type_=sa.Numeric(precision=10, scale=2),
        existing_nullable=False,
    )
    op.alter_column(
        "membership_plans", "price",
        existing_type=sa.Float(),
        type_=sa.Numeric(precision=10, scale=2),
        existing_nullable=False,
    )

    # ── User password: String(255) → String(500) ─────────────────────────────
    op.alter_column(
        "users", "password",
        existing_type=sa.String(255),
        type_=sa.String(500),
        existing_nullable=False,
    )

    # ── OTP: add created_at and failed_attempts columns ──────────────────────
    op.add_column(
        "otps",
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
    )
    op.add_column(
        "otps",
        sa.Column("failed_attempts", sa.Integer(), nullable=False, server_default="0"),
    )

    # ── Missing indexes ───────────────────────────────────────────────────────
    op.create_index("ix_otps_email", "otps", ["email"])
    op.create_index("ix_otps_purpose", "otps", ["purpose"])
    op.create_index("ix_otps_used", "otps", ["used"])
    op.create_index("ix_donations_user_id", "donations", ["user_id"])
    op.create_index("ix_donations_status", "donations", ["status"])
    op.create_index("ix_memberships_user_id", "memberships", ["user_id"])
    op.create_index("ix_memberships_status", "memberships", ["status"])


def downgrade() -> None:
    op.drop_index("ix_memberships_status", "memberships")
    op.drop_index("ix_memberships_user_id", "memberships")
    op.drop_index("ix_donations_status", "donations")
    op.drop_index("ix_donations_user_id", "donations")
    op.drop_index("ix_otps_used", "otps")
    op.drop_index("ix_otps_purpose", "otps")
    op.drop_index("ix_otps_email", "otps")

    op.drop_column("otps", "failed_attempts")
    op.drop_column("otps", "created_at")

    op.alter_column("users", "password", existing_type=sa.String(500), type_=sa.String(255), existing_nullable=False)
    op.alter_column("membership_plans", "price", existing_type=sa.Numeric(10, 2), type_=sa.Float(), existing_nullable=False)
    op.alter_column("donations", "amount", existing_type=sa.Numeric(10, 2), type_=sa.Float(), existing_nullable=False)
