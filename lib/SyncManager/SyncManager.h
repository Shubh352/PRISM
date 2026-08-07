#ifndef SYNC_MANAGER_H
#define SYNC_MANAGER_H

#include "AttendanceRecord.h"
#include "AttendanceStorage.h"
#include "AttendanceClient.h"

class SyncManager
{
public:
    SyncManager(
        AttendanceStorage &storage,
        AttendanceClient &client);

    AttendanceResponse processAttendance(
        const AttendanceRecord &record);

    void syncPending();

private:
    AttendanceStorage &storage;

    AttendanceClient &client;

    AttendanceRecord parseRecord(
    const String& line);
};

#endif