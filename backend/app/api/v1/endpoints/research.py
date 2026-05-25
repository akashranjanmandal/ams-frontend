"""PG/Research Management (Module 10)."""
from typing import Optional, List
from uuid import UUID
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from pydantic import BaseModel

from app.db.base import get_db
from app.core.dependencies import get_current_user, require_roles
from app.models.user import User, UserRole
from app.models.research import AdvisoryCommittee, CommitteeMember

router = APIRouter(prefix="/research", tags=["Research"])


class CommitteeIn(BaseModel):
    student_id: UUID
    research_title: Optional[str] = None
    research_area: Optional[str] = None

class MemberIn(BaseModel):
    faculty_id: UUID
    role: str = "member"  # major_advisor / co_major_advisor / member


@router.post("/committees", status_code=201)
async def create_committee(
    body: CommitteeIn, db: AsyncSession = Depends(get_db),
    _: User = Depends(require_roles(UserRole.SUPER_ADMIN, UserRole.ACADEMIC_ADMIN, UserRole.HOD)),
):
    existing = await db.execute(select(AdvisoryCommittee).where(AdvisoryCommittee.student_id == body.student_id))
    if existing.scalar_one_or_none():
        raise HTTPException(409, "Committee already exists for this student.")
    c = AdvisoryCommittee(**body.model_dump())
    db.add(c); await db.commit(); await db.refresh(c)
    return {"id": str(c.id), "message": "Committee created."}


@router.get("/committees")
async def list_committees(db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    result = await db.execute(
        select(AdvisoryCommittee).options(
            selectinload(AdvisoryCommittee.student),
            selectinload(AdvisoryCommittee.members).selectinload(CommitteeMember.faculty),
        )
    )
    items = []
    for c in result.scalars().all():
        items.append({
            "id": str(c.id),
            "student_name": c.student.full_name if c.student else None,
            "student_roll": c.student.student_roll if c.student else None,
            "research_title": c.research_title, "research_area": c.research_area,
            "status": c.status, "is_locked": c.is_locked,
            "members": [{
                "id": str(m.id), "faculty_id": str(m.faculty_id),
                "faculty_name": m.faculty.full_name if m.faculty else None,
                "role": m.role, "accepted": m.accepted,
            } for m in c.members],
        })
    return items


@router.get("/committees/student/{student_id}")
async def get_student_committee(student_id: UUID, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    result = await db.execute(
        select(AdvisoryCommittee).options(
            selectinload(AdvisoryCommittee.student),
            selectinload(AdvisoryCommittee.members).selectinload(CommitteeMember.faculty),
        ).where(AdvisoryCommittee.student_id == student_id)
    )
    c = result.scalar_one_or_none()
    if not c: raise HTTPException(404, "No committee found.")
    return {
        "id": str(c.id), "student_name": c.student.full_name if c.student else None,
        "research_title": c.research_title, "research_area": c.research_area,
        "status": c.status, "is_locked": c.is_locked,
        "members": [{"id": str(m.id), "faculty_name": m.faculty.full_name if m.faculty else None,
                     "role": m.role, "accepted": m.accepted} for m in c.members],
    }


@router.post("/committees/{committee_id}/members", status_code=201)
async def add_member(
    committee_id: UUID, body: MemberIn, db: AsyncSession = Depends(get_db),
    _: User = Depends(require_roles(UserRole.SUPER_ADMIN, UserRole.ACADEMIC_ADMIN, UserRole.HOD)),
):
    c = await db.get(AdvisoryCommittee, committee_id)
    if not c: raise HTTPException(404, "Committee not found.")
    if c.is_locked: raise HTTPException(400, "Committee is locked.")
    m = CommitteeMember(committee_id=committee_id, **body.model_dump())
    db.add(m); await db.commit()
    return {"message": "Member added."}


@router.patch("/committees/{committee_id}/members/{member_id}/accept")
async def accept_membership(
    committee_id: UUID, member_id: UUID,
    accepted: bool, db: AsyncSession = Depends(get_db),
    user: User = Depends(require_roles(UserRole.FACULTY, UserRole.RESEARCH_SUPERVISOR)),
):
    m = await db.get(CommitteeMember, member_id)
    if not m or m.committee_id != committee_id or m.faculty_id != user.id:
        raise HTTPException(404, "Membership not found.")
    m.accepted = accepted; m.accepted_at = datetime.now(timezone.utc)
    await db.commit()
    return {"message": "Acceptance recorded."}


@router.patch("/committees/{committee_id}/lock")
async def lock_committee(
    committee_id: UUID, db: AsyncSession = Depends(get_db),
    _: User = Depends(require_roles(UserRole.SUPER_ADMIN, UserRole.ACADEMIC_ADMIN)),
):
    c = await db.get(AdvisoryCommittee, committee_id)
    if not c: raise HTTPException(404, "Committee not found.")
    c.is_locked = True; c.status = "locked"; c.formed_at = datetime.now(timezone.utc)
    await db.commit()
    return {"message": "Committee locked."}
