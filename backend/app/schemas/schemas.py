from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr


# --- Auth ---
class LoginRequest(BaseModel):
    email: str
    password: str


class SignupRequest(BaseModel):
    full_name: str
    email: str
    password: str
    designation: Optional[str] = ""
    department: Optional[str] = ""
    phone: Optional[str] = ""


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    full_name: str
    employee_code: str


# --- Employee / profile ---
class FamilyMemberOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    member_name: str
    date_of_birth: Optional[date]
    occupation: str
    relation: str
    dependent: bool


class EmergencyContactOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    person_name: str
    contact_no: str
    relation: str
    email: str
    address: str


class QualificationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    degree: str
    institution: str
    year: str
    grade: str


class ExperienceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    organization: str
    designation: str
    from_date: Optional[date]
    to_date: Optional[date]


class EmployeeBrief(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    full_name: str
    designation: str
    department: str
    office: str
    status: str
    photo_url: str


class EmployeeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    full_name: str
    designation: str
    grade: str
    department: str
    office: str
    status: str
    gender: str
    date_of_birth: Optional[date]
    blood_group: str
    nationality: str
    religion: str
    marital_status: str
    phone: str
    alt_phone: str
    address: str
    city: str
    state: str
    pincode: str
    pan: str
    aadhaar: str
    bank_account: str
    bank_ifsc: str
    bank_name: str
    date_of_joining: Optional[date]
    photo_url: str
    casual_leave: float
    earned_leave: float
    medical_leave: float
    family: list[FamilyMemberOut] = []
    emergency_contacts: list[EmergencyContactOut] = []
    qualifications: list[QualificationOut] = []
    experiences: list[ExperienceOut] = []


class EmployeeUpdate(BaseModel):
    # instant fields (contact / personal)
    phone: Optional[str] = None
    alt_phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    blood_group: Optional[str] = None
    marital_status: Optional[str] = None
    bank_account: Optional[str] = None
    bank_ifsc: Optional[str] = None
    bank_name: Optional[str] = None
    # official fields (require approval)
    full_name: Optional[str] = None
    designation: Optional[str] = None
    department: Optional[str] = None
    grade: Optional[str] = None


class ProfileUpdateResult(BaseModel):
    instant_applied: list[str] = []
    pending_fields: list[str] = []
    edit_request_id: Optional[int] = None


class EditRequestOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    employee_id: int
    changes: dict
    status: str
    applied_at: datetime
    employee_name: Optional[str] = None


class PendingAccountOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int  # user id
    email: str
    employee_code: str
    full_name: str
    designation: str
    department: str
    phone: str
    account_status: str


# --- Leave ---
class LeaveCreate(BaseModel):
    leave_type: str
    from_date: date
    to_date: date
    reason: str = ""


class LeaveDecision(BaseModel):
    status: str  # approved / rejected
    approver_remark: str = ""


class LeaveOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    employee_id: int
    leave_type: str
    from_date: date
    to_date: date
    total_days: float
    reason: str
    status: str
    approver_remark: str
    applied_at: datetime
    employee_name: Optional[str] = None
    department: Optional[str] = None


# --- Attendance ---
class AttendanceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    work_date: date
    check_in: Optional[datetime]
    check_out: Optional[datetime]
    status: str
    remark: str


# --- Salary ---
class SalaryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    month: int
    year: int
    basic: float
    da: float
    hra: float
    other_allowance: float
    pf: float
    tax: float
    other_deduction: float
    gross: float
    deductions: float
    net: float


# --- Generic request modules ---
class NOCCreate(BaseModel):
    purpose: str
    country: str = ""
    from_date: Optional[date] = None
    to_date: Optional[date] = None
    details: str = ""


class NOCOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    purpose: str
    country: str
    from_date: Optional[date]
    to_date: Optional[date]
    details: str
    status: str
    applied_at: datetime
    employee_name: Optional[str] = None


class ResignationCreate(BaseModel):
    resignation_type: str = "Resignation"
    last_working_date: Optional[date] = None
    reason: str = ""


class ResignationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    resignation_type: str
    last_working_date: Optional[date]
    reason: str
    status: str
    applied_at: datetime
    employee_name: Optional[str] = None


class VacationCreate(BaseModel):
    from_date: date
    to_date: date
    reason: str = ""


class VacationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    from_date: date
    to_date: date
    total_days: float
    reason: str
    status: str
    applied_at: datetime
    employee_name: Optional[str] = None


class OutOfStationCreate(BaseModel):
    destination: str
    purpose: str = ""
    from_date: date
    to_date: date


class OutOfStationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    destination: str
    purpose: str
    from_date: date
    to_date: date
    status: str
    applied_at: datetime
    employee_name: Optional[str] = None


class DACPCreate(BaseModel):
    current_grade: str = ""
    proposed_grade: str = ""
    due_date: Optional[date] = None
    remarks: str = ""


class DACPOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    current_grade: str
    proposed_grade: str
    due_date: Optional[date]
    remarks: str
    status: str
    applied_at: datetime
    employee_name: Optional[str] = None


# --- Assets / Liability ---
class AssetCreate(BaseModel):
    asset_type: str
    description: str = ""
    value: float = 0
    acquired_on: Optional[date] = None


class AssetOut(AssetCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int


class LiabilityCreate(BaseModel):
    liability_type: str
    description: str = ""
    amount: float = 0
    creditor: str = ""


class LiabilityOut(LiabilityCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int


# --- Announcements ---
class AnnouncementOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    category: str
    title: str
    body: str
    created_at: datetime


# --- Decision (generic) ---
class Decision(BaseModel):
    status: str  # approved / rejected
    remark: str = ""


# --- Dashboard ---
class DashboardStats(BaseModel):
    leave_pending: int
    leave_approved: int
    attendance_present_days: int
    pending_approvals: int
    total_employees: int
    birthdays_today: list[EmployeeBrief]
    new_joinings: list[EmployeeBrief]
    retirements: list[EmployeeBrief]
    leave_balance: dict
