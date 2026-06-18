from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.models import Asset, Liability, User
from app.schemas.schemas import (
    AssetCreate,
    AssetOut,
    LiabilityCreate,
    LiabilityOut,
)

router = APIRouter(prefix="/api", tags=["assets"])


@router.get("/assets/mine", response_model=list[AssetOut])
def my_assets(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Asset).filter(Asset.employee_id == user.employee.id).all()


@router.post("/assets", response_model=AssetOut)
def add_asset(p: AssetCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    row = Asset(employee_id=user.employee.id, **p.model_dump())
    db.add(row); db.commit(); db.refresh(row)
    return row


@router.delete("/assets/{item_id}")
def del_asset(item_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    row = db.query(Asset).filter(Asset.id == item_id, Asset.employee_id == user.employee.id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(row); db.commit()
    return {"ok": True}


@router.get("/liabilities/mine", response_model=list[LiabilityOut])
def my_liabilities(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Liability).filter(Liability.employee_id == user.employee.id).all()


@router.post("/liabilities", response_model=LiabilityOut)
def add_liability(p: LiabilityCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    row = Liability(employee_id=user.employee.id, **p.model_dump())
    db.add(row); db.commit(); db.refresh(row)
    return row


@router.delete("/liabilities/{item_id}")
def del_liability(item_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    row = db.query(Liability).filter(Liability.id == item_id, Liability.employee_id == user.employee.id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(row); db.commit()
    return {"ok": True}
