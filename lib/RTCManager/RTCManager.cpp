#include "RTCManager.h"

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