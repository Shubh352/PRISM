from datetime import time

from pydantic import BaseModel

from app.enums.day_of_week import DayOfWeek


class ScheduleSessionCreate(BaseModel):
    session_number: int
    start_time: time
    attendance_window_minutes: int = 20


class ScheduleCreate(BaseModel):
    department_id: int
    academic_session_id: int
    semester: int
    day_of_week: DayOfWeek
    sessions: list[ScheduleSessionCreate]


# ---------- Response Schemas ----------

class ScheduleSessionResponse(BaseModel):
    id: int
    session_number: int
    start_time: time
    attendance_window_minutes: int

    class Config:
        from_attributes = True


class ScheduleResponse(BaseModel):
    id: int

    department_id: int
    department_name: str

    academic_session_id: int
    academic_session_name: str

    semester: int
    day_of_week: DayOfWeek

    schedule_sessions: list[ScheduleSessionResponse]

    class Config:
        from_attributes = True