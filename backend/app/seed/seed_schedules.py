from app.enums.day_of_week import DayOfWeek
from app.models.academic_session import AcademicSession
from app.models.department import Department
from app.models.schedule import Schedule


def seed_schedules(db):

    department = db.query(Department).filter(
        Department.department_code == "FPNS"
    ).first()

    session = db.query(AcademicSession).filter(
        AcademicSession.is_active == True
    ).first()

    if department is None or session is None:
        return

    for day in [
        DayOfWeek.MONDAY,
        DayOfWeek.TUESDAY,
        DayOfWeek.WEDNESDAY,
        DayOfWeek.THURSDAY,
        DayOfWeek.FRIDAY,
    ]:

        exists = db.query(Schedule).filter(
            Schedule.department_id == department.id,
            Schedule.academic_session_id == session.id,
            Schedule.semester == 1,
            Schedule.day_of_week == day,
        ).first()

        if exists:
            continue

        db.add(
            Schedule(
                department_id=department.id,
                academic_session_id=session.id,
                semester=1,
                day_of_week=day,
            )
        )

    db.commit()