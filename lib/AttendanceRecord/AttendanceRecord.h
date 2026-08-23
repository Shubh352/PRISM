#ifndef ATTENDANCE_RECORD_H
#define ATTENDANCE_RECORD_H

#include <Arduino.h>
#include <RTClib.h>

struct AttendanceRecord
{
    String recordId;

    DateTime timestamp;

    uint16_t fingerprintId;
};

#endif