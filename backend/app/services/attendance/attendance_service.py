from sqlalchemy.orm import Session

from app.enums.scan_event import ScanEvent

from app.services.attendance.validator import AttendanceValidator
from app.services.attendance.scheduler import AttendanceScheduler
from app.services.attendance.rules import AttendanceRules


class AttendanceService:

    def __init__(self):
        self.validator = AttendanceValidator()
        self.scheduler = AttendanceScheduler()
        self.rules = AttendanceRules()

    def process_scan(
        self,
        db: Session,
        fingerprint_id: int,
        device_code: str,
        action: ScanEvent,
    ):

        # Step 1 - Validate Device
        device = self.validator.validate_device(
            db,
            device_code,
        )

        if device is None:
            return {
                "success": False,
                "message": "Invalid Device",
            }

        # Step 2 - Validate User
        user = self.validator.validate_user(
            db,
            fingerprint_id,
        )

        if user is None:
            return {
                "success": False,
                "message": "Fingerprint Not Registered",
            }

        # Step 3 - Active Academic Session
        academic_session = self.scheduler.get_active_academic_session(db)

        if academic_session is None:
            return {
                "success": False,
                "message": "No Active Academic Session",
            }

        # Step 4 - Today's Schedule
        schedule = self.scheduler.get_today_schedule(
            db,
            user.department_id,
            user.semester,
            academic_session.id,
        )

        if schedule is None:
            return {
                "success": False,
                "message": "No Schedule Found For Today",
            }

        # Step 5 - Current Session
        current_session = self.scheduler.get_current_schedule_session(
            db,
            schedule.id,
        )

        if current_session is None:
            return {
                "success": False,
                "message": "Attendance Window Closed",
            }

        # Step 6 - Attendance Rules (next step)
        return self.rules.process(
            db=db,
            user=user,
            device=device,
            session=current_session,
            action=action,
        )