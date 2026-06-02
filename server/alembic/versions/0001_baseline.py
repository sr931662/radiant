"""Baseline — marks current schema state; no-op for existing databases.

Revision ID: 0001_baseline
Revises:
Create Date: 2026-06-02
"""
from alembic import op

revision = "0001_baseline"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # This is a baseline revision for databases already created via seed_db.py / create_all.
    # All tables already exist in the database — nothing to do here.
    pass


def downgrade() -> None:
    pass
