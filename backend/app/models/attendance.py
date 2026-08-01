from sqlalchemy import Column, Integer, DateTime, ForeignKey
from datetime import datetime

from app.database.database import Base


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    punch_in = Column(DateTime, default=datetime.utcnow)

    punch_out = Column(DateTime, nullable=True)