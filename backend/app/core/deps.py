from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import decode_token
from app.models.models import AccountStatus, Role, User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> User:
    cred_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_token(token)
    if payload is None:
        raise cred_exc
    user_id = payload.get("sub")
    if user_id is None:
        raise cred_exc
    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None or not user.is_active:
        raise cred_exc
    if user.account_status != AccountStatus.active:
        raise HTTPException(status_code=403, detail="Account is not active")
    return user


def require_roles(*roles: Role):
    def checker(user: User = Depends(get_current_user)) -> User:
        if user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission for this action",
            )
        return user

    return checker


def require_staff(user: User = Depends(get_current_user)) -> User:
    """HR or Admin."""
    if user.role not in (Role.hr, Role.admin):
        raise HTTPException(status_code=403, detail="Staff access required")
    return user
