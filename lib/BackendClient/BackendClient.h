#ifndef BACKEND_CLIENT_H
#define BACKEND_CLIENT_H

#include <Arduino.h>

class BackendClient
{
public:
    bool sendAttendance(uint16_t fingerprintID);
};

#endif