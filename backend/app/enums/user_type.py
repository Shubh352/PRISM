from enum import Enum


class UserType(str, Enum):
    STUDENT = "Student"
    FACULTY = "Faculty"
    ADMIN = "Admin"
    PHD = "PhD"