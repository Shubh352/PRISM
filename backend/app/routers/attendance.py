from fastapi import APIRouter
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.schemas.attendance import AttendanceCreate
from app.services.attendance_service import AttendanceService

router = APIRouter()

attendance_service = AttendanceService()


@router.post("/attendance")
def create_attendance(attendance: AttendanceCreate):

    db: Session = SessionLocal()

    try:
        return attendance_service.process_scan(
            db,
            attendance.fingerprint_id
        )
    finally:
        db.close()