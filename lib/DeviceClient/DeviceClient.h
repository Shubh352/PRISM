#ifndef DEVICE_CLIENT_H
#define DEVICE_CLIENT_H

#include <Arduino.h>

class DeviceClient
{
public:
    bool sendHeartbeat();
};

#endif