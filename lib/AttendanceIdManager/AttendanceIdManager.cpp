#include "AttendanceIdManager.h"

#include <SD.h>
#include <ArduinoJson.h>

#include "Config.h"

bool AttendanceIdManager::begin()
{
    return loadConfig();
}

bool AttendanceIdManager::loadConfig()
{
    if (!SD.exists("/PRISM/config.json"))
    {
        lastRecordId = 0;

        return saveConfig();
    }

    File file = SD.open("/PRISM/config.json", FILE_READ);

    if (!file)
    {
        return false;
    }

    JsonDocument doc;

    DeserializationError error =
        deserializeJson(doc, file);

    file.close();

    if (error)
    {
        return false;
    }

    lastRecordId =
        doc["lastRecordId"] | 0;

    return true;
}

bool AttendanceIdManager::saveConfig()
{

    if (SD.exists("/PRISM/config.json"))
    {
        SD.remove("/PRISM/config.json");
    }

    File file = SD.open("/PRISM/config.json", FILE_WRITE);

    if (!file)
    {
        Serial.println("Failed to open config.json");
        return false;
    }

    JsonDocument doc;
    doc["lastRecordId"] = lastRecordId;

   serializeJson(doc, file);

    file.flush();
    file.close();

    return true;
}

String AttendanceIdManager::generateId()
{

    lastRecordId++;

    if (!saveConfig())
    {
        Serial.println("Failed to save config!");
    }

    char id[40];

    sprintf(id, "%s-%06lu", DEVICE_CODE, lastRecordId);

    return String(id);
}