from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.models.academic_session import AcademicSession
from app.models.schedule import Schedule
from app.models.schedule_session import ScheduleSession
from app.enums.day_of_week import DayOfWeek


class AttendanceScheduler:

    def get_active_academic_session(
        self,
        db: Session,
    ):

        return (
            db.query(AcademicSession)
            .filter(
                AcademicSession.is_active == True,
            )
            .first()
        )

    def get_today_schedule(
        self,
        db: Session,
        department_id: int,
        semester: int,
        academic_session_id: int,
        scan_timestamp,
    ):

        today = DayOfWeek[scan_timestamp.strftime("%A").upper()]

        return (
            db.query(Schedule)
            .filter(
                Schedule.department_id == department_id,
                Schedule.semester == semester,
                Schedule.academic_session_id == academic_session_id,
                Schedule.day_of_week == today,
            )
            .first()
        )

    def get_current_schedule_session(
        self,
        db: Session,
        schedule_id: int,
        scan_timestamp,
    ):

        current_time = scan_timestamp.time()

        print("\n========== SCHEDULER ==========")
        print("Scan Timestamp :", scan_timestamp)
        print("Current Time   :", current_time)
        print("===============================\n")

        sessions = (
            db.query(ScheduleSession)
            .filter(
                ScheduleSession.schedule_id == schedule_id,
            )
            .order_by(
                ScheduleSession.start_time,
            )
            .all()
        )

        for session in sessions:

            start_datetime = datetime.combine(
                datetime.today(),
                session.start_time,
            )

            end_datetime = start_datetime + timedelta(
                minutes=session.attendance_window_minutes,
            )

            print(
                f"Session {session.session_number} | "
                f"Start: {session.start_time} | "
                f"End: {end_datetime.time()} | "
                f"Window: {session.attendance_window_minutes} mins"
            )

            if session.start_time <= current_time <= end_datetime.time():
                print("✅ MATCHED SESSION:", session.session_number)
                return session

        print("❌ NO SESSION MATCHED")
        return None