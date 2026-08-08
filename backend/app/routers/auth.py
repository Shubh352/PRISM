from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.jwt import create_access_token
from app.dependencies import get_db
from app.schemas.auth import LoginRequest, TokenResponse
from app.services.auth import authenticate_account


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db),
):
    account = authenticate_account(
        db=db,
        username=login_data.username,
        password=login_data.password,
    )

    if account is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    access_token = create_access_token(
        username=account.username,
        role=account.role.value,
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
    )