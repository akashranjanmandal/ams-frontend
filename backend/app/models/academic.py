import uuid
from datetime import datetime, date, timezone
from sqlalchemy import String, Boolean, DateTime, Date, ForeignKey, Text, Integer, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.types import UUID
from app.db.base import Base


class AcademicCalendar(Base):
    __tablename__ = "ams_academic_calendars"
    id: Mapped[uuid.UUID]    = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str]        = mapped_column(String(200), nullable=False)  # e.g. "2024-25"
    academic_year: Mapped[str] = mapped_column(String(20), nullable=False)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date]   = mapped_column(Date, nullable=False)
    status: Mapped[str]      = mapped_column(String(20), default="draft")  # draft / active / closed
    description: Mapped[str | None] = mapped_column(Text)
    created_by: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("ams_users.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    semesters: Mapped[list["Semester"]] = relationship("Semester", back_populates="calendar", cascade="all, delete-orphan")


class Semester(Base):
    __tablename__ = "ams_semesters"
    id: Mapped[uuid.UUID]       = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    calendar_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("ams_academic_calendars.id", ondelete="CASCADE"))
    name: Mapped[str]           = mapped_column(String(100), nullable=False)  # "Semester I", "Semester II"
    sem_type: Mapped[str]       = mapped_column(String(20), default="odd")    # odd / even
    start_date: Mapped[date]    = mapped_column(Date, nullable=False)
    end_date: Mapped[date]      = mapped_column(Date, nullable=False)
    registration_start: Mapped[date | None] = mapped_column(Date)
    registration_end: Mapped[date | None]   = mapped_column(Date)
    exam_start: Mapped[date | None]         = mapped_column(Date)
    exam_end: Mapped[date | None]           = mapped_column(Date)
    result_declaration: Mapped[date | None] = mapped_column(Date)
    status: Mapped[str]         = mapped_column(String(20), default="upcoming")  # upcoming / active / completed
    holidays: Mapped[list | None] = mapped_column(JSON, default=list)            # [{date, name}]
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    calendar: Mapped["AcademicCalendar"] = relationship("AcademicCalendar", back_populates="semesters")
    offerings: Mapped[list["CourseOffering"]] = relationship("CourseOffering", back_populates="semester")


# Import here to avoid circular
from app.models.course import CourseOffering  # noqa: E402
