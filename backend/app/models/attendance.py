from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database.database import Base
from sqlalchemy import Date
from datetime import date

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))
    
    attendance_date = Column(Date, default=date.today)

    punch_in = Column(DateTime, default=datetime.utcnow)

    punch_out = Column(DateTime, nullable=True)

    user = relationship(
    "User",
    back_populates="attendance_records"
)
