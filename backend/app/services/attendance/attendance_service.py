from sqlalchemy.orm import Session

from app.models.attendance import Attendance

from app.services.attendance.validator import AttendanceValidator
from app.services.attendance.rules import AttendanceRules


class AttendanceService:

    def __init__(self):
        self.validator = AttendanceValidator()
        self.rules = AttendanceRules()

    def process_scan(
        self,
        db: Session,
        attendance_request,
    ):

        # ---------------------------------------------------------
        # 1. Validate Device
        # ---------------------------------------------------------

        device = self.validator.validate_device(
            db,
            attendance_request.device_code,
        )

        if device is None:
            return {
                "success": False,
                "message": "Invalid Device",
            }

        # ---------------------------------------------------------
        # 2. Validate Fingerprint
        # ---------------------------------------------------------

        user = self.validator.validate_user(
            db,
            attendance_request.fingerprint_id,
        )

        if user is None:
            return {
                "success": False,
                "message": "Fingerprint Not Registered",
            }

        # ---------------------------------------------------------
        # 3. Check whether this exact scan was already processed
        # ---------------------------------------------------------

        existing_record = (
            db.query(Attendance)
            .filter(
                Attendance.record_id == attendance_request.record_id,
            )
            .first()
        )

        if existing_record is not None:
            return {
                "success": True,
                "message": "Attendance Already Processed",
                "name": user.name,
            }

        # ---------------------------------------------------------
        # 4. Check today's attendance
        # ---------------------------------------------------------

        attendance = (
            db.query(Attendance)
            .filter(
                Attendance.user_id == user.id,
                Attendance.attendance_date == attendance_request.scan_timestamp.date(),
            )
            .first()
        )

        # ---------------------------------------------------------
        # 5. Record simple punch-in attendance
        # ---------------------------------------------------------

        return self.rules.process(
            db=db,
            attendance=attendance,
            user=user,
            device=device,
            scan_timestamp=attendance_request.scan_timestamp,
            record_id=attendance_request.record_id,
        )
