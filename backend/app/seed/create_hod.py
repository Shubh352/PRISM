from getpass import getpass

from app.auth.password import hash_password
from app.database.database import SessionLocal
from app.enums.auth_role import AuthRole
from app.models.account import Account


def main():
    db = SessionLocal()

    try:
        username = input("HOD username: ").strip()

        if not username:
            print("Username cannot be empty.")
            return

        existing_account = (
            db.query(Account)
            .filter(Account.username == username)
            .first()
        )

        if existing_account:
            print("An account with this username already exists.")
            return

        password = getpass("HOD password: ")
        confirm_password = getpass("Confirm password: ")

        if not password:
            print("Password cannot be empty.")
            return

        if password != confirm_password:
            print("Passwords do not match.")
            return

        account = Account(
            username=username,
            password_hash=hash_password(password),
            role=AuthRole.HOD,
            is_active=True,
        )

        db.add(account)
        db.commit()
        db.refresh(account)

        print(f"HOD account created successfully: {account.username}")

    finally:
        db.close()


if __name__ == "__main__":
    main()