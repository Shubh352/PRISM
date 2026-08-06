#ifndef ATTENDANCE_STORAGE_H
#define ATTENDANCE_STORAGE_H

#include <Arduino.h>

#include "AttendanceRecord.h"

class AttendanceStorage
{
public:

    bool begin();

    bool saveAttendance(
        const AttendanceRecord &record);

    bool savePending(
        const AttendanceRecord &record);

    bool removePending(
        const String &recordId);

private:

    bool writeHeaderIfNeeded(
        const char *path);

    String actionToString(
        AttendanceAction action);
};

#endif