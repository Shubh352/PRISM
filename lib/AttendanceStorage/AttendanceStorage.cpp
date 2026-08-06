#include "AttendanceStorage.h"

#include <SD.h>

#include "Config.h"

bool AttendanceStorage::begin()
{
    return writeHeaderIfNeeded("/PRISM/attendance.csv") &&
           writeHeaderIfNeeded("/PRISM/pending.csv");
}

bool AttendanceStorage::writeHeaderIfNeeded(
    const char *path)
{
    if (SD.exists(path))
    {
        return true;
    }

    File file =
        SD.open(path, FILE_WRITE);

    if (!file)
    {
        return false;
    }

    file.println(
        "record_id,timestamp,fingerprint_id,action,device_code");

    file.close();

    return true;
}

String AttendanceStorage::actionToString(
    AttendanceAction action)
{
    switch (action)
    {
    case AttendanceAction::ENTRY:
        return "MORNING_ENTRY";

    case AttendanceAction::EXIT:
        return "PUNCH_OUT";

    default:
        return "UNKNOWN";
    }
}

bool AttendanceStorage::saveAttendance(
    const AttendanceRecord &record)
{
    File file =
        SD.open(
            "/PRISM/attendance.csv",
            FILE_APPEND);

    if (!file)
    {
        return false;
    }

    file.print(record.recordId);
    file.print(",");

    file.print(record.timestamp.timestamp(DateTime::TIMESTAMP_FULL));
    file.print(",");

    file.print(record.fingerprintId);
    file.print(",");

    file.print(actionToString(record.action));
    file.print(",");

    file.println(DEVICE_CODE);

    file.close();

    return true;
}

bool AttendanceStorage::savePending(
    const AttendanceRecord &record)
{
    File file =
        SD.open(
            "/PRISM/pending.csv",
            FILE_APPEND);

    if (!file)
    {
        return false;
    }

    file.print(record.recordId);
    file.print(",");

    file.print(
        record.timestamp.timestamp(DateTime::TIMESTAMP_FULL));
    file.print(",");

    file.print(record.fingerprintId);
    file.print(",");

    file.print(actionToString(record.action));
    file.print(",");

    file.println(DEVICE_CODE);

    file.close();

    return true;
}

bool AttendanceStorage::removePending(
    const String &recordId)
{
    File input =
        SD.open("/PRISM/pending.csv", FILE_READ);

    if (!input)
    {
        return false;
    }

    File output =
        SD.open("/PRISM/temp.csv", FILE_WRITE);

    if (!output)
    {
        input.close();
        return false;
    }

    bool firstLine = true;

    while (input.available())
    {
        String line =
            input.readStringUntil('\n');

        line.trim();

        // Always keep header
        if (firstLine)
        {
            output.println(line);
            firstLine = false;
            continue;
        }

        // Skip empty lines
        if (line.length() == 0)
        {
            continue;
        }

        // Compare only the Record ID
        int comma =
            line.indexOf(',');

        String currentId =
            line.substring(0, comma);

        if (currentId != recordId)
        {
            output.println(line);
        }
    }

    input.close();
    output.close();

    SD.remove("/PRISM/pending.csv");

    SD.rename(
        "/PRISM/temp.csv",
        "/PRISM/pending.csv");

    return true;
}