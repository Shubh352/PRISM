#include <Arduino.h>
#include "Fingerprint.h"

Fingerprint fingerprint;

void setup()
{
  Serial.begin(115200);
  delay(1000);

  Serial.println();
  Serial.println("========================");
  Serial.println("PROJECT PRISM");
  Serial.println("Fingerprint Enrollment");
  Serial.println("========================");

  fingerprint.begin();

  if (fingerprint.verifySensor())
  {
    Serial.println("Fingerprint Sensor Connected!");

    Serial.print("Templates = ");
    Serial.println(fingerprint.getTemplateCount());
  }
  else
  {
    Serial.println("Fingerprint Sensor NOT Found!");

    while (true)
    {
      delay(100);
    }
  }

  Serial.println("Fingerprint Sensor Connected!");

  if (fingerprint.enrollFinger(1))
  {
    Serial.println();
    Serial.println("********************************");
    Serial.println("Enrollment Successful!");
    Serial.println("Stored at ID = 1");
    Serial.println("********************************");
  }
  else
  {
    Serial.println();
    Serial.println("Enrollment Failed!");
  }
}

void loop()
{
}