from sqlalchemy.orm import Session

from app.models.user import User
from app.models.attendance import Attendance


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