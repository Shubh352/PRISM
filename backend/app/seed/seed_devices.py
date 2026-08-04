from sqlalchemy.orm import Session

from app.models.department import Department
from app.models.device import Device


def seed_devices(db: Session):

    department = (
        db.query(Department)
        .filter(
            Department.department_code == "FPNS",
        )
        .first()
    )

    if department is None:
        return

    device = (
        db.query(Device)
        .filter(
            Device.device_code == "ESP32-FPNS-001",
        )
        .first()
    )

    if device:
        return

    device = Device(
        device_name="Main Classroom Device",
        device_code="ESP32-FPNS-001",
        department_id=department.id,
        location="FPNS Classroom",
        firmware_version="1.0.0",
        is_active=True,
    )

    db.add(device)
    db.commit()