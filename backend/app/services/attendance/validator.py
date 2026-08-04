from sqlalchemy.orm import Session

from app.models.user import User
from app.models.device import Device


class AttendanceValidator:

    def validate_device(
        self,
        db: Session,
        device_code: str,
    ):

        return (
            db.query(Device)
            .filter(
                Device.device_code == device_code,
                Device.is_active == True,
            )
            .first()
        )

    def validate_user(
        self,
        db: Session,
        fingerprint_id: int,
    ):

        return (
            db.query(User)
            .filter(
                User.fingerprint_id == fingerprint_id,
                User.is_active == True,
            )
            .first()
        )