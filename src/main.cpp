#include <Arduino.h>
#include "Fingerprint.h"

Fingerprint fingerprint;

void setup()
{
    Serial.begin(115200);

    Serial.println();
    Serial.println("========================");
    Serial.println("PROJECT PRISM");
    Serial.println("========================");

    fingerprint.begin();

    if (fingerprint.verifySensor())
    {
        Serial.println("Fingerprint Sensor Connected!");
    }
    else
    {
        Serial.println("Fingerprint Sensor NOT Found!");

        while (true)
        {
            delay(100);
        }
    }
}

void loop()
{
}