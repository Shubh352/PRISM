from pydantic import BaseModel
from datetime import date, datetime

class AttendanceCreate(BaseModel):
    fingerprint_id: int
    device_id: str

class AttendanceResponse(BaseModel):
    id: int
    user_id: int
    attendance_date: date
    punch_in: datetime
    punch_out: datetime | None

    class Config:
        from_attributes = True