from datetime import date

from sqlalchemy.orm import Session

from app.models.academic_session import AcademicSession


def seed_academic_sessions(db: Session):

    session = (
        db.query(AcademicSession)
        .filter(
            AcademicSession.session_name == "2026-2027",
        )
        .first()
    )

    if session:
        return

    session = AcademicSession(
        session_name="2026-2027",
        start_date=date(2026, 7, 1),
        end_date=date(2027, 6, 30),
        is_active=True,
    )

    db.add(session)
    db.commit()