from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.models.role_permission import RolePermission

from typing import List

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship


from .base import Base, UUIDMixin, TimestampMixin


class Permission(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "permissions"

    action: Mapped[str] = mapped_column(String(100), nullable=False)    # e.g., "membership:approve"
    resource: Mapped[str] = mapped_column(String(100), nullable=False)  # e.g., "membership"

    # Relationships
    roles: Mapped[List["RolePermission"]] = relationship(back_populates="permission", lazy="selectin")
