from sqlalchemy.orm import Session

from app.models.department import Department
from app.models.user import User
from app.enums.user_type import UserType


def seed_users(db: Session):

    department = (
        db.query(Department)
        .filter(
            Department.department_code == "FPNS",
        )
        .first()
    )

    if department is None:
        return

    users = [
        {
            "name": "Shubham Swami",
            "roll_number": "FPNS24001",
            "fingerprint_id": 1,
            "semester": 1,
            "user_type": UserType.STUDENT,
        },
        {
            "name": "Test Student",
            "roll_number": "FPNS24002",
            "fingerprint_id": 2,
            "semester": 1,
            "user_type": UserType.STUDENT,
        },
        {
            "name": "Faculty Demo",
            "roll_number": "FAC001",
            "fingerprint_id": 100,
            "semester": 1,
            "user_type": UserType.FACULTY,
        },
    ]

    for user_data in users:

        exists = (
            db.query(User)
            .filter(
                User.fingerprint_id == user_data["fingerprint_id"],
            )
            .first()
        )

        if exists:
            continue

        user = User(
            name=user_data["name"],
            roll_number=user_data["roll_number"],
            fingerprint_id=user_data["fingerprint_id"],
            department_id=department.id,
            semester=user_data["semester"],
            user_type=user_data["user_type"],
            is_active=True,
        )

        db.add(user)

    db.commit()