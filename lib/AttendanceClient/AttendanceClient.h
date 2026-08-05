#ifndef ATTENDANCE_CLIENT_H
#define ATTENDANCE_CLIENT_H

#include <Arduino.h>
#include "AttendanceResponse.h"
#include "AttendanceAction.h"
class AttendanceClient
{
public:
    AttendanceResponse sendAttendance(
        uint16_t fingerprintId,
        AttendanceAction action);
};

#endif