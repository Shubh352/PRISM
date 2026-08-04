from enum import Enum


class ScanEvent(str, Enum):
    MORNING_ENTRY = "MORNING_ENTRY"
    AFTERNOON_ENTRY = "AFTERNOON_ENTRY"
    PUNCH_OUT = "PUNCH_OUT"