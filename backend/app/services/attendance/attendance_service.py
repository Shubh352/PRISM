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
        attendance_request,
    ):

        # Step 1 - Validate Device
        device = self.validator.validate_device(
            db,
            attendance_request.device_code,
        )

        if device is None:
            return {
                "success": False,
                "message": "Invalid Device",
            }

        # Step 2 - Validate User
        user = self.validator.validate_user(
            db,
            attendance_request.fingerprint_id,
        )

        if user is None:
            return {
                "success": False,
                "message": "Fingerprint Not Registered",
            }

        # Step 3 - Active Academic Session

        if attendance_request.action == ScanEvent.PUNCH_OUT:

            return self.rules.process(
                db=db,
                user=user,
                device=device,
                session=None,
                action=ScanEvent.PUNCH_OUT,
                scan_timestamp=attendance_request.scan_timestamp,
            )

        academic_session = self.scheduler.get_active_academic_session(db)

        if academic_session is None:
            return {
                "success": False,
                "message": "No Active Academic Session",
            }

        # Step 4 - Today's Schedule
        # Step 4 - Punch Out

        # Punch Out does not require a schedule or attendance window.

        # Step 5 - Today's Schedule
        schedule = self.scheduler.get_today_schedule(
            db,
            user.department_id,
            user.semester,
            academic_session.id,
            attendance_request.scan_timestamp,
        )

        if schedule is None:
            return {
                "success": False,
                "message": "No Schedule Found For Today",
            }

        # Step 6 - Current Session
        current_session = self.scheduler.get_current_schedule_session(
            db,
            schedule.id,
            attendance_request.scan_timestamp,
        )

        if current_session is None:
            return {
                "success": False,
                "message": "Attendance Window Closed",
            }

        # Step 7 - Determine actual attendance event

        action = attendance_request.action

        if action == ScanEvent.MORNING_ENTRY and current_session.session_number == 2:
            action = ScanEvent.AFTERNOON_ENTRY

        # Step 8 - Attendance Rules

        return self.rules.process(
            db=db,
            user=user,
            device=device,
            session=current_session,
            action=action,
            scan_timestamp=attendance_request.scan_timestamp,
        )
