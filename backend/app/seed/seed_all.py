from app.database.database import SessionLocal

from app.seed.seed_departments import seed_departments
from app.seed.seed_academic_sessions import seed_academic_sessions
from app.seed.seed_devices import seed_devices
from app.seed.seed_users import seed_users
from app.seed.seed_schedules import seed_schedules
from app.seed.seed_schedule_sessions import seed_schedule_sessions


def run():

    db = SessionLocal()

    try:
        seed_departments(db)
        seed_academic_sessions(db)
        seed_devices(db)
        seed_users(db)
        seed_schedules(db)
        seed_schedule_sessions(db)

        print("✅ Database seeded successfully.")

    finally:
        db.close()


if __name__ == "__main__":
    run()