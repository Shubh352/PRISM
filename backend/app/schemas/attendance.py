from pydantic import BaseModel

class AttendanceCreate(BaseModel):
    fingerprint_id: int
    device_id: str