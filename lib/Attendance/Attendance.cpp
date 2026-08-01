#include "Attendance.h"


void Attendance::begin()
{
    userManager.begin();
    lastID = 0;
    lastScanTime = 0;
    totalRecords = 0;
}

int Attendance::findRecord(uint16_t id)
{
    for (int i = 0; i < totalRecords; i++)
    {
        if (records[i].id == id)
        {
            return i;
        }
    }

    return -1;
}

void Attendance::createRecord(uint16_t id)
{
    records[totalRecords].id = id;

    records[totalRecords].punchedIn = true;
    records[totalRecords].punchedOut = false;

    records[totalRecords].punchInTime = millis();
    records[totalRecords].punchOutTime = 0;

    totalRecords++;
    User user = userManager.getUser(id);

    Serial.println();
    Serial.println("==========================");
    Serial.println("Punch IN Recorded");
    Serial.println("==========================");

    Serial.print("Name : ");
    Serial.println(user.name);

    Serial.print("Roll : ");
    Serial.println(user.rollNumber);

    Serial.print("Fingerprint ID : ");
    Serial.println(user.fingerprintID);
}

void Attendance::punchOut(int index)
{
    records[index].punchedOut = true;

    records[index].punchOutTime = millis();

    Serial.println();
    Serial.println("Punch OUT Recorded");

    Serial.print("ID : ");
    Serial.println(records[index].id);
}

void Attendance::processScan(uint16_t id)
{
    unsigned long now = millis();

    // Duplicate protection (5 seconds)
    if (id == lastID && (now - lastScanTime) < DUPLICATE_COOLDOWN)
    {
        Serial.println();
        Serial.println("Duplicate Scan Ignored");
        return;
    }

    lastID = id;
    lastScanTime = now;

    int index = findRecord(id);

    // First scan today
    if (index == -1)
    {
        createRecord(id);
        return;
    }

    // Already punched out
    if (records[index].punchedOut)
    {
        Serial.println();
        Serial.println("Already Punched Out Today");
        return;
    }

    // Too early for punch out
    if ((now - records[index].punchInTime) < MINIMUM_PUNCH_OUT_TIME)
    {
        unsigned long remaining =
            (MINIMUM_PUNCH_OUT_TIME - (now - records[index].punchInTime)) / 1000;

        Serial.println();
        Serial.println("Punch Out Not Allowed Yet");

        Serial.print("Wait ");
        Serial.print(remaining);
        Serial.println(" seconds");

        return;
    }

    // Punch Out
    punchOut(index);
}