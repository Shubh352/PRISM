#ifndef ATTENDANCE_CLIENT_H
#define ATTENDANCE_CLIENT_H

#include <Arduino.h>
#include "AttendanceResponse.h"
#include "AttendanceAction.h"
#include "AttendanceRecord.h"
class AttendanceClient
{
public:
    AttendanceResponse sendAttendance(
    const AttendanceRecord& record);
};

#endif