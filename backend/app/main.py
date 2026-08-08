from fastapi import FastAPI

from app.database.database import Base, engine

import app.models

from app.routers import users

from app.routers import attendance
from app.routers import dashboard

from fastapi.middleware.cors import CORSMiddleware

from app.routers import department
from app.routers import auth
# Base.metadata.create_all(bind=engine)

app = FastAPI(title="PROJECT PRISM API", version="1.0.0")

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
app.include_router(dashboard.router)
app.include_router(department.router)
app.include_router(auth.router)


@app.get("/")
def home():
    return {"project": "PROJECT PRISM", "status": "Backend Running 🚀"}
