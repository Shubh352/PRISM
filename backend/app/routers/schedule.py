from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_db, require_role
from app.enums.auth_role import AuthRole
from app.enums.day_of_week import DayOfWeek
from app.models.schedule import Schedule
from app.models.schedule_session import ScheduleSession
from app.schemas.schedule import (
    ScheduleCreate,
    ScheduleResponse,
)
from app.models.department import Department
from app.models.academic_session import AcademicSession

router = APIRouter()


@router.post("/schedules")
def create_schedule(
    schedule_data: ScheduleCreate,
    db: Session = Depends(get_db),
    current_account=Depends(require_role(AuthRole.ADMIN)),
):
    existing_schedule = (
        db.query(Schedule)
        .filter(
            Schedule.department_id == schedule_data.department_id,
            Schedule.academic_session_id == schedule_data.academic_session_id,
            Schedule.semester == schedule_data.semester,
            Schedule.day_of_week == schedule_data.day_of_week,
        )
        .first()
    )

    if existing_schedule:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Schedule already exists for this day",
        )

    schedule = Schedule(
        department_id=schedule_data.department_id,
        academic_session_id=schedule_data.academic_session_id,
        semester=schedule_data.semester,
        day_of_week=schedule_data.day_of_week,
    )

    db.add(schedule)
    db.flush()

    for session_data in schedule_data.sessions:

        session = ScheduleSession(
            schedule_id=schedule.id,
            session_number=session_data.session_number,
            start_time=session_data.start_time,
            attendance_window_minutes=session_data.attendance_window_minutes,
        )

        db.add(session)

    db.commit()
    db.refresh(schedule)

    return schedule


@router.get(
    "/schedules",
    response_model=list[ScheduleResponse],
)
def get_schedules(
    db: Session = Depends(get_db),
    current_account=Depends(
        require_role(
            AuthRole.ADMIN,
            AuthRole.HOD,
        )
    ),
):

    schedules = (
        db.query(Schedule)
        .order_by(
            Schedule.day_of_week,
            Schedule.semester,
        )
        .all()
    )

    response = []

    for schedule in schedules:

        response.append(
            ScheduleResponse(
                id=schedule.id,
                department_id=schedule.department_id,
                department_name=(schedule.department.department_name),
                academic_session_id=(schedule.academic_session_id),
                academic_session_name=(schedule.academic_session.session_name),
                semester=schedule.semester,
                day_of_week=schedule.day_of_week,
                schedule_sessions=(schedule.schedule_sessions),
            )
        )

    return response


@router.get("/schedules/{schedule_id}")
def get_schedule(
    schedule_id: int,
    db: Session = Depends(get_db),
    current_account=Depends(
        require_role(
            AuthRole.ADMIN,
            AuthRole.HOD,
        )
    ),
):
    schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()

    if schedule is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found",
        )

    return schedule


@router.put("/schedules/{schedule_id}")
def update_schedule(
    schedule_id: int,
    schedule_data: ScheduleCreate,
    db: Session = Depends(get_db),
    current_account=Depends(require_role(AuthRole.ADMIN)),
):
    schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()

    if schedule is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found",
        )

    # Check whether another schedule already
    # uses the same department/session/semester/day
    existing_schedule = (
        db.query(Schedule)
        .filter(
            Schedule.department_id == schedule_data.department_id,
            Schedule.academic_session_id == schedule_data.academic_session_id,
            Schedule.semester == schedule_data.semester,
            Schedule.day_of_week == schedule_data.day_of_week,
            Schedule.id != schedule_id,
        )
        .first()
    )

    if existing_schedule:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Another schedule already exists for this day",
        )

    # Update main schedule
    schedule.department_id = schedule_data.department_id
    schedule.academic_session_id = schedule_data.academic_session_id
    schedule.semester = schedule_data.semester
    schedule.day_of_week = schedule_data.day_of_week

    # Remove old sessions
    db.query(ScheduleSession).filter(ScheduleSession.schedule_id == schedule.id).delete(
        synchronize_session=False
    )

    # Create updated sessions
    for session_data in schedule_data.sessions:

        session = ScheduleSession(
            schedule_id=schedule.id,
            session_number=session_data.session_number,
            start_time=session_data.start_time,
            attendance_window_minutes=session_data.attendance_window_minutes,
        )

        db.add(session)

    db.commit()
    db.refresh(schedule)

    return schedule


@router.delete("/schedules/{schedule_id}")
def delete_schedule(
    schedule_id: int,
    db: Session = Depends(get_db),
    current_account=Depends(require_role(AuthRole.ADMIN)),
):
    schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()

    if schedule is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found",
        )

    db.delete(schedule)
    db.commit()

    return {"message": "Schedule deleted successfully"}
