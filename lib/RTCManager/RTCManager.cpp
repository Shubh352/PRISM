#include "RTCManager.h"

bool RTCManager::begin()
{
    return rtc.begin();
}

DateTime RTCManager::now()
{
    return rtc.now();
}