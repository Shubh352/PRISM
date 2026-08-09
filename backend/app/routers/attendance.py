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
    current_account=Depends(require_role(AuthRole.ADMIN, AuthRole.HOD)),
):

    records = db.query(Attendance).all()

    response = []

    for attendance in records:

        # ---------- Overall Status ----------

        if (
            attendance.entry_1_time
            and attendance.entry_2_time
            and attendance.punch_out_time
        ):
            status = "Present"

        elif (
            attendance.entry_1_time
            or attendance.entry_2_time
            or attendance.punch_out_time
        ):
            status = "Partial"

        else:
            status = "Absent"

        # ---------- Morning ----------

        if attendance.entry_1_time:
            morning_status = "Present"
        else:
            morning_status = "-"

        # ---------- Afternoon ----------

        if attendance.entry_2_time:
            afternoon_status = "Present"
        else:
            afternoon_status = "-"

        # ---------- Punch Out ----------

        if attendance.punch_out_time:
            punch_out_status = "Done"
        else:
            punch_out_status = "-"

        response.append(
            AttendanceDetailsResponse(
                id=attendance.id,
                name=attendance.user.name,
                roll_number=attendance.user.roll_number,
                department=attendance.user.department.department_name,
                semester=attendance.user.semester,
                attendance_date=attendance.attendance_date,
                entry_1_time=attendance.entry_1_time,
                entry_2_time=attendance.entry_2_time,
                punch_out_time=attendance.punch_out_time,
                morning_status=morning_status,
                afternoon_status=afternoon_status,
                punch_out_status=punch_out_status,
                status=status,
            )
        )

    return response
