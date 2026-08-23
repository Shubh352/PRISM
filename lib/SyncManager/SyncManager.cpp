#include "SyncManager.h"
#include <SD.h>
SyncManager::SyncManager(
    AttendanceStorage &storage,
    AttendanceClient &client)
    : storage(storage),
      client(client)
{
}

AttendanceResponse SyncManager::processAttendance(
    const AttendanceRecord &record)
{
    AttendanceResponse response;
    // Step 1
    if (!storage.savePending(record))
    {
        response.success = false;
        response.message = "Failed to save pending record";
        return response;
    }

    // Step 2
    response =
        client.sendAttendance(record);

    // Step 3
    if (response.delivered)
    {
        String syncStatus =
            response.success
                ? "SYNCED"
                : "REJECTED";

        if (storage.saveAttendance(
                record,
                syncStatus,
                response.success
                    ? "SUCCESS"
                    : response.message))
        {
            storage.removePending(record.recordId);
        }
    }

    return response;
}

void SyncManager::syncPending()
{

    File file =
        SD.open("/PRISM/pending.csv", FILE_READ);

    if (!file)
    {
        Serial.println("No pending file");
        return;
    }

    // Skip CSV header
    file.readStringUntil('\n');

    while (file.available())
    {
        String line =
            file.readStringUntil('\n');

        line.trim();

        if (line.length() == 0)
        {
            continue;
        }

        AttendanceRecord record =
            parseRecord(line);

        AttendanceResponse response =
            client.sendAttendance(record);

        // Communication failed
        if (!response.delivered)
        {
            Serial.println("Communication Failed");

            break;
        }

        // Backend processed request

        String syncStatus =
            response.success
                ? "SYNCED"
                : "REJECTED";

        if (storage.saveAttendance(
                record,
                syncStatus,
                response.success
                    ? "SUCCESS"
                    : response.message))
        {
            storage.removePending(
                record.recordId);

            if (response.success)
            {
                Serial.print("Synced : ");
            }
            else
            {
                Serial.print("Rejected : ");
            }

            Serial.println(record.recordId);
        }
    }

    file.close();
}

AttendanceRecord SyncManager::parseRecord(
    const String &line)
{
    AttendanceRecord record;

    int p1 =
        line.indexOf(',');

    int p2 =
        line.indexOf(
            ',',
            p1 + 1);

    int p3 =
        line.indexOf(
            ',',
            p2 + 1);

    record.recordId =
        line.substring(
            0,
            p1);

    String timestamp =
        line.substring(
            p1 + 1,
            p2);

    record.timestamp =
        DateTime(
            timestamp.c_str());

    record.fingerprintId =
        line.substring(
                p2 + 1,
                p3)
            .toInt();

    return record;
}