from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db, require_role
from app.enums.auth_role import AuthRole

from app.schemas.attendance import (
    AttendanceCreate,
    AttendanceResponse,
    AttendanceDetailsResponse,
)

from app.services.attendance.attendance_service import AttendanceService
from app.models.attendance import Attendance

router = APIRouter()

attendance_service = AttendanceService()


@router.post("/attendance")
def create_attendance(
    attendance: AttendanceCreate,
    db: Session = Depends(get_db),
):
    return attendance_service.process_scan(
        db,
        attendance,
    )


@router.get(
    "/attendance",
    response_model=list[AttendanceDetailsResponse],
)
def get_attendance(
    db: Session = Depends(get_db),
    current_account=Depends(
        require_role(
            AuthRole.ADMIN,
            AuthRole.HOD,
        )
    ),
):

    records = (
        db.query(Attendance)
        .order_by(
            Attendance.attendance_date.desc(),
            Attendance.punch_in_time.desc(),
        )
        .all()
    )

    response = []

    for attendance in records:

        status = "Present" if attendance.punch_in_time else "Absent"

        response.append(
            AttendanceDetailsResponse(
                id=attendance.id,
                name=attendance.user.name,
                roll_number=attendance.user.roll_number,
                department=attendance.user.department.department_name,
                semester=attendance.user.semester,
                attendance_date=attendance.attendance_date,
                punch_in_time=attendance.punch_in_time,
                status=status,
            )
        )

    return response
