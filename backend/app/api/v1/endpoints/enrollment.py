"""Student & Teacher Enrollment Management (Modules 5.3, 5.4)."""
from typing import Optional, List
from uuid import UUID
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from pydantic import BaseModel

from app.db.base import get_db
from app.core.dependencies import get_current_user, require_roles
from app.models.user import User, UserRole
from app.models.enrollment import StudentEnrollment
from app.models.course import CourseOffering

router = APIRouter(prefix="/enrollment", tags=["Enrollment"])


class EnrollRequest(BaseModel):
    offering_id: UUID

class BulkApproveRequest(BaseModel):
    enrollment_ids: List[UUID]
    status: str  # approved / rejected
    remarks: Optional[str] = None


def _enroll_dict(e: StudentEnrollment) -> dict:
    return {
        "id": str(e.id),
        "student_id": str(e.student_id),
        "student_name": e.student.full_name if e.student else None,
        "student_roll": e.student.student_roll if e.student else None,
        "offering_id": str(e.offering_id),
        "status": e.status,
        "enrolled_at": e.enrolled_at.isoformat(),
        "processed_at": e.processed_at.isoformat() if e.processed_at else None,
        "remarks": e.remarks,
    }


# ── Student: enroll self ──────────────────────────────────────────────────────

@router.post("", status_code=201)
async def enroll(
    body: EnrollRequest, db: AsyncSession = Depends(get_db),
    user: User = Depends(require_roles(UserRole.STUDENT)),
):
    offering = await db.get(CourseOffering, body.offering_id)
    if not offering or offering.status != "published":
        raise HTTPException(400, "Course offering not available for enrollment.")

    # Check capacity
    count_result = await db.execute(
        select(func.count()).select_from(StudentEnrollment).where(
            StudentEnrollment.offering_id == body.offering_id,
            StudentEnrollment.status == "approved",
        )
    )
    if count_result.scalar() >= offering.max_enrollment:
        raise HTTPException(400, "Offering is full.")

    # Prevent duplicate
    existing = await db.execute(
        select(StudentEnrollment).where(
            StudentEnrollment.student_id == user.id,
            StudentEnrollment.offering_id == body.offering_id,
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(409, "Already enrolled or request pending.")

    e = StudentEnrollment(student_id=user.id, offering_id=body.offering_id)
    db.add(e); await db.commit()
    return {"message": "Enrollment request submitted.", "id": str(e.id)}


@router.get("/my")
async def my_enrollments(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(
        select(StudentEnrollment).options(
            selectinload(StudentEnrollment.offering).selectinload(CourseOffering.course),
        ).where(StudentEnrollment.student_id == user.id).order_by(StudentEnrollment.enrolled_at.desc())
    )
    items = []
    for e in result.scalars().all():
        items.append({
            "id": str(e.id),
            "offering_id": str(e.offering_id),
            "course_number": e.offering.course.course_number if e.offering and e.offering.course else None,
            "course_title": e.offering.course.title if e.offering and e.offering.course else None,
            "credit_structure": e.offering.course.credit_structure if e.offering and e.offering.course else None,
            "section": e.offering.section if e.offering else None,
            "status": e.status,
            "enrolled_at": e.enrolled_at.isoformat(),
            "remarks": e.remarks,
        })
    return items


@router.delete("/{enrollment_id}", status_code=204)
async def withdraw(
    enrollment_id: UUID, db: AsyncSession = Depends(get_db),
    user: User = Depends(require_roles(UserRole.STUDENT)),
):
    e = await db.get(StudentEnrollment, enrollment_id)
    if not e or e.student_id != user.id:
        raise HTTPException(404, "Enrollment not found.")
    if e.status != "pending":
        raise HTTPException(400, "Can only withdraw pending enrollments.")
    e.status = "withdrawn"; await db.commit()


# ── Faculty/Admin: manage enrollments ─────────────────────────────────────────

@router.get("/offering/{offering_id}")
async def offering_enrollments(
    offering_id: UUID, status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_roles(
        UserRole.SUPER_ADMIN, UserRole.ACADEMIC_ADMIN, UserRole.HOD,
        UserRole.FACULTY, UserRole.REGISTRAR,
    )),
):
    q = select(StudentEnrollment).options(selectinload(StudentEnrollment.student)).where(
        StudentEnrollment.offering_id == offering_id
    )
    if status: q = q.where(StudentEnrollment.status == status)
    result = await db.execute(q.order_by(StudentEnrollment.enrolled_at))
    return [_enroll_dict(e) for e in result.scalars().all()]


@router.patch("/{enrollment_id}")
async def process_enrollment(
    enrollment_id: UUID,
    status: str,
    remarks: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(require_roles(
        UserRole.SUPER_ADMIN, UserRole.ACADEMIC_ADMIN, UserRole.HOD, UserRole.FACULTY, UserRole.REGISTRAR,
    )),
):
    e = await db.get(StudentEnrollment, enrollment_id)
    if not e: raise HTTPException(404, "Enrollment not found.")
    if e.status not in ("pending",):
        raise HTTPException(400, "Only pending enrollments can be processed.")
    e.status = status
    e.processed_by = user.id
    e.processed_at = datetime.now(timezone.utc)
    e.remarks = remarks
    await db.commit()
    return {"message": f"Enrollment {status}."}


@router.post("/offering/{offering_id}/bulk-approve")
async def bulk_approve(
    offering_id: UUID, body: BulkApproveRequest, db: AsyncSession = Depends(get_db),
    user: User = Depends(require_roles(
        UserRole.SUPER_ADMIN, UserRole.ACADEMIC_ADMIN, UserRole.HOD, UserRole.FACULTY, UserRole.REGISTRAR,
    )),
):
    updated = 0
    for eid in body.enrollment_ids:
        e = await db.get(StudentEnrollment, eid)
        if e and e.offering_id == offering_id and e.status == "pending":
            e.status = body.status
            e.processed_by = user.id
            e.processed_at = datetime.now(timezone.utc)
            e.remarks = body.remarks
            updated += 1
    await db.commit()
    return {"message": f"{updated} enrollments {body.status}."}
