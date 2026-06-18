from datetime import date, datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.models import Attendance, User
from app.schemas.schemas import AttendanceOut

router = APIRouter(prefix="/api/attendance", tags=["attendance"])


@router.get("/today", response_model=AttendanceOut | None)
def today(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    emp = user.employee
    return (
        db.query(Attendance)
        .filter(Attendance.employee_id == emp.id, Attendance.work_date == date.today())
        .first()
    )


@router.post("/check-in", response_model=AttendanceOut)
def check_in(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    emp = user.employee
    rec = (
        db.query(Attendance)
        .filter(Attendance.employee_id == emp.id, Attendance.work_date == date.today())
        .first()
    )
    if rec and rec.check_in:
        raise HTTPException(status_code=400, detail="Already checked in today")
    if not rec:
        rec = Attendance(employee_id=emp.id, work_date=date.today())
        db.add(rec)
    rec.check_in = datetime.now(timezone.utc)
    rec.status = "Present"
    db.commit()
    db.refresh(rec)
    return rec


@router.post("/check-out", response_model=AttendanceOut)
def check_out(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    emp = user.employee
    rec = (
        db.query(Attendance)
        .filter(Attendance.employee_id == emp.id, Attendance.work_date == date.today())
        .first()
    )
    if not rec or not rec.check_in:
        raise HTTPException(status_code=400, detail="Check in first")
    if rec.check_out:
        raise HTTPException(status_code=400, detail="Already checked out today")
    rec.check_out = datetime.now(timezone.utc)
    db.commit()
    db.refresh(rec)
    return rec


@router.get("/history", response_model=list[AttendanceOut])
def history(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    emp = user.employee
    return (
        db.query(Attendance)
        .filter(Attendance.employee_id == emp.id)
        .order_by(Attendance.work_date.desc())
        .limit(60)
        .all()
    )
