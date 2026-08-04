from datetime import datetime

from sqlalchemy import Boolean
from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String

from sqlalchemy.orm import relationship

from app.database.database import Base


class Device(Base):
    __tablename__ = "devices"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    device_name = Column(
        String(100),
        nullable=False,
    )

    device_code = Column(
        String(50),
        unique=True,
        index= True,
        nullable=False,
    )

    department_id = Column(
        Integer,
        ForeignKey("departments.id"),
        nullable=False,
    )

    location = Column(
        String(100),
        nullable=False,
    )

    firmware_version = Column(
    String(20),
    nullable=True,
    )

    is_active = Column(
        Boolean,
        default=True,
    )

    last_seen = Column(
        DateTime,
        nullable=True,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    department = relationship(
        "Department",
        back_populates="devices",
    )

    device_logs = relationship(
        "DeviceLog",
        back_populates="device",
        cascade="all, delete-orphan",
    )