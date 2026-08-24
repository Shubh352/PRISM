from datetime import date, datetime, timedelta

from sqlalchemy.orm import Session

from app.models.attendance import Attendance
from app.models.user import User
from app.models.device import Device


class DashboardService:

    def get_summary(
        self,
        db: Session,
    ):

        today = date.today()

        total_students = (
            db.query(User)
            .filter(
                User.user_type == "Student",
            )
            .count()
        )

        present_today = (
            db.query(Attendance)
            .join(
                User,
                Attendance.user_id == User.id,
            )
            .filter(
                Attendance.attendance_date == today,
                User.user_type == "Student",
                Attendance.punch_in_time.isnot(None),
            )
            .count()
        )

        absent_today = max(
            total_students - present_today,
            0,
        )

        online_cutoff = datetime.utcnow() - timedelta(seconds=60)

        devices_online = (
            db.query(Device)
            .filter(
                Device.is_active == True,
                Device.last_seen.isnot(None),
                Device.last_seen >= online_cutoff,
            )
            .count()
        )

        return {
            "total_students": total_students,
            "present_today": present_today,
            "absent_today": absent_today,
            "devices_online": devices_online,
        }

    def get_recent_attendance(
        self,
        db: Session,
    ):
        today = date.today()

        attendances = (
            db.query(
                Attendance,
                User,
            )
            .join(
                User,
                Attendance.user_id == User.id,
            )
            .filter(
                Attendance.attendance_date == today,
                Attendance.punch_in_time.isnot(None),
                User.user_type == "Student",
            )
            .order_by(
                Attendance.punch_in_time.desc(),
            )
            .limit(10)
            .all()
        )

        result = []

        for attendance, user in attendances:

            result.append(
                {
                    "name": user.name,
                    "roll_number": user.roll_number,
                    "department": user.department.department_name,
                    "semester": user.semester,
                    "status": "Present",
                    "punch_in_time": attendance.punch_in_time,
                }
            )

        return result
