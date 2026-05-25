"""Academic Calendar & Semester management (Module 4)."""
from typing import Optional, List
from uuid import UUID
from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from pydantic import BaseModel

from app.db.base import get_db
from app.core.dependencies import get_current_user, require_roles
from app.models.user import User, UserRole
from app.models.academic import AcademicCalendar, Semester

router = APIRouter(prefix="/academic", tags=["Academic Calendar"])


class CalendarIn(BaseModel):
    name: str
    academic_year: str
    start_date: date
    end_date: date
    description: Optional[str] = None

class CalendarOut(BaseModel):
    id: UUID; name: str; academic_year: str
    start_date: date; end_date: date
    status: str; description: Optional[str]
    model_config = {"from_attributes": True}

class SemesterIn(BaseModel):
    calendar_id: UUID
    name: str
    sem_type: str = "odd"
    start_date: date; end_date: date
    registration_start: Optional[date] = None
    registration_end: Optional[date] = None
    exam_start: Optional[date] = None
    exam_end: Optional[date] = None
    result_declaration: Optional[date] = None
    holidays: Optional[list] = None

class SemesterOut(BaseModel):
    id: UUID; calendar_id: UUID; name: str; sem_type: str
    start_date: date; end_date: date; status: str
    registration_start: Optional[date]; registration_end: Optional[date]
    exam_start: Optional[date]; exam_end: Optional[date]
    result_declaration: Optional[date]
    holidays: Optional[list]
    model_config = {"from_attributes": True}


# ── Calendars ─────────────────────────────────────────────────────────────────

@router.get("/calendars", response_model=List[CalendarOut])
async def list_calendars(db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    result = await db.execute(select(AcademicCalendar).order_by(AcademicCalendar.start_date.desc()))
    return result.scalars().all()


@router.post("/calendars", response_model=CalendarOut, status_code=201)
async def create_calendar(
    body: CalendarIn, db: AsyncSession = Depends(get_db),
    user: User = Depends(require_roles(UserRole.SUPER_ADMIN, UserRole.ACADEMIC_ADMIN)),
):
    cal = AcademicCalendar(**body.model_dump(), created_by=user.id)
    db.add(cal); await db.commit(); await db.refresh(cal)
    return cal


@router.get("/calendars/{cal_id}", response_model=CalendarOut)
async def get_calendar(cal_id: UUID, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    cal = await db.get(AcademicCalendar, cal_id)
    if not cal: raise HTTPException(404, "Calendar not found.")
    return cal


@router.patch("/calendars/{cal_id}/status")
async def update_calendar_status(
    cal_id: UUID, status: str, db: AsyncSession = Depends(get_db),
    _: User = Depends(require_roles(UserRole.SUPER_ADMIN, UserRole.ACADEMIC_ADMIN)),
):
    cal = await db.get(AcademicCalendar, cal_id)
    if not cal: raise HTTPException(404, "Calendar not found.")
    cal.status = status; await db.commit()
    return {"message": f"Status updated to {status}."}


@router.put("/calendars/{cal_id}")
async def update_calendar(
    cal_id: UUID, body: CalendarIn, db: AsyncSession = Depends(get_db),
    _: User = Depends(require_roles(UserRole.SUPER_ADMIN, UserRole.ACADEMIC_ADMIN)),
):
    cal = await db.get(AcademicCalendar, cal_id)
    if not cal: raise HTTPException(404, "Calendar not found.")
    for k, v in body.model_dump(exclude_none=True).items():
        setattr(cal, k, v)
    await db.commit(); return {"message": "Updated."}


# ── Semesters ─────────────────────────────────────────────────────────────────

@router.get("/calendars/{cal_id}/semesters", response_model=List[SemesterOut])
async def list_semesters(cal_id: UUID, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    result = await db.execute(select(Semester).where(Semester.calendar_id == cal_id).order_by(Semester.start_date))
    return result.scalars().all()


@router.post("/semesters", response_model=SemesterOut, status_code=201)
async def create_semester(
    body: SemesterIn, db: AsyncSession = Depends(get_db),
    _: User = Depends(require_roles(UserRole.SUPER_ADMIN, UserRole.ACADEMIC_ADMIN)),
):
    sem = Semester(**body.model_dump())
    db.add(sem); await db.commit(); await db.refresh(sem)
    return sem


@router.get("/semesters/{sem_id}", response_model=SemesterOut)
async def get_semester(sem_id: UUID, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    sem = await db.get(Semester, sem_id)
    if not sem: raise HTTPException(404, "Semester not found.")
    return sem


@router.put("/semesters/{sem_id}")
async def update_semester(
    sem_id: UUID, body: SemesterIn, db: AsyncSession = Depends(get_db),
    _: User = Depends(require_roles(UserRole.SUPER_ADMIN, UserRole.ACADEMIC_ADMIN)),
):
    sem = await db.get(Semester, sem_id)
    if not sem: raise HTTPException(404, "Semester not found.")
    for k, v in body.model_dump(exclude_none=True).items():
        setattr(sem, k, v)
    await db.commit(); return {"message": "Updated."}


@router.patch("/semesters/{sem_id}/status")
async def update_semester_status(
    sem_id: UUID, status: str, db: AsyncSession = Depends(get_db),
    _: User = Depends(require_roles(UserRole.SUPER_ADMIN, UserRole.ACADEMIC_ADMIN)),
):
    sem = await db.get(Semester, sem_id)
    if not sem: raise HTTPException(404, "Semester not found.")
    sem.status = status; await db.commit()
    return {"message": f"Semester status updated to {status}."}


@router.get("/semesters")
async def all_semesters(db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    result = await db.execute(select(Semester).order_by(Semester.start_date.desc()))
    return result.scalars().all()
