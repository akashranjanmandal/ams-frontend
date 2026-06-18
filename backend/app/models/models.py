from datetime import date, datetime, timezone
import enum

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Role(str, enum.Enum):
    employee = "employee"
    hr = "hr"
    admin = "admin"


class RequestStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"
    cancelled = "cancelled"


class AccountStatus(str, enum.Enum):
    pending = "pending"   # signed up, awaiting admin approval
    active = "active"     # approved, can log in
    rejected = "rejected"
    suspended = "suspended"


# ----------------------------------------------------------------------------
# Core identity
# ----------------------------------------------------------------------------
class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    employee_code: Mapped[str] = mapped_column(String(20), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    role: Mapped[Role] = mapped_column(Enum(Role), default=Role.employee)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    account_status: Mapped[AccountStatus] = mapped_column(
        Enum(AccountStatus), default=AccountStatus.active
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    employee: Mapped["Employee"] = relationship(back_populates="user", uselist=False)


class Employee(Base):
    __tablename__ = "employees"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)

    full_name: Mapped[str] = mapped_column(String(150))
    designation: Mapped[str] = mapped_column(String(120), default="")
    grade: Mapped[str] = mapped_column(String(60), default="")
    department: Mapped[str] = mapped_column(String(120), default="")
    office: Mapped[str] = mapped_column(String(160), default="")
    status: Mapped[str] = mapped_column(String(40), default="Working")

    gender: Mapped[str] = mapped_column(String(20), default="")
    date_of_birth: Mapped[date | None] = mapped_column(Date, nullable=True)
    blood_group: Mapped[str] = mapped_column(String(8), default="")
    nationality: Mapped[str] = mapped_column(String(60), default="IND-INDIAN")
    religion: Mapped[str] = mapped_column(String(60), default="")
    marital_status: Mapped[str] = mapped_column(String(30), default="")

    phone: Mapped[str] = mapped_column(String(20), default="")
    alt_phone: Mapped[str] = mapped_column(String(20), default="")
    address: Mapped[str] = mapped_column(Text, default="")
    city: Mapped[str] = mapped_column(String(80), default="")
    state: Mapped[str] = mapped_column(String(80), default="Assam")
    pincode: Mapped[str] = mapped_column(String(12), default="")

    pan: Mapped[str] = mapped_column(String(20), default="")
    aadhaar: Mapped[str] = mapped_column(String(20), default="")

    bank_account: Mapped[str] = mapped_column(String(40), default="")
    bank_ifsc: Mapped[str] = mapped_column(String(20), default="")
    bank_name: Mapped[str] = mapped_column(String(120), default="")

    date_of_joining: Mapped[date | None] = mapped_column(Date, nullable=True)
    photo_url: Mapped[str] = mapped_column(String(255), default="")

    # leave balances
    casual_leave: Mapped[float] = mapped_column(Float, default=12)
    earned_leave: Mapped[float] = mapped_column(Float, default=30)
    medical_leave: Mapped[float] = mapped_column(Float, default=10)

    reports_to_id: Mapped[int | None] = mapped_column(
        ForeignKey("employees.id"), nullable=True
    )

    user: Mapped["User"] = relationship(back_populates="employee")
    family: Mapped[list["FamilyMember"]] = relationship(
        back_populates="employee", cascade="all, delete-orphan"
    )
    emergency_contacts: Mapped[list["EmergencyContact"]] = relationship(
        back_populates="employee", cascade="all, delete-orphan"
    )
    qualifications: Mapped[list["Qualification"]] = relationship(
        back_populates="employee", cascade="all, delete-orphan"
    )
    experiences: Mapped[list["Experience"]] = relationship(
        back_populates="employee", cascade="all, delete-orphan"
    )


class FamilyMember(Base):
    __tablename__ = "family_members"
    id: Mapped[int] = mapped_column(primary_key=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"))
    member_name: Mapped[str] = mapped_column(String(120))
    date_of_birth: Mapped[date | None] = mapped_column(Date, nullable=True)
    occupation: Mapped[str] = mapped_column(String(80), default="")
    relation: Mapped[str] = mapped_column(String(40), default="")
    dependent: Mapped[bool] = mapped_column(Boolean, default=False)
    employee: Mapped["Employee"] = relationship(back_populates="family")


class EmergencyContact(Base):
    __tablename__ = "emergency_contacts"
    id: Mapped[int] = mapped_column(primary_key=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"))
    person_name: Mapped[str] = mapped_column(String(120))
    contact_no: Mapped[str] = mapped_column(String(20), default="")
    relation: Mapped[str] = mapped_column(String(40), default="")
    email: Mapped[str] = mapped_column(String(120), default="")
    address: Mapped[str] = mapped_column(Text, default="")
    employee: Mapped["Employee"] = relationship(back_populates="emergency_contacts")


class Qualification(Base):
    __tablename__ = "qualifications"
    id: Mapped[int] = mapped_column(primary_key=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"))
    degree: Mapped[str] = mapped_column(String(120))
    institution: Mapped[str] = mapped_column(String(160), default="")
    year: Mapped[str] = mapped_column(String(10), default="")
    grade: Mapped[str] = mapped_column(String(40), default="")
    employee: Mapped["Employee"] = relationship(back_populates="qualifications")


class Experience(Base):
    __tablename__ = "experiences"
    id: Mapped[int] = mapped_column(primary_key=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"))
    organization: Mapped[str] = mapped_column(String(160))
    designation: Mapped[str] = mapped_column(String(120), default="")
    from_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    to_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    employee: Mapped["Employee"] = relationship(back_populates="experiences")


# ----------------------------------------------------------------------------
# Leave
# ----------------------------------------------------------------------------
class LeaveRequest(Base):
    __tablename__ = "leave_requests"
    id: Mapped[int] = mapped_column(primary_key=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"))
    leave_type: Mapped[str] = mapped_column(String(60))
    from_date: Mapped[date] = mapped_column(Date)
    to_date: Mapped[date] = mapped_column(Date)
    total_days: Mapped[float] = mapped_column(Float)
    reason: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[RequestStatus] = mapped_column(
        Enum(RequestStatus), default=RequestStatus.pending
    )
    approver_id: Mapped[int | None] = mapped_column(
        ForeignKey("employees.id"), nullable=True
    )
    approver_remark: Mapped[str] = mapped_column(Text, default="")
    applied_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    decided_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )


# ----------------------------------------------------------------------------
# Attendance
# ----------------------------------------------------------------------------
class Attendance(Base):
    __tablename__ = "attendance"
    id: Mapped[int] = mapped_column(primary_key=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"))
    work_date: Mapped[date] = mapped_column(Date, default=date.today)
    check_in: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    check_out: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    status: Mapped[str] = mapped_column(String(20), default="Present")
    remark: Mapped[str] = mapped_column(String(160), default="")


# ----------------------------------------------------------------------------
# Salary
# ----------------------------------------------------------------------------
class SalarySlip(Base):
    __tablename__ = "salary_slips"
    id: Mapped[int] = mapped_column(primary_key=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"))
    month: Mapped[int] = mapped_column(Integer)
    year: Mapped[int] = mapped_column(Integer)
    basic: Mapped[float] = mapped_column(Float, default=0)
    da: Mapped[float] = mapped_column(Float, default=0)
    hra: Mapped[float] = mapped_column(Float, default=0)
    other_allowance: Mapped[float] = mapped_column(Float, default=0)
    pf: Mapped[float] = mapped_column(Float, default=0)
    tax: Mapped[float] = mapped_column(Float, default=0)
    other_deduction: Mapped[float] = mapped_column(Float, default=0)

    @property
    def gross(self) -> float:
        return self.basic + self.da + self.hra + self.other_allowance

    @property
    def deductions(self) -> float:
        return self.pf + self.tax + self.other_deduction

    @property
    def net(self) -> float:
        return self.gross - self.deductions


# ----------------------------------------------------------------------------
# Generic request modules: NOC, Resignation, Vacation, DACP, Out of Station
# ----------------------------------------------------------------------------
class NOCRequest(Base):
    __tablename__ = "noc_requests"
    id: Mapped[int] = mapped_column(primary_key=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"))
    purpose: Mapped[str] = mapped_column(String(200))
    country: Mapped[str] = mapped_column(String(80), default="")
    from_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    to_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    details: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[RequestStatus] = mapped_column(
        Enum(RequestStatus), default=RequestStatus.pending
    )
    applied_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class ResignationRequest(Base):
    __tablename__ = "resignation_requests"
    id: Mapped[int] = mapped_column(primary_key=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"))
    resignation_type: Mapped[str] = mapped_column(String(60), default="Resignation")
    last_working_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    reason: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[RequestStatus] = mapped_column(
        Enum(RequestStatus), default=RequestStatus.pending
    )
    applied_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class VacationRequest(Base):
    __tablename__ = "vacation_requests"
    id: Mapped[int] = mapped_column(primary_key=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"))
    from_date: Mapped[date] = mapped_column(Date)
    to_date: Mapped[date] = mapped_column(Date)
    total_days: Mapped[float] = mapped_column(Float, default=0)
    reason: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[RequestStatus] = mapped_column(
        Enum(RequestStatus), default=RequestStatus.pending
    )
    applied_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class OutOfStationRequest(Base):
    __tablename__ = "out_of_station_requests"
    id: Mapped[int] = mapped_column(primary_key=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"))
    destination: Mapped[str] = mapped_column(String(120))
    purpose: Mapped[str] = mapped_column(String(200), default="")
    from_date: Mapped[date] = mapped_column(Date)
    to_date: Mapped[date] = mapped_column(Date)
    status: Mapped[RequestStatus] = mapped_column(
        Enum(RequestStatus), default=RequestStatus.pending
    )
    applied_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class DACPRequest(Base):
    __tablename__ = "dacp_requests"
    id: Mapped[int] = mapped_column(primary_key=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"))
    current_grade: Mapped[str] = mapped_column(String(80), default="")
    proposed_grade: Mapped[str] = mapped_column(String(80), default="")
    due_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    remarks: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[RequestStatus] = mapped_column(
        Enum(RequestStatus), default=RequestStatus.pending
    )
    applied_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


# ----------------------------------------------------------------------------
# Assets & Liability
# ----------------------------------------------------------------------------
class Asset(Base):
    __tablename__ = "assets"
    id: Mapped[int] = mapped_column(primary_key=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"))
    asset_type: Mapped[str] = mapped_column(String(80))
    description: Mapped[str] = mapped_column(String(200), default="")
    value: Mapped[float] = mapped_column(Float, default=0)
    acquired_on: Mapped[date | None] = mapped_column(Date, nullable=True)


class Liability(Base):
    __tablename__ = "liabilities"
    id: Mapped[int] = mapped_column(primary_key=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"))
    liability_type: Mapped[str] = mapped_column(String(80))
    description: Mapped[str] = mapped_column(String(200), default="")
    amount: Mapped[float] = mapped_column(Float, default=0)
    creditor: Mapped[str] = mapped_column(String(120), default="")


# ----------------------------------------------------------------------------
# Dashboard helpers: announcements / circulars / news
# ----------------------------------------------------------------------------
class Announcement(Base):
    __tablename__ = "announcements"
    id: Mapped[int] = mapped_column(primary_key=True)
    category: Mapped[str] = mapped_column(String(40), default="news")  # news/circular/training
    title: Mapped[str] = mapped_column(String(200))
    body: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


# ----------------------------------------------------------------------------
# Profile edit requests (official fields require HR/Admin approval)
# ----------------------------------------------------------------------------
class EditRequest(Base):
    __tablename__ = "edit_requests"
    id: Mapped[int] = mapped_column(primary_key=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"))
    changes_json: Mapped[str] = mapped_column(Text, default="{}")  # {field: {old, new}}
    status: Mapped[RequestStatus] = mapped_column(
        Enum(RequestStatus), default=RequestStatus.pending
    )
    applied_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
