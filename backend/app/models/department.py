from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.database.database import Base


class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)

    department_name = Column(String, nullable=False, unique=True)

    department_code = Column(String, nullable=False, unique=True)

    users = relationship("User", back_populates="department")

    schedules = relationship(
        "Schedule",
        back_populates="department",
    )

    devices = relationship(
    "Device",
    back_populates="department",
    )
