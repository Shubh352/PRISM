from datetime import date, datetime

from pydantic import BaseModel


class AttendanceCreate(BaseModel):

    record_id: str

    fingerprint_id: int

    device_code: str

    scan_timestamp: datetime


class AttendanceResponse(BaseModel):

    id: int

    user_id: int

    attendance_date: date

    punch_in_time: datetime | None

    class Config:
        from_attributes = True


class AttendanceDetailsResponse(BaseModel):

    id: int

    name: str

    roll_number: str

    department: str

    semester: int

    attendance_date: date

    punch_in_time: datetime | None

    status: str