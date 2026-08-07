#include "RTCManager.h"
#include <time.h>
#include <WiFi.h>

bool RTCManager::begin()
{
    return rtc.begin();
}

DateTime RTCManager::now()
{
    return rtc.now();
}

bool RTCManager::lostPower()
{
    return rtc.lostPower();
}

void RTCManager::adjustToCompileTime()
{
    DateTime dt(F(__DATE__), F(__TIME__));

    rtc.adjust(dt);
}

bool RTCManager::syncWithNTP()
{
    configTime(
        19800,     // GMT+5:30 (India)
        0,
        "pool.ntp.org",
        "time.nist.gov");

    struct tm timeinfo;

    Serial.print("Synchronizing RTC");

    int retries = 0;

    while (!getLocalTime(&timeinfo) && retries < 10)
    {
        Serial.print(".");
        delay(500);
        retries++;
    }

    Serial.println();

    if (retries == 10)
    {
        Serial.println("NTP Sync Failed");
        return false;
    }

    DateTime ntpTime(
        timeinfo.tm_year + 1900,
        timeinfo.tm_mon + 1,
        timeinfo.tm_mday,
        timeinfo.tm_hour,
        timeinfo.tm_min,
        timeinfo.tm_sec);

    rtc.adjust(ntpTime);

    Serial.println("RTC Synced Successfully");

    return true;
}