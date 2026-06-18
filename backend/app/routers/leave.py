from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user, require_staff
from app.models.models import Employee, LeaveRequest, RequestStatus, User
from app.schemas.schemas import LeaveCreate, LeaveDecision, LeaveOut

router = APIRouter(prefix="/api/leave", tags=["leave"])

LEAVE_FIELD = {
    "Casual Leave": "casual_leave",
    "Earned Leave": "earned_leave",
    "Medical Leave": "medical_leave",
}


def _to_out(lr: LeaveRequest, emp: Employee | None = None) -> LeaveOut:
    out = LeaveOut.model_validate(lr)
    if emp:
        out.employee_name = emp.full_name
        out.department = emp.department
    return out


@router.post("", response_model=LeaveOut)
def apply_leave(
    payload: LeaveCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    emp = user.employee
    if not emp:
        raise HTTPException(status_code=404, detail="No employee profile")
    if payload.to_date < payload.from_date:
        raise HTTPException(status_code=400, detail="To date is before from date")
    total = (payload.to_date - payload.from_date).days + 1

    field = LEAVE_FIELD.get(payload.leave_type)
    if field and getattr(emp, field) < total:
        raise HTTPException(
            status_code=400,
            detail=f"Insufficient {payload.leave_type} balance ({getattr(emp, field)} left)",
        )

    lr = LeaveRequest(
        employee_id=emp.id,
        leave_type=payload.leave_type,
        from_date=payload.from_date,
        to_date=payload.to_date,
        total_days=total,
        reason=payload.reason,
        approver_id=emp.reports_to_id,
    )
    db.add(lr)
    db.commit()
    db.refresh(lr)
    return _to_out(lr, emp)


@router.get("/mine", response_model=list[LeaveOut])
def my_leaves(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    emp = user.employee
    rows = (
        db.query(LeaveRequest)
        .filter(LeaveRequest.employee_id == emp.id)
        .order_by(LeaveRequest.applied_at.desc())
        .all()
    )
    return [_to_out(r, emp) for r in rows]


@router.get("/pending", response_model=list[LeaveOut])
def pending(user: User = Depends(require_staff), db: Session = Depends(get_db)):
    rows = (
        db.query(LeaveRequest, Employee)
        .join(Employee, Employee.id == LeaveRequest.employee_id)
        .filter(LeaveRequest.status == RequestStatus.pending)
        .order_by(LeaveRequest.applied_at.desc())
        .all()
    )
    return [_to_out(lr, emp) for lr, emp in rows]


@router.get("/all", response_model=list[LeaveOut])
def all_leaves(user: User = Depends(require_staff), db: Session = Depends(get_db)):
    rows = (
        db.query(LeaveRequest, Employee)
        .join(Employee, Employee.id == LeaveRequest.employee_id)
        .order_by(LeaveRequest.applied_at.desc())
        .limit(500)
        .all()
    )
    return [_to_out(lr, emp) for lr, emp in rows]


@router.post("/{leave_id}/decision", response_model=LeaveOut)
def decide(
    leave_id: int,
    payload: LeaveDecision,
    user: User = Depends(require_staff),
    db: Session = Depends(get_db),
):
    lr = db.query(LeaveRequest).filter(LeaveRequest.id == leave_id).first()
    if not lr:
        raise HTTPException(status_code=404, detail="Leave not found")
    if lr.status != RequestStatus.pending:
        raise HTTPException(status_code=400, detail="Already decided")

    if payload.status not in ("approved", "rejected"):
        raise HTTPException(status_code=400, detail="Invalid decision")

    lr.status = RequestStatus(payload.status)
    lr.approver_remark = payload.approver_remark
    lr.approver_id = user.employee.id if user.employee else None
    lr.decided_at = datetime.now(timezone.utc)

    if lr.status == RequestStatus.approved:
        emp = db.query(Employee).filter(Employee.id == lr.employee_id).first()
        field = LEAVE_FIELD.get(lr.leave_type)
        if field and emp:
            setattr(emp, field, max(0, getattr(emp, field) - lr.total_days))

    db.commit()
    db.refresh(lr)
    emp = db.query(Employee).filter(Employee.id == lr.employee_id).first()
    return _to_out(lr, emp)


@router.post("/{leave_id}/cancel", response_model=LeaveOut)
def cancel(
    leave_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    lr = db.query(LeaveRequest).filter(LeaveRequest.id == leave_id).first()
    if not lr or lr.employee_id != user.employee.id:
        raise HTTPException(status_code=404, detail="Leave not found")
    if lr.status != RequestStatus.pending:
        raise HTTPException(status_code=400, detail="Only pending requests can be cancelled")
    lr.status = RequestStatus.cancelled
    db.commit()
    db.refresh(lr)
    return _to_out(lr, user.employee)
