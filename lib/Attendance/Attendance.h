#ifndef ATTENDANCE_H
#define ATTENDANCE_H

#include <Arduino.h>

class Attendance
{
public:

    void begin();

    void processScan(uint16_t id);

private:

    uint16_t lastID;

    unsigned long lastScanTime;

};

#endif