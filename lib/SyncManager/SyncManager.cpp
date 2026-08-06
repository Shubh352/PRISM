#include "SyncManager.h"

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
        client.sendAttendance(
            record.fingerprintId,
            record.action);

    // Step 3
    if (response.success)
    {
        if (storage.saveAttendance(record))
        {
            storage.removePending(record.recordId);
        }
    }

    return response;
}