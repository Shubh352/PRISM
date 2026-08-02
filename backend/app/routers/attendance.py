from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.schemas.attendance import (
    AttendanceCreate,
    AttendanceResponse,
    AttendanceDetailsResponse
)
from app.services.attendance_service import AttendanceService
from app.models.attendance import Attendance


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

@router.get("/attendance", response_model=list[AttendanceDetailsResponse])
def get_attendance(
    db: Session = Depends(get_db)
):

    records = db.query(Attendance).all()

    response = []

    for attendance in records:

        response.append(
            AttendanceDetailsResponse(
                name=attendance.user.name,
                roll_number=attendance.user.roll_number,
                department=attendance.user.department,
                semester=attendance.user.semester,

                attendance_date=attendance.attendance_date,
                punch_in=attendance.punch_in,
                punch_out=attendance.punch_out
            )
        )

    return response