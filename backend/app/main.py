from fastapi import FastAPI

from app.database.database import Base, engine

import app.models.user

import app.models.attendance

from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate

from app.models.attendance import Attendance
from app.schemas.attendance import AttendanceCreate

from app.services.attendance_service import AttendanceService

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PROJECT PRISM API",
    version="1.0.0"
)

attendance_service = AttendanceService()

@app.get("/")
def home():
    return {
        "project": "PROJECT PRISM",
        "status": "Backend Running 🚀"
    }

@app.post("/users")
def create_user(user: UserCreate):

    db: Session = SessionLocal()

    db_user = User(
        name=user.name,
        roll_number=user.roll_number,
        fingerprint_id=user.fingerprint_id,
        department=user.department,
        semester=user.semester,
        user_type=user.user_type
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    db.close()

    return db_user

@app.get("/users")
def get_users():

    db: Session = SessionLocal()

    users = db.query(User).all()

    db.close()

    return users

@app.get("/users/{user_id}")
def get_user(user_id: int):

    db: Session = SessionLocal()

    user = db.query(User).filter(User.id == user_id).first()

    db.close()

    if user is None:
        return {"message": "User not found"}

    return user

@app.delete("/users/{user_id}")
def delete_user(user_id: int):

    db: Session = SessionLocal()

    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        db.close()
        return {"message": "User not found"}

    db.delete(user)
    db.commit()
    db.close()

    return {"message": "User deleted successfully"}

@app.put("/users/{user_id}")
def update_user(user_id: int, updated_user: UserUpdate):

    db: Session = SessionLocal()

    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        db.close()
        return {"message": "User not found"}

    user.name = updated_user.name
    user.roll_number = updated_user.roll_number
    user.fingerprint_id = updated_user.fingerprint_id
    user.department = updated_user.department
    user.semester = updated_user.semester
    user.user_type = updated_user.user_type

    db.commit()
    db.refresh(user)

    db.close()

    return user

@app.post("/attendance")
def create_attendance(attendance: AttendanceCreate):

    db: Session = SessionLocal()

    return attendance_service.process_scan(
    db,
    attendance.fingerprint_id
)