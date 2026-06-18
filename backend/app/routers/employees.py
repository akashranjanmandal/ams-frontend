import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user, require_staff
from app.models.models import EditRequest, Employee, RequestStatus, User
from app.schemas.schemas import (
    EmployeeBrief,
    EmployeeOut,
    EmployeeUpdate,
    ProfileUpdateResult,
)

router = APIRouter(prefix="/api/employees", tags=["employees"])

# Official fields require HR/Admin approval; everything else applies instantly.
OFFICIAL_FIELDS = {"full_name", "designation", "department", "grade"}


@router.get("/me", response_model=EmployeeOut)
def my_profile(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not user.employee:
        raise HTTPException(status_code=404, detail="No employee profile")
    return user.employee


@router.put("/me", response_model=ProfileUpdateResult)
def update_my_profile(
    payload: EmployeeUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    emp = user.employee
    if not emp:
        raise HTTPException(status_code=404, detail="No employee profile")

    data = payload.model_dump(exclude_unset=True)
    instant_applied: list[str] = []
    official_changes: dict = {}

    for field, value in data.items():
        current = getattr(emp, field)
        if value is None or value == current:
            continue
        if field in OFFICIAL_FIELDS:
            official_changes[field] = {"old": current, "new": value}
        else:
            setattr(emp, field, value)
            instant_applied.append(field)

    result = ProfileUpdateResult(instant_applied=instant_applied)

    if official_changes:
        req = EditRequest(
            employee_id=emp.id, changes_json=json.dumps(official_changes)
        )
        db.add(req)
        db.flush()
        result.pending_fields = list(official_changes.keys())
        result.edit_request_id = req.id

    db.commit()
    return result


@router.get("/my-edit-requests")
def my_edit_requests(
    user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    rows = (
        db.query(EditRequest)
        .filter(EditRequest.employee_id == user.employee.id)
        .order_by(EditRequest.applied_at.desc())
        .all()
    )
    return [
        {
            "id": r.id,
            "changes": json.loads(r.changes_json),
            "status": r.status.value,
            "applied_at": r.applied_at,
        }
        for r in rows
    ]


@router.get("/directory", response_model=list[EmployeeBrief])
def directory(
    q: str = "",
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(Employee)
    if q:
        like = f"%{q}%"
        query = query.filter(
            or_(
                Employee.full_name.ilike(like),
                Employee.designation.ilike(like),
                Employee.department.ilike(like),
            )
        )
    return query.order_by(Employee.full_name).limit(200).all()


@router.get("/{employee_id}", response_model=EmployeeOut)
def get_employee(
    employee_id: int,
    user: User = Depends(require_staff),
    db: Session = Depends(get_db),
):
    emp = db.query(Employee).filter(Employee.id == employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return emp
