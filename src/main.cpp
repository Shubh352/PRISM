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
  Serial.println("Smart Attendance System");
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
  Serial.println();
  Serial.println("========== PRISM MENU ==========");
  Serial.println("1. Enroll Finger");
  Serial.println("2. Scan Finger");
  Serial.println("3. Delete Finger");
  Serial.println("4. Count Templates");
  Serial.print("Enter Choice : ");

  while (!Serial.available())
    ;

  int choice = Serial.parseInt();

  Serial.readStringUntil('\n'); // Clear buffer

  switch (choice)
  {
  case 1:
    Serial.println("Enroll Selected");
    break;

  case 2:
    Serial.println("Scan Selected");
    break;

  case 3:
    Serial.println("Delete Selected");
    break;

  case 4:
    Serial.print("Templates = ");
    Serial.println(fingerprint.getTemplateCount());
    break;

  default:
    Serial.println("Invalid Choice");
  }

  delay(500);
}