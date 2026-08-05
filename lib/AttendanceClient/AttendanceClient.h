#ifndef ATTENDANCE_CLIENT_H
#define ATTENDANCE_CLIENT_H

#include <Arduino.h>

class AttendanceClient
{
public:

    bool sendAttendance(
        uint16_t fingerprintId
    );
};

#endif