from enum import Enum


class SyncStatus(str, Enum):
    SYNCED = "SYNCED"
    PENDING = "PENDING"