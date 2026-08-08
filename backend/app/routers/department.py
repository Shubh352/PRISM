from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db, require_role
from app.enums.auth_role import AuthRole
from app.models.department import Department
from app.schemas.department import DepartmentResponse

router = APIRouter()


@router.get(
    "/departments",
    response_model=list[DepartmentResponse],
)
def get_departments(
    db: Session = Depends(get_db),
    current_account=Depends(require_role(AuthRole.ADMIN, AuthRole.HOD)),
):
    return db.query(Department).all()
