from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.core.security import create_access_token, hash_password, verify_password
from app.models.models import AccountStatus, Employee, Role, User
from app.schemas.schemas import LoginRequest, SignupRequest, Token

router = APIRouter(prefix="/api/auth", tags=["auth"])


def _make_token(user: User) -> Token:
    token = create_access_token({"sub": str(user.id), "role": user.role.value})
    emp = user.employee
    return Token(
        access_token=token,
        role=user.role.value,
        full_name=emp.full_name if emp else user.email,
        employee_code=user.employee_code,
    )


def _check_account(user: User) -> None:
    if user.account_status == AccountStatus.pending:
        raise HTTPException(
            status_code=403,
            detail="Your account is awaiting administrator approval.",
        )
    if user.account_status == AccountStatus.rejected:
        raise HTTPException(
            status_code=403, detail="Your account request was not approved."
        )
    if user.account_status == AccountStatus.suspended or not user.is_active:
        raise HTTPException(status_code=403, detail="Your account is inactive.")


@router.post("/signup", status_code=201)
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    email = payload.email.lower().strip()
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="An account with this email already exists")

    # generate next employee code
    count = db.query(User).count()
    code = f"AVFU-{2000 + count + 1}"

    user = User(
        employee_code=code,
        email=email,
        hashed_password=hash_password(payload.password),
        role=Role.employee,
        account_status=AccountStatus.pending,
    )
    db.add(user)
    db.flush()
    emp = Employee(
        user_id=user.id,
        full_name=payload.full_name,
        designation=payload.designation or "",
        department=payload.department or "",
        phone=payload.phone or "",
        office="Assam Veterinary & Fisheries University",
        status="Pending",
    )
    db.add(emp)
    db.commit()
    return {
        "message": "Account created. An administrator will review and approve it shortly.",
        "employee_code": code,
    }


@router.post("/login", response_model=Token)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower().strip()).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    _check_account(user)
    return _make_token(user)


@router.post("/token", response_model=Token)
def login_form(
    form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == form.username.lower().strip()).first()
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    _check_account(user)
    return _make_token(user)


@router.get("/me")
def me(user: User = Depends(get_current_user)):
    emp = user.employee
    return {
        "id": user.id,
        "email": user.email,
        "role": user.role.value,
        "employee_code": user.employee_code,
        "full_name": emp.full_name if emp else "",
        "employee_id": emp.id if emp else None,
        "account_status": user.account_status.value,
    }
