#ifndef ATTENDANCE_RESPONSE_H
#define ATTENDANCE_RESPONSE_H

#include <Arduino.h>

struct AttendanceResponse
{
    bool success;

    bool delivered;

    String message;
};

#endif