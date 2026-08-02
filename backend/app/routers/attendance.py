from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.schemas.attendance import AttendanceCreate
from app.services.attendance_service import AttendanceService
from app.models.attendance import Attendance
from app.schemas.attendance import AttendanceResponse

router = APIRouter()

attendance_service = AttendanceService()


@router.post("/attendance")
def create_attendance(
    attendance: AttendanceCreate,
    db: Session = Depends(get_db)
):

    return attendance_service.process_scan(
    db,
    attendance.fingerprint_id
)

@router.get("/attendance", response_model=list[AttendanceResponse])
def get_attendance(
    db: Session = Depends(get_db)
):

    records = db.query(Attendance).all()

    return records