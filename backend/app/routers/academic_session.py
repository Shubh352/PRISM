from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db, require_role
from app.enums.auth_role import AuthRole
from app.models.academic_session import AcademicSession

router = APIRouter()


@router.get("/academic-sessions")
def get_academic_sessions(
    db: Session = Depends(get_db),
    current_account=Depends(
        require_role(
            AuthRole.ADMIN,
            AuthRole.HOD,
        )
    ),
):
    return (
        db.query(AcademicSession)
        .order_by(
            AcademicSession.start_date.desc()
        )
        .all()
    )