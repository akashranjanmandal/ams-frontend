import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Boolean, DateTime, ForeignKey, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.types import UUID
from app.db.base import Base


class AdvisoryCommittee(Base):
    __tablename__ = "ams_advisory_committees"
    id: Mapped[uuid.UUID]           = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id: Mapped[uuid.UUID]   = mapped_column(UUID(as_uuid=True), ForeignKey("ams_users.id"), unique=True)
    research_title: Mapped[str | None] = mapped_column(String(500))
    research_area: Mapped[str | None]  = mapped_column(String(200))
    status: Mapped[str]             = mapped_column(String(20), default="draft")  # draft / active / locked / dissolved
    is_locked: Mapped[bool]         = mapped_column(Boolean, default=False)
    formed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime]    = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime]    = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    student: Mapped["User"]         = relationship("User", foreign_keys=[student_id])
    members: Mapped[list["CommitteeMember"]] = relationship("CommitteeMember", back_populates="committee", cascade="all, delete-orphan")


class CommitteeMember(Base):
    __tablename__ = "ams_committee_members"
    id: Mapped[uuid.UUID]             = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    committee_id: Mapped[uuid.UUID]   = mapped_column(UUID(as_uuid=True), ForeignKey("ams_advisory_committees.id", ondelete="CASCADE"))
    faculty_id: Mapped[uuid.UUID]     = mapped_column(UUID(as_uuid=True), ForeignKey("ams_users.id"))
    # major_advisor / co_major_advisor / member
    role: Mapped[str]                 = mapped_column(String(30), default="member")
    accepted: Mapped[bool | None]     = mapped_column(Boolean)
    accepted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    invited_at: Mapped[datetime]      = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    __table_args__ = (UniqueConstraint("committee_id", "faculty_id", name="uq_committee_member"),)

    committee: Mapped["AdvisoryCommittee"] = relationship("AdvisoryCommittee", back_populates="members")
    faculty: Mapped["User"]                = relationship("User", foreign_keys=[faculty_id])


from app.models.user import User  # noqa: E402
