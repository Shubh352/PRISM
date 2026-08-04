from datetime import time

from app.models.schedule import Schedule
from app.models.schedule_session import ScheduleSession


def seed_schedule_sessions(db):

    schedules = db.query(Schedule).all()

    for schedule in schedules:

        session1 = db.query(ScheduleSession).filter(
            ScheduleSession.schedule_id == schedule.id,
            ScheduleSession.session_number == 1,
        ).first()

        if session1 is None:
            db.add(
                ScheduleSession(
                    schedule_id=schedule.id,
                    session_number=1,
                    start_time=time(9, 0),
                    attendance_window_minutes=20,
                )
            )

        session2 = db.query(ScheduleSession).filter(
            ScheduleSession.schedule_id == schedule.id,
            ScheduleSession.session_number == 2,
        ).first()

        if session2 is None:
            db.add(
                ScheduleSession(
                    schedule_id=schedule.id,
                    session_number=2,
                    start_time=time(14, 0),
                    attendance_window_minutes=20,
                )
            )

    db.commit()