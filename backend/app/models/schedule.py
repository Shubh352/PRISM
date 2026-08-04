from datetime import datetime

from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import Enum
from sqlalchemy import ForeignKey
from sqlalchemy import Integer

from sqlalchemy.orm import relationship

from app.database.database import Base
from app.enums.day_of_week import DayOfWeek
from sqlalchemy import UniqueConstraint

class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    department_id = Column(
        Integer,
        ForeignKey("departments.id"),
        nullable=False,
    )

    academic_session_id = Column(
        Integer,
        ForeignKey("academic_sessions.id"),
        nullable=False,
    )

    semester = Column(
        Integer,
        nullable=False,
    )

    day_of_week = Column(
        Enum(DayOfWeek),
        nullable=False,
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
        back_populates="schedules",
    )

    academic_session = relationship(
        "AcademicSession",
        back_populates="schedules",
    )

    schedule_sessions = relationship(
        "ScheduleSession",
        back_populates="schedule",
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        UniqueConstraint(
            "department_id",
            "academic_session_id",
            "semester",
            "day_of_week",
            name="uq_schedule",
        ),
    )