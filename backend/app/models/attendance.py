from datetime import date
from datetime import datetime
from sqlalchemy import String
from sqlalchemy import Column
from sqlalchemy import Date
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import UniqueConstraint

from sqlalchemy.orm import relationship

from app.database.database import Base


class Attendance(Base):
    __tablename__ = "attendances"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    record_id = Column(
        String(100),
        unique=True,
        index=True,
        nullable=False,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    attendance_date = Column(
        Date,
        index=True,
        default=date.today,
        nullable=False,
    )

    punch_in_time = Column(
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

    user = relationship(
        "User",
        back_populates="attendance_records",
    )

    device_logs = relationship(
        "DeviceLog",
        back_populates="attendance",
    )

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "attendance_date",
            name="uq_user_attendance_date",
        ),
    )
