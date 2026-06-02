from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.models.admission import Admission
    from src.models.attendance import Attendance
    from src.models.audit_log import AuditLog
    from src.models.blog_comment import BlogComment
    from src.models.certificate import Certificate
    from src.models.contact_inquiry import ContactInquiry
    from src.models.donation import Donation
    from src.models.enrollment import Enrollment
    from src.models.fdp_registration import FdpRegistration
    from src.models.internship_application import InternshipApplication
    from src.models.membership import Membership
    from src.models.notification import Notification
    from src.models.otp import OTP
    from src.models.refresh_token import RefreshToken
    from src.models.user_role import UserRole
    from src.models.volunteer_application import VolunteerApplication

import uuid
from typing import List, Optional

from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column, relationship


from .base import Base, UUIDMixin, TimestampMixin, SoftDeleteMixin


class User(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password: Mapped[str] = mapped_column(String(500), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    avatar: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    is_email_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_banned: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Relationships
    roles: Mapped[List["UserRole"]] = relationship(back_populates="user", lazy="selectin")
    refresh_tokens: Mapped[List["RefreshToken"]] = relationship(back_populates="user", lazy="selectin")
    otps: Mapped[List["OTP"]] = relationship(back_populates="user", lazy="selectin")
    memberships: Mapped[List["Membership"]] = relationship(back_populates="user", lazy="selectin", foreign_keys="[Membership.user_id]")
    fdp_registrations: Mapped[List["FdpRegistration"]] = relationship(back_populates="user", lazy="selectin")
    attendances: Mapped[List["Attendance"]] = relationship(back_populates="user", lazy="selectin")
    admissions: Mapped[List["Admission"]] = relationship(back_populates="user", lazy="selectin")
    donations: Mapped[List["Donation"]] = relationship(back_populates="user", lazy="selectin")
    enrollments: Mapped[List["Enrollment"]] = relationship(back_populates="user", lazy="selectin")
    certificates: Mapped[List["Certificate"]] = relationship(back_populates="user", lazy="selectin")
    volunteer_applications: Mapped[List["VolunteerApplication"]] = relationship(back_populates="user", lazy="selectin")
    internship_applications: Mapped[List["InternshipApplication"]] = relationship(back_populates="user", lazy="selectin")
    blog_comments: Mapped[List["BlogComment"]] = relationship(back_populates="user", lazy="selectin")
    contact_inquiries: Mapped[List["ContactInquiry"]] = relationship(back_populates="user", lazy="selectin")
    audit_logs: Mapped[List["AuditLog"]] = relationship(back_populates="user", lazy="selectin")
    notifications: Mapped[List["Notification"]] = relationship(back_populates="user", lazy="selectin")
