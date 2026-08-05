#ifndef RTC_MANAGER_H
#define RTC_MANAGER_H

#include <RTClib.h>

class RTCManager
{
public:

    bool begin();

    DateTime now();

private:

    RTC_DS3231 rtc;
};

#endif