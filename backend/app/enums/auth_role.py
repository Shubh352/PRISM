from enum import Enum


class AuthRole(str, Enum):
    ADMIN = "Admin"
    HOD = "HOD"