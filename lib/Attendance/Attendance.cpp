#include "Attendance.h"

void Attendance::begin()
{
    lastID = 0;
    lastScanTime = 0;
}

void Attendance::processScan(uint16_t id)
{
    unsigned long now = millis();

    if(id == lastID && (now - lastScanTime) < 5000)
    {
        Serial.println();
        Serial.println("Duplicate Scan Ignored");
        return;
    }

    lastID = id;
    lastScanTime = now;

    Serial.println();
    Serial.println("Attendance Recorded");

    Serial.print("ID : ");
    Serial.println(id);
}