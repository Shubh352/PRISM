#ifndef ATTENDANCE_ID_MANAGER_H
#define ATTENDANCE_ID_MANAGER_H

#include <Arduino.h>

class AttendanceIdManager
{
public:

    bool begin();

    String generateId();

private:

    uint32_t lastRecordId = 0;

    bool loadConfig();

    bool saveConfig();
};

#endif