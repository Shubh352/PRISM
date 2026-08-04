from datetime import date, datetime

from sqlalchemy.orm import Session

from app.models.attendance import Attendance
from app.enums.scan_event import ScanEvent
from app.models.device_log import DeviceLog
from app.enums.sync_status import SyncStatus


class AttendanceRules:

    def process(
    self,
    db: Session,
    user,
    device,
    session,
    action,
    ):

        attendance = (
            db.query(Attendance)
            .filter(
                Attendance.user_id == user.id,
                Attendance.attendance_date == date.today(),
            )
            .first()
        )

        if attendance is None:
            attendance = Attendance(user_id=user.id)
            db.add(attendance)
            db.commit()
            db.refresh(attendance)

        if action == ScanEvent.MORNING_ENTRY and session.session_number != 1:
            return {"success": False, "message": "Morning Attendance Window Closed"}

        if action == ScanEvent.AFTERNOON_ENTRY and session.session_number != 2:
            return {"success": False, "message": "Afternoon Attendance Window Closed"}

        if action == ScanEvent.MORNING_ENTRY:
            return self._morning_entry(db, attendance, device, user)

        if action == ScanEvent.AFTERNOON_ENTRY:
            return self._afternoon_entry(db, attendance, device, user)

        if action == ScanEvent.PUNCH_OUT:
            return self._punch_out(db, attendance, device, user)

        return {"success": False, "message": "Invalid Action"}

    def _morning_entry(
    self,
    db: Session,
    attendance,
    device,
    user,
    ):

        if attendance.entry_1_time is not None:
            return {
                "success": False,
                "message": "Morning Attendance Already Recorded",
            }

        attendance.entry_1_time = datetime.now()

        db.commit()
        db.refresh(attendance)

        self._create_device_log(
            db,
            attendance,
            device,
            user,
            ScanEvent.MORNING_ENTRY,   # change accordingly
        )

        return {
            "success": True,
            "message": "Morning Attendance Recorded",
            "name": user.name,
        }

    def _afternoon_entry(
    self,
    db: Session,
    attendance,
    device,
    user,
    ):

        if attendance.entry_2_time is not None:
            return {
                "success": False,
                "message": "Afternoon Attendance Already Recorded",
            }

        attendance.entry_2_time = datetime.now()

        db.commit()
        db.refresh(attendance)

        self._create_device_log(
            db,
            attendance,
            device,
            user,
            # _afternoon_entry()
            ScanEvent.AFTERNOON_ENTRY
        )

        return {
            "success": True,
            "message": "Afternoon Attendance Recorded",
            "name": user.name,
        }

    def _punch_out(
    self,
    db: Session,
    attendance,
    device,
    user,
    ):

        if attendance.punch_out_time is not None:
            return {
                "success": False,
                "message": "Punch Out Already Recorded",
            }

        attendance.punch_out_time = datetime.now()

        db.commit()
        db.refresh(attendance)

        self._create_device_log(
            db,
            attendance,
            device,
            user,
            # _punch_out()
            ScanEvent.PUNCH_OUT
        )

        return {
            "success": True,
            "message": "Punch Out Recorded",
            "name": user.name,
        }

    def _create_device_log(
        self,
        db: Session,
        attendance,
        device,
        user,
        action,
    ):

        log = DeviceLog(
            attendance_id=attendance.id,
            device_id=device.id,
            fingerprint_id=user.fingerprint_id,
            event=action,
            sync_status=SyncStatus.SYNCED,
        )

        db.add(log)
        db.commit()