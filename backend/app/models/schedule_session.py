from datetime import datetime
from datetime import time

from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import Time

from sqlalchemy.orm import relationship

from app.database.database import Base
from sqlalchemy import UniqueConstraint

class ScheduleSession(Base):
    __tablename__ = "schedule_sessions"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    schedule_id = Column(
        Integer,
        ForeignKey("schedules.id"),
        nullable=False,
    )

    session_number = Column(
        Integer,
        nullable=False,
    )

    start_time = Column(
        Time,
        nullable=False,
    )

    attendance_window_minutes = Column(
        Integer,
        nullable=False,
        default=20,
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

    schedule = relationship(
        "Schedule",
        back_populates="schedule_sessions",
    )

    __table_args__ = (
        UniqueConstraint(
            "schedule_id",
            "session_number",
            name="uq_schedule_session",
        ),
    )