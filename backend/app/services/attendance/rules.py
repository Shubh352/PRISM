from sqlalchemy.orm import Session

from app.enums.scan_event import ScanEvent
from app.enums.sync_status import SyncStatus
from app.models.attendance import Attendance
from app.models.device_log import DeviceLog


class AttendanceRules:

    def process(
        self,
        db: Session,
        attendance,
        user,
        device,
        scan_timestamp,
        record_id,
    ):

        # Attendance already exists for today.
        if attendance is not None:
            return {
                "success": False,
                "message": "Attendance Already Recorded",
                "name": user.name,
            }

        # Create today's attendance record.
        attendance = Attendance(
            record_id=record_id,
            user_id=user.id,
            attendance_date=scan_timestamp.date(),
            punch_in_time=scan_timestamp,
        )

        db.add(attendance)
        db.flush()

        # Keep an internal device log for auditing.
        log = DeviceLog(
            attendance_id=attendance.id,
            device_id=device.id,
            fingerprint_id=user.fingerprint_id,
            event=ScanEvent.MORNING_ENTRY,
            scan_time=scan_timestamp,
            sync_status=SyncStatus.SYNCED,
        )

        db.add(log)

        db.commit()
        db.refresh(attendance)

        return {
            "success": True,
            "message": "Attendance Recorded",
            "name": user.name,
        }
