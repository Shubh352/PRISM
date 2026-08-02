from sqlalchemy.orm import Session

from app.models.user import User
from app.models.attendance import Attendance
from datetime import date, datetime, timedelta


class AttendanceService:

    def process_scan(self, db: Session, fingerprint_id: int):

        user = db.query(User).filter(
            User.fingerprint_id == fingerprint_id
        ).first()

        if user is None:
            return {
                "success": False,
                "message": "Fingerprint Not Registered"
            }

        today_record = db.query(Attendance).filter(
            Attendance.user_id == user.id,
            Attendance.attendance_date == date.today()
        ).first()
        print("Today's record:", today_record)

        if today_record is not None:

            if today_record.punch_out is not None:
                return {
                    "success": False,
                    "message": "Attendance Completed"
                }

            if datetime.utcnow() < today_record.punch_in + timedelta(minutes=10):
                return {
                    "success": False,
                    "message": "Punch Out Not Allowed Yet"
                }

            today_record.punch_out = datetime.utcnow()

            db.commit()

            return {
                "success": True,
                "message": "Punch OUT Recorded",
                "name": user.name
            }
            

        record = Attendance(
            user_id=user.id
        )

        db.add(record)
        db.commit()
        db.refresh(record)

        return {
            "success": True,
            "message": "Punch IN Recorded",
            "name": user.name
        }