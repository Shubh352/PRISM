from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db, require_role
from app.enums.auth_role import AuthRole
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate


router = APIRouter()


@router.post("/users")
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db),
    current_account=Depends(
        require_role(AuthRole.ADMIN)
    ),
):
    db_user = User(
    name=user.name,
    roll_number=user.roll_number,
    fingerprint_id=user.fingerprint_id,
    department_id=user.department_id,
    semester=user.semester,
    user_type=user.user_type,
)

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


@router.get("/users")
def get_users(
    db: Session = Depends(get_db),
    current_account=Depends(
        require_role(AuthRole.ADMIN, AuthRole.HOD)
    ),
):
    users = db.query(User).all()

    return users


@router.get("/users/{user_id}")
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_account=Depends(
        require_role(AuthRole.ADMIN, AuthRole.HOD)
    ),
):
    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        return {"message": "User not found"}

    return user


@router.put("/users/{user_id}")
def update_user(
    user_id: int,
    updated_user: UserUpdate,
    db: Session = Depends(get_db),
    current_account=Depends(
        require_role(AuthRole.ADMIN)
    ),
):
    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        return {"message": "User not found"}

    user.name = updated_user.name
    user.roll_number = updated_user.roll_number
    user.fingerprint_id = updated_user.fingerprint_id
    user.department_id = updated_user.department_id
    user.semester = updated_user.semester
    user.user_type = updated_user.user_type

    db.commit()
    db.refresh(user)

    return user


@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_account=Depends(
        require_role(AuthRole.ADMIN)
    ),
):
    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        return {"message": "User not found"}

    db.delete(user)
    db.commit()

    return {"message": "User deleted successfully"}