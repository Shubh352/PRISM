from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.services.dashboard_service import DashboardService

router = APIRouter()

dashboard_service = DashboardService()


@router.get("/dashboard/summary")
def dashboard_summary(
    db: Session = Depends(get_db),
):

    return dashboard_service.get_summary(db)

@router.get("/dashboard/recent-attendance")
def recent_attendance(
    db: Session = Depends(get_db),
):

    return dashboard_service.get_recent_attendance(db)