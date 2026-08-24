from datetime import datetime

from pydantic import BaseModel


class DeviceCreate(BaseModel):
    device_name: str
    device_code: str
    department_id: int
    location: str
    firmware_version: str | None = None


class DeviceUpdate(BaseModel):
    device_name: str
    device_code: str
    department_id: int
    location: str
    firmware_version: str | None = None
    is_active: bool


class DeviceHeartbeat(BaseModel):
    device_code: str
    firmware_version: str | None = None


class DeviceResponse(BaseModel):
    id: int
    device_name: str
    device_code: str
    department_id: int
    location: str
    firmware_version: str | None
    is_active: bool
    last_seen: datetime | None

    class Config:
        from_attributes = True
