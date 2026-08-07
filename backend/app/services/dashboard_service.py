from datetime import date

from sqlalchemy.orm import Session

from app.models.attendance import Attendance
from app.models.user import User
from app.models.device_log import DeviceLog
from app.models.attendance import Attendance


class DashboardService:

    def get_summary(
        self,
        db: Session,
    ):

        total_students = (
            db.query(User)
            .filter(
                User.user_type == "Student",
            )
            .count()
        )

        present_today = (
            db.query(Attendance)
            .filter(
                Attendance.attendance_date == date.today(),
            )
            .count()
        )

        absent_today = max(
            total_students - present_today,
            0,
        )

        return {
            "total_students": total_students,
            "present_today": present_today,
            "absent_today": absent_today,
            "devices_online": 0,
        }

    def get_recent_attendance(
        self,
        db: Session,
    ):

        logs = (
            db.query(
                DeviceLog,
                User,
                Attendance,
            )
            .join(
                Attendance,
                DeviceLog.attendance_id == Attendance.id,
            )
            .join(
                User,
                Attendance.user_id == User.id,
            )
            .order_by(
                DeviceLog.id.desc(),
            )
            .limit(10)
            .all()
        )

        result = []

        for log, user, attendance in logs:

            if log.event.name == "MORNING_ENTRY":
                scan_time = attendance.entry_1_time

            elif log.event.name == "AFTERNOON_ENTRY":
                scan_time = attendance.entry_2_time

            else:
                scan_time = attendance.punch_out_time

            result.append(
                {
                    "name": user.name,
                    "roll_number": user.roll_number,
                    "department": user.department,
                    "semester": user.semester,
                    "event": log.event.value,
                    "time": (scan_time.strftime("%I:%M %p") if scan_time else None),
                }
            )

        return result
