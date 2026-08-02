#include <Arduino.h>
#include "Fingerprint.h"
#include "Menu.h"
#include "Attendance.h"
#include "WiFiManager.h"
#include "BackendClient.h"

Fingerprint fingerprint;
Menu menu;
Attendance attendance;
WiFiManager wifiManager;
BackendClient backendClient;

void setup()
{
  Serial.begin(115200);
  wifiManager.begin();

  fingerprint.begin();

  attendance.begin();

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
  int choice = menu.run();

  switch (choice)
  {
  case 1:
  {
    Serial.print("Enter ID (1-127): ");

    while (!Serial.available())
      ;

    int id = Serial.parseInt();
    Serial.readStringUntil('\n');

    if (fingerprint.enrollFinger(id))
    {
      Serial.println("Enrollment Successful!");
    }
    else
    {
      Serial.println("Enrollment Failed!");
    }

    break;
  }

  case 2:
  {
    Serial.println();
    Serial.println("=================================");
    Serial.println("ATTENDANCE MODE");
    Serial.println("Press 'q' to Exit");
    Serial.println("=================================");

    while (true)
    {
      if (Serial.available())
      {
        char c = Serial.read();

        if (c == 'q' || c == 'Q')
        {
          Serial.println("Leaving Attendance Mode...");
          break;
        }
      }

      FingerResult result = fingerprint.authenticate();

      if (!result.matched)
      {
        continue;
      }

      backendClient.sendAttendance(result.id);

      Serial.println("Remove Finger...");

      fingerprint.waitForFingerRemoval();

      Serial.println("Finger Removed.");

      Serial.println();
      Serial.println("Ready for Next Student");
      Serial.println();
    }

    break;
  }

  case 3:
  {
    Serial.print("Enter Fingerprint ID to Delete (1-127): ");

    while (!Serial.available())
      ;

    int id = Serial.parseInt();
    Serial.readStringUntil('\n');

    if (fingerprint.deleteFinger(id))
    {
      Serial.println();
      Serial.println("Fingerprint Deleted Successfully!");

      Serial.print("Templates = ");
      Serial.println(fingerprint.getTemplateCount());
    }
    else
    {
      Serial.println();
      Serial.println("Failed to Delete Fingerprint!");
    }

    break;
  }
  case 4:
    Serial.print("Templates = ");
    Serial.println(fingerprint.getTemplateCount());
    break;

  default:
    Serial.println("Invalid Choice");
    break;
  }

  delay(300);
}