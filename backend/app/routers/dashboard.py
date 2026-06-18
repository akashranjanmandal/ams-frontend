from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy import extract
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.models import (
    Announcement,
    Attendance,
    DACPRequest,
    Employee,
    LeaveRequest,
    NOCRequest,
    OutOfStationRequest,
    RequestStatus,
    ResignationRequest,
    Role,
    User,
    VacationRequest,
)
from app.schemas.schemas import AnnouncementOut, DashboardStats, EmployeeBrief

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/stats", response_model=DashboardStats)
def stats(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    emp = user.employee
    today = date.today()

    leave_pending = (
        db.query(LeaveRequest)
        .filter(LeaveRequest.employee_id == emp.id, LeaveRequest.status == RequestStatus.pending)
        .count()
    )
    leave_approved = (
        db.query(LeaveRequest)
        .filter(LeaveRequest.employee_id == emp.id, LeaveRequest.status == RequestStatus.approved)
        .count()
    )
    present_days = (
        db.query(Attendance)
        .filter(
            Attendance.employee_id == emp.id,
            extract("month", Attendance.work_date) == today.month,
            extract("year", Attendance.work_date) == today.year,
        )
        .count()
    )

    pending_approvals = 0
    if user.role in (Role.hr, Role.admin):
        for model in (
            LeaveRequest, NOCRequest, ResignationRequest,
            VacationRequest, OutOfStationRequest, DACPRequest,
        ):
            pending_approvals += db.query(model).filter(model.status == RequestStatus.pending).count()

    total_employees = db.query(Employee).count()

    birthdays = (
        db.query(Employee)
        .filter(
            extract("month", Employee.date_of_birth) == today.month,
            extract("day", Employee.date_of_birth) == today.day,
        )
        .all()
    )
    new_joinings = (
        db.query(Employee)
        .filter(Employee.date_of_joining.isnot(None))
        .order_by(Employee.date_of_joining.desc())
        .limit(5)
        .all()
    )
    retirements = []  # placeholder, computed when retirement_date is tracked

    return DashboardStats(
        leave_pending=leave_pending,
        leave_approved=leave_approved,
        attendance_present_days=present_days,
        pending_approvals=pending_approvals,
        total_employees=total_employees,
        birthdays_today=[EmployeeBrief.model_validate(e) for e in birthdays],
        new_joinings=[EmployeeBrief.model_validate(e) for e in new_joinings],
        retirements=[EmployeeBrief.model_validate(e) for e in retirements],
        leave_balance={
            "Casual Leave": emp.casual_leave,
            "Earned Leave": emp.earned_leave,
            "Medical Leave": emp.medical_leave,
        },
    )


@router.get("/announcements", response_model=list[AnnouncementOut])
def announcements(
    category: str = "",
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    q = db.query(Announcement)
    if category:
        q = q.filter(Announcement.category == category)
    return q.order_by(Announcement.created_at.desc()).limit(20).all()
