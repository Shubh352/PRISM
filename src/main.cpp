#include <Arduino.h>
#include "FingerprintManager.h"
#include <Wire.h>
#include "StateManager.h"
#include "PrismDisplay.h"
#include "RTCManager.h"
#include "WiFiManager.h"
#include "AttendanceClient.h"
#include "Config.h"

PrismDisplay prismDisplay;
Fingerprint fingerprint;
RTCManager rtc;
StateManager stateManager;
FingerResult currentFinger;
WiFiManager wifiManager;
AttendanceClient attendanceClient;

void setup()
{
    Serial.begin(115200);
    delay(1000);

    Serial.println("START");

    Wire.begin(21, 22);

    if (!prismDisplay.begin())
    {
        Serial.println("OLED FAILED");
        while (true)
            ;
    }

    Serial.println("OLED OK");

    prismDisplay.showBootScreen();

    if (!rtc.begin())
    {
        Serial.println("RTC FAILED");
        while (true)
            ;
    }

    Serial.println("RTC OK");

    fingerprint.begin();

    if (!fingerprint.verifySensor())
    {
        Serial.println("Fingerprint FAILED");

        while (true)
            ;
    }

    Serial.println("Fingerprint OK");

    wifiManager.begin(
        WIFI_SSID,
        WIFI_PASSWORD);

    delay(2000);

    stateManager.setState(PrismState::READY);
}

void loop()
{
    switch (stateManager.getState())
    {
    case PrismState::READY:

        prismDisplay.showClock(
            rtc.now());

        delay(5000);

        stateManager.setState(
            PrismState::SCANNING);

        break;

    case PrismState::SCANNING:
    {
        currentFinger =
            fingerprint.authenticate();

        if (currentFinger.matched)
        {
            Serial.print("Matched ID : ");
            Serial.println(currentFinger.id);

            stateManager.setState(
                PrismState::PROCESSING);
        }
        else
        {
            stateManager.setState(
                PrismState::READY);
        }

        break;
    }

    case PrismState::PROCESSING:

        if (
            attendanceClient.sendAttendance(
                currentFinger.id))
        {
            stateManager.setState(
                PrismState::SUCCESS);
        }
        else
        {
            stateManager.setState(
                PrismState::ERROR);
        }

        break;

    case PrismState::SUCCESS:

        Serial.println("Attendance Recorded!");

        delay(2000);

        stateManager.setState(
            PrismState::READY);

        break;

    default:
        break;
    }
}