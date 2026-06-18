from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.models import SalarySlip, User
from app.schemas.schemas import SalaryOut

router = APIRouter(prefix="/api/salary", tags=["salary"])


@router.get("/mine", response_model=list[SalaryOut])
def my_slips(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    emp = user.employee
    return (
        db.query(SalarySlip)
        .filter(SalarySlip.employee_id == emp.id)
        .order_by(SalarySlip.year.desc(), SalarySlip.month.desc())
        .all()
    )
