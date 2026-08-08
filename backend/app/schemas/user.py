from pydantic import BaseModel


class UserCreate(BaseModel):
    name: str
    roll_number: str
    fingerprint_id: int
    department_id: int
    semester: int
    user_type: str


class UserUpdate(BaseModel):
    name: str
    roll_number: str
    fingerprint_id: int
    department_id: int
    semester: int
    user_type: str