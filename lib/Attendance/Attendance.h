#ifndef ATTENDANCE_H
#define ATTENDANCE_H

#include <Arduino.h>

#include "UserManager.h"

struct AttendanceRecord
{
    uint16_t id;

    bool punchedIn;
    bool punchedOut;

    unsigned long punchInTime;
    unsigned long punchOutTime;
};

class Attendance
{
public:
    void begin();

    void processScan(uint16_t id);

private:
    UserManager userManager;
    static const int MAX_USERS = 200;

    AttendanceRecord records[MAX_USERS];

    int totalRecords;

    uint16_t lastID;

    unsigned long lastScanTime;

    static const unsigned long DUPLICATE_COOLDOWN = 5000;

    static const unsigned long MINIMUM_PUNCH_OUT_TIME = 600000; // 10 minutes

    int findRecord(uint16_t id);

    void createRecord(uint16_t id);

    void punchOut(int index);
};

#endif