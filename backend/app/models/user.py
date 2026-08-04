from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.database import Base
from app.enums.user_type import UserType


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    roll_number = Column(String, unique=True, nullable=False)

    fingerprint_id = Column(Integer, unique=True, nullable=False)

    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    semester = Column(Integer, nullable=False)

    user_type = Column(
        Enum(UserType),
        nullable=False,
    )

    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    attendance_records = relationship(
    "Attendance",
    back_populates="user",
)

department = relationship(
    "Department",
    back_populates="users",
)
