from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.database.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    roll_number = Column(String, unique=True, nullable=False)

    fingerprint_id = Column(Integer, unique=True, nullable=False)

    department = Column(String, nullable=False)

    semester = Column(Integer, nullable=False)

    user_type = Column(String, nullable=False)

    attendance_records = relationship(
    "Attendance",
    back_populates="user"
)

    