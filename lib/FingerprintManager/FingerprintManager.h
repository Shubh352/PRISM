#ifndef FINGERPRINT_H
#define FINGERPRINT_H

#include <Arduino.h>

struct FingerResult
{
    bool fingerDetected = false;
    bool matched = false;
    uint16_t id = 0;
    uint16_t confidence = 0;
};

class Fingerprint
{
public:
    Fingerprint();

    void begin();

    bool verifySensor();

    FingerResult authenticate();

    bool enrollFinger(uint16_t id);

    bool deleteFinger(uint16_t id);

    uint16_t getTemplateCount();

    void waitForFingerRemoval();
};

#endif