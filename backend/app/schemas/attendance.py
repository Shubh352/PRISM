from pydantic import BaseModel
from datetime import date, datetime
from app.enums.scan_event import ScanEvent


class AttendanceCreate(BaseModel):

    record_id: str

    fingerprint_id: int

    device_code: str

    action: ScanEvent

    scan_timestamp: datetime


class AttendanceResponse(BaseModel):
    id: int
    user_id: int

    attendance_date: date

    entry_1_time: datetime | None

    entry_2_time: datetime | None

    punch_out_time: datetime | None

    class Config:
        from_attributes = True


class AttendanceDetailsResponse(BaseModel):

    id: int

    name: str

    roll_number: str

    department: str

    semester: int

    attendance_date: date

    entry_1_time: datetime | None

    entry_2_time: datetime | None

    punch_out_time: datetime | None

    morning_status: str

    afternoon_status: str

    punch_out_status: str

    status: str
