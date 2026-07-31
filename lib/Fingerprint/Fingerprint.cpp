#include "Fingerprint.h"

#include <HardwareSerial.h>
#include <Adafruit_Fingerprint.h>

// ----------------------------
// Private Hardware Objects
// ----------------------------

HardwareSerial mySerial(2);
Adafruit_Fingerprint finger(&mySerial);

// ----------------------------
// Constructor
// ----------------------------

Fingerprint::Fingerprint()
{
}

// ----------------------------
// Initialize Fingerprint Sensor
// ----------------------------

void Fingerprint::begin()
{
    mySerial.begin(57600, SERIAL_8N1, 16, 17);

    finger.begin(57600);
}

// ----------------------------
// Verify Sensor Connection
// ----------------------------

bool Fingerprint::verifySensor()
{
    return finger.verifyPassword();
}

// ----------------------------
// Placeholder Functions
// ----------------------------

int Fingerprint::scanFinger()
{
    return -1;
}

bool Fingerprint::enrollFinger(uint16_t id)
{
    return false;
}

bool Fingerprint::deleteFinger(uint16_t id)
{
    return false;
}