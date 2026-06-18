"""Admin-only account approvals + HR/Admin edit-request approvals."""
import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import require_roles, require_staff
from app.models.models import (
    AccountStatus,
    EditRequest,
    Employee,
    RequestStatus,
    Role,
    User,
)
from app.schemas.schemas import Decision, PendingAccountOut

router = APIRouter(prefix="/api/admin", tags=["admin"])

admin_only = require_roles(Role.admin)


# ----------------------------------------------------------- account approval
@router.get("/accounts/pending", response_model=list[PendingAccountOut])
def pending_accounts(user: User = Depends(admin_only), db: Session = Depends(get_db)):
    rows = (
        db.query(User, Employee)
        .join(Employee, Employee.user_id == User.id)
        .filter(User.account_status == AccountStatus.pending)
        .all()
    )
    return [
        PendingAccountOut(
            id=u.id,
            email=u.email,
            employee_code=u.employee_code,
            full_name=e.full_name,
            designation=e.designation,
            department=e.department,
            phone=e.phone,
            account_status=u.account_status.value,
        )
        for u, e in rows
    ]


@router.post("/accounts/{user_id}/decision")
def decide_account(
    user_id: int,
    payload: Decision,
    user: User = Depends(admin_only),
    db: Session = Depends(get_db),
):
    target = db.query(User).filter(User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Account not found")
    if target.account_status != AccountStatus.pending:
        raise HTTPException(status_code=400, detail="Account already decided")

    if payload.status == "approved":
        target.account_status = AccountStatus.active
        if target.employee:
            target.employee.status = "Working"
    elif payload.status == "rejected":
        target.account_status = AccountStatus.rejected
    else:
        raise HTTPException(status_code=400, detail="Invalid decision")

    db.commit()
    return {"ok": True, "status": target.account_status.value}


# ----------------------------------------------------- edit-request approval
@router.get("/edit-requests/pending")
def pending_edits(user: User = Depends(require_staff), db: Session = Depends(get_db)):
    rows = (
        db.query(EditRequest, Employee)
        .join(Employee, Employee.id == EditRequest.employee_id)
        .filter(EditRequest.status == RequestStatus.pending)
        .order_by(EditRequest.applied_at.desc())
        .all()
    )
    return [
        {
            "id": r.id,
            "employee_id": r.employee_id,
            "employee_name": e.full_name,
            "changes": json.loads(r.changes_json),
            "status": r.status.value,
            "applied_at": r.applied_at,
        }
        for r, e in rows
    ]


@router.post("/edit-requests/{req_id}/decision")
def decide_edit(
    req_id: int,
    payload: Decision,
    user: User = Depends(require_staff),
    db: Session = Depends(get_db),
):
    req = db.query(EditRequest).filter(EditRequest.id == req_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Edit request not found")
    if req.status != RequestStatus.pending:
        raise HTTPException(status_code=400, detail="Already decided")

    if payload.status == "approved":
        emp = db.query(Employee).filter(Employee.id == req.employee_id).first()
        changes = json.loads(req.changes_json)
        for field, val in changes.items():
            setattr(emp, field, val["new"])
        req.status = RequestStatus.approved
    elif payload.status == "rejected":
        req.status = RequestStatus.rejected
    else:
        raise HTTPException(status_code=400, detail="Invalid decision")

    db.commit()
    return {"ok": True, "status": req.status.value}
