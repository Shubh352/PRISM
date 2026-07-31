#ifndef FINGERPRINT_H
#define FINGERPRINT_H

#include <Arduino.h>

class Fingerprint
{
public:

    Fingerprint();

    void begin();

    bool verifySensor();

    int scanFinger();

    bool enrollFinger(uint16_t id);

    bool deleteFinger(uint16_t id);
};

#endif