from fastapi import FastAPI

from app.database.database import Base, engine

import app.models.user

import app.models.attendance

from app.routers import users

from app.routers import attendance

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PROJECT PRISM API",
    version="1.0.0"
)

app.include_router(users.router)

app.include_router(attendance.router)


@app.get("/")
def home():
    return {
        "project": "PROJECT PRISM",
        "status": "Backend Running 🚀"
    }
