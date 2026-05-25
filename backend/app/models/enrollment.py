import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Boolean, DateTime, ForeignKey, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base


class StudentEnrollment(Base):
    __tablename__ = "ams_student_enrollments"
    id: Mapped[uuid.UUID]          = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id: Mapped[uuid.UUID]  = mapped_column(UUID(as_uuid=True), ForeignKey("ams_users.id"))
    offering_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("ams_course_offerings.id"))
    # pending → approved / rejected / withdrawn
    status: Mapped[str]            = mapped_column(String(20), default="pending")
    enrolled_at: Mapped[datetime]  = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    processed_by: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("ams_users.id"))
    processed_at: Mapped[datetime | None]  = mapped_column(DateTime(timezone=True))
    remarks: Mapped[str | None]    = mapped_column(Text)

    __table_args__ = (UniqueConstraint("student_id", "offering_id", name="uq_enrollment"),)

    student: Mapped["User"]        = relationship("User", foreign_keys=[student_id])
    processor: Mapped["User | None"] = relationship("User", foreign_keys=[processed_by])
    offering: Mapped["CourseOffering"] = relationship("CourseOffering", back_populates="enrollments")


from app.models.user import User  # noqa: E402
from app.models.course import CourseOffering  # noqa: E402
