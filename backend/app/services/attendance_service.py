from sqlalchemy.orm import Session
from app.models.user import User
from app.models.attendance import Attendance
from datetime import date
from datetime import datetime, time
from app.enums.scan_event import ScanEvent

class AttendanceService:

  def process_scan(
    self,
    db: Session,
    attendance_request,
):
    user = self._find_user(
        db,
        attendance_request.fingerprint_id,
    )

    if user is None:
        return {
            "success": False,
            "message": "Fingerprint Not Registered",
        }

    attendance = self._get_today_record(
        db,
        user.id,
    )

    if attendance is None:
        attendance = self._create_attendance(
            db,
            user.id,
        )

    if attendance_request.action == ScanEvent.MORNING_ENTRY:
        return self._process_morning_entry(
            db,
            attendance,
            user,
        )

    elif attendance_request.action == ScanEvent.AFTERNOON_ENTRY:
        pass

    elif attendance_request.action == ScanEvent.PUNCH_OUT:
        pass

    def _find_user(
        self,
        db: Session,
        fingerprint_id: int,
    ):
        return db.query(User).filter(User.fingerprint_id == fingerprint_id).first()

    def _get_today_record(
        self,
        db: Session,
        user_id: int,
    ):
        return (
            db.query(Attendance)
            .filter(
                Attendance.user_id == user_id,
                Attendance.attendance_date == date.today(),
            )
            .first()
        )

    def _create_attendance(
        self,
        db: Session,
        user_id: int,
    ):
        attendance = Attendance(
            user_id=user_id,
        )

        db.add(attendance)
        db.commit()
        db.refresh(attendance)

        return attendance

    def _record_entry_1(
        self,
        db: Session,
        attendance: Attendance,
    ):
        if attendance.entry_1_time is not None:
            return False

        attendance.entry_1_time = datetime.now()

        db.commit()
        db.refresh(attendance)

        return True

    def _record_entry_2(
        self,
        db: Session,
        attendance: Attendance,
    ):
        if attendance.entry_2_time is not None:
            return False

        attendance.entry_2_time = datetime.now()

        db.commit()
        db.refresh(attendance)

        return True

    def _record_punch_out(
        self,
        db: Session,
        attendance: Attendance,
    ):
        if attendance.punch_out_time is not None:
            return False

        attendance.punch_out_time = datetime.now()

        db.commit()
        db.refresh(attendance)

        return True

    def _log_device_event(self):
        pass

    def _is_morning_window(self):

        current_time = datetime.now().time()

        morning_start = time(8, 0)
        morning_end = time(12, 40)

        return morning_start <= current_time <= morning_end

    def _process_morning_entry(
        self,
        db: Session,
        attendance: Attendance,
        user: User,
    ):
        if attendance.entry_1_time is not None:
            return {
                "success": False,
                "message": "Morning attendance already recorded.",
            }
        if not self._is_morning_window():
            return {
                "success": False,
                "message": "Morning attendance window is closed.",
            }
        recorded = self._record_entry_1(
            db,
            attendance,
        )

        if not recorded:
            return {
                "success": False,
                "message": "Morning attendance already recorded.",
            }

        return {
            "success": True,
            "message": "Morning attendance recorded successfully.",
            "name": user.name,
        }

    def _process_afternoon_entry(self):
        pass


    def _process_punch_out(self):
        pass
