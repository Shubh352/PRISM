from fastapi import FastAPI

from app.database.database import Base, engine

import app.models.user

import app.models.attendance

from app.routers import users

from app.routers import attendance

from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PROJECT PRISM API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)

app.include_router(attendance.router)


@app.get("/")
def home():
    return {
        "project": "PROJECT PRISM",
        "status": "Backend Running 🚀"
    }
