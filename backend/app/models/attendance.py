from datetime import date
from datetime import datetime

from sqlalchemy import Column
from sqlalchemy import Date
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy import Integer

from sqlalchemy.orm import relationship

from app.database.database import Base
from sqlalchemy import UniqueConstraint

class Attendance(Base):
    __tablename__ = "attendances"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
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

    entry_1_time = Column(
        DateTime,
        nullable=True,
    )

    entry_2_time = Column(
        DateTime,
        nullable=True,
    )

    punch_out_time = Column(
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