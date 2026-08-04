from sqlalchemy.orm import Session

from app.models.department import Department


def seed_departments(db: Session):

    department = (
        db.query(Department)
        .filter(
            Department.department_code == "FPNS",
        )
        .first()
    )

    if department:
        return

    department = Department(
        department_name="Food Processing and Nutrition Science",
        department_code="FPNS",
    )

    db.add(department)
    db.commit()