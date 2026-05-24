from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.models.role_permission import RolePermission
    from src.models.user_role import UserRole

from typing import List

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship


from .base import Base, UUIDMixin, TimestampMixin


class Role(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "roles"

    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)  # SUPER_ADMIN, ADMIN, FACULTY, STUDENT, VOLUNTEER, PUBLIC

    # Relationships
    permissions: Mapped[List["RolePermission"]] = relationship(back_populates="role", lazy="selectin")
    users: Mapped[List["UserRole"]] = relationship(back_populates="role", lazy="selectin")
