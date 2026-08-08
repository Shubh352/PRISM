from sqlalchemy.orm import Session

from app.auth.password import verify_password
from app.models.account import Account


def authenticate_account(
    db: Session,
    username: str,
    password: str,
) -> Account | None:

    account = (
        db.query(Account)
        .filter(Account.username == username)
        .first()
    )

    if account is None:
        return None

    if not account.is_active:
        return None

    if not verify_password(
        password,
        account.password_hash,
    ):
        return None

    return account