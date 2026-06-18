"""NOC, Resignation, Vacation, Out-of-Station, DACP — they share an
apply / list-mine / list-pending / decide lifecycle."""
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user, require_staff
from app.models.models import (
    DACPRequest,
    Employee,
    NOCRequest,
    OutOfStationRequest,
    RequestStatus,
    ResignationRequest,
    User,
    VacationRequest,
)
from app.schemas.schemas import (
    DACPCreate,
    DACPOut,
    Decision,
    NOCCreate,
    NOCOut,
    OutOfStationCreate,
    OutOfStationOut,
    ResignationCreate,
    ResignationOut,
    VacationCreate,
    VacationOut,
)

router = APIRouter(prefix="/api", tags=["requests"])


def _decide(db, model, item_id, payload: Decision, user):
    row = db.query(model).filter(model.id == item_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Request not found")
    if row.status != RequestStatus.pending:
        raise HTTPException(status_code=400, detail="Already decided")
    if payload.status not in ("approved", "rejected"):
        raise HTTPException(status_code=400, detail="Invalid decision")
    row.status = RequestStatus(payload.status)
    db.commit()
    db.refresh(row)
    return row


def _attach_name(rows, db):
    emp_map = {e.id: e for e in db.query(Employee).all()}
    out = []
    for r in rows:
        e = emp_map.get(r.employee_id)
        d = r.__dict__.copy()
        d["employee_name"] = e.full_name if e else ""
        out.append(d)
    return out


# ------------------------------------------------------------------ NOC
@router.post("/noc", response_model=NOCOut)
def create_noc(p: NOCCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    row = NOCRequest(employee_id=user.employee.id, **p.model_dump())
    db.add(row); db.commit(); db.refresh(row)
    return row


@router.get("/noc/mine", response_model=list[NOCOut])
def my_noc(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(NOCRequest).filter(NOCRequest.employee_id == user.employee.id).order_by(NOCRequest.applied_at.desc()).all()


@router.get("/noc/pending", response_model=list[NOCOut])
def pending_noc(user: User = Depends(require_staff), db: Session = Depends(get_db)):
    rows = db.query(NOCRequest).filter(NOCRequest.status == RequestStatus.pending).all()
    return _attach_name(rows, db)


@router.post("/noc/{item_id}/decision", response_model=NOCOut)
def decide_noc(item_id: int, payload: Decision, user: User = Depends(require_staff), db: Session = Depends(get_db)):
    return _decide(db, NOCRequest, item_id, payload, user)


# ------------------------------------------------------------ Resignation
@router.post("/resignation", response_model=ResignationOut)
def create_res(p: ResignationCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    row = ResignationRequest(employee_id=user.employee.id, **p.model_dump())
    db.add(row); db.commit(); db.refresh(row)
    return row


@router.get("/resignation/mine", response_model=list[ResignationOut])
def my_res(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(ResignationRequest).filter(ResignationRequest.employee_id == user.employee.id).order_by(ResignationRequest.applied_at.desc()).all()


@router.get("/resignation/pending", response_model=list[ResignationOut])
def pending_res(user: User = Depends(require_staff), db: Session = Depends(get_db)):
    rows = db.query(ResignationRequest).filter(ResignationRequest.status == RequestStatus.pending).all()
    return _attach_name(rows, db)


@router.post("/resignation/{item_id}/decision", response_model=ResignationOut)
def decide_res(item_id: int, payload: Decision, user: User = Depends(require_staff), db: Session = Depends(get_db)):
    return _decide(db, ResignationRequest, item_id, payload, user)


# --------------------------------------------------------------- Vacation
@router.post("/vacation", response_model=VacationOut)
def create_vac(p: VacationCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    total = (p.to_date - p.from_date).days + 1
    row = VacationRequest(employee_id=user.employee.id, total_days=total, **p.model_dump())
    db.add(row); db.commit(); db.refresh(row)
    return row


@router.get("/vacation/mine", response_model=list[VacationOut])
def my_vac(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(VacationRequest).filter(VacationRequest.employee_id == user.employee.id).order_by(VacationRequest.applied_at.desc()).all()


@router.get("/vacation/pending", response_model=list[VacationOut])
def pending_vac(user: User = Depends(require_staff), db: Session = Depends(get_db)):
    rows = db.query(VacationRequest).filter(VacationRequest.status == RequestStatus.pending).all()
    return _attach_name(rows, db)


@router.post("/vacation/{item_id}/decision", response_model=VacationOut)
def decide_vac(item_id: int, payload: Decision, user: User = Depends(require_staff), db: Session = Depends(get_db)):
    return _decide(db, VacationRequest, item_id, payload, user)


# --------------------------------------------------------- Out of Station
@router.post("/out-of-station", response_model=OutOfStationOut)
def create_oos(p: OutOfStationCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    row = OutOfStationRequest(employee_id=user.employee.id, **p.model_dump())
    db.add(row); db.commit(); db.refresh(row)
    return row


@router.get("/out-of-station/mine", response_model=list[OutOfStationOut])
def my_oos(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(OutOfStationRequest).filter(OutOfStationRequest.employee_id == user.employee.id).order_by(OutOfStationRequest.applied_at.desc()).all()


@router.get("/out-of-station/pending", response_model=list[OutOfStationOut])
def pending_oos(user: User = Depends(require_staff), db: Session = Depends(get_db)):
    rows = db.query(OutOfStationRequest).filter(OutOfStationRequest.status == RequestStatus.pending).all()
    return _attach_name(rows, db)


@router.post("/out-of-station/{item_id}/decision", response_model=OutOfStationOut)
def decide_oos(item_id: int, payload: Decision, user: User = Depends(require_staff), db: Session = Depends(get_db)):
    return _decide(db, OutOfStationRequest, item_id, payload, user)


# ------------------------------------------------------------------- DACP
@router.post("/dacp", response_model=DACPOut)
def create_dacp(p: DACPCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    row = DACPRequest(employee_id=user.employee.id, **p.model_dump())
    db.add(row); db.commit(); db.refresh(row)
    return row


@router.get("/dacp/mine", response_model=list[DACPOut])
def my_dacp(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(DACPRequest).filter(DACPRequest.employee_id == user.employee.id).order_by(DACPRequest.applied_at.desc()).all()


@router.get("/dacp/pending", response_model=list[DACPOut])
def pending_dacp(user: User = Depends(require_staff), db: Session = Depends(get_db)):
    rows = db.query(DACPRequest).filter(DACPRequest.status == RequestStatus.pending).all()
    return _attach_name(rows, db)


@router.post("/dacp/{item_id}/decision", response_model=DACPOut)
def decide_dacp(item_id: int, payload: Decision, user: User = Depends(require_staff), db: Session = Depends(get_db)):
    return _decide(db, DACPRequest, item_id, payload, user)
