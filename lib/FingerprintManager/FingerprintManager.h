#ifndef FINGERPRINT_H
#define FINGERPRINT_H

#include <Arduino.h>

struct FingerResult
{
    bool matched;
    uint16_t id;
    uint16_t confidence;
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