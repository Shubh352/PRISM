from datetime import datetime

from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import Enum
from sqlalchemy import ForeignKey
from sqlalchemy import Integer

from sqlalchemy.orm import relationship

from app.database.database import Base
from app.enums.scan_event import ScanEvent
from app.enums.sync_status import SyncStatus


class DeviceLog(Base):
    __tablename__ = "device_logs"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    attendance_id = Column(
        Integer,
        ForeignKey("attendances.id"),
        nullable=True,
    )

    device_id = Column(
        Integer,
        ForeignKey("devices.id"),
        nullable=False,
    )

    fingerprint_id = Column(
        Integer,
        nullable=False,
    )

    event = Column(
        Enum(ScanEvent),
        nullable=False,
    )

    scan_time = Column(
        DateTime,
        default=datetime.utcnow,
    )

    sync_status = Column(
        Enum(SyncStatus),
        default=SyncStatus.SYNCED,
    )

    attendance = relationship(
        "Attendance",
        back_populates="device_logs",
    )

    device = relationship(
        "Device",
        back_populates="device_logs",
    )