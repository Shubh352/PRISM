#include <Arduino.h>
#include "FingerprintManager.h"
#include <Wire.h>
#include "StateManager.h"
#include "PrismDisplay.h"
#include "RTCManager.h"
#include "WiFiManager.h"
#include "AttendanceClient.h"
#include "Config.h"
#include "ButtonManager.h"
#include "AttendanceAction.h"
#include "BuzzerManager.h"

PrismDisplay prismDisplay;
Fingerprint fingerprint;
RTCManager rtc;
StateManager stateManager;
FingerResult currentFinger;
WiFiManager wifiManager;
AttendanceClient attendanceClient;
ButtonManager buttonManager;

AttendanceAction currentAction =
    AttendanceAction::ENTRY;
BuzzerManager buzzer;

unsigned long lastClockUpdate = 0;

void setup()
{
    Serial.begin(115200);
    delay(1000);

    Serial.println("START");

    Wire.begin(21, 22);
    buttonManager.begin();
    buzzer.begin();

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
    rtc.adjustToCompileTime();

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

    stateManager.setState(PrismState::IDLE);

    buzzer.successBeep();

    delay(300);

    buzzer.errorBeep();

    delay(300);

    buzzer.scanFailBeep();
}

void loop()
{

    switch (stateManager.getState())
    {
    case PrismState::IDLE:

        if (millis() - lastClockUpdate >= 1000)
        {
            prismDisplay.showClock(
                rtc.now());

            lastClockUpdate = millis();
        }

        if (buttonManager.entryJustPressed())
        {

            currentAction =
                AttendanceAction::ENTRY;

            stateManager.setState(
                PrismState::WAIT_FOR_FINGER);
        }

        if (buttonManager.exitJustPressed())
        {

            currentAction =
                AttendanceAction::EXIT;

            stateManager.setState(
                PrismState::WAIT_FOR_FINGER);
        }

        break;

    case PrismState::WAIT_FOR_FINGER:
    {
        if (currentAction == AttendanceAction::ENTRY)
        {
            prismDisplay.showScanning("ENTRY");
        }
        else
        {
            prismDisplay.showScanning("EXIT");
        }

        currentFinger =
            fingerprint.authenticate();

        if (currentFinger.matched)
        {
            Serial.print("Matched ID : ");
            Serial.println(currentFinger.id);

            stateManager.setState(
                PrismState::VERIFYING);
        }
        else
        {
            if (currentFinger.fingerDetected)
            {
                buzzer.scanFailBeep();
            }

            stateManager.setState(
                PrismState::WAIT_FOR_FINGER);
        }

        break;
    }

    case PrismState::VERIFYING:
    {
        AttendanceResponse response =
            attendanceClient.sendAttendance(
                currentFinger.id,
                currentAction);

        if (response.success)
        {
            prismDisplay.showSuccess(
                response.message);
            buzzer.successBeep();
            delay(2000);

            stateManager.setState(
                PrismState::SUCCESS);
        }
        else
        {
            buzzer.errorBeep();
            prismDisplay.showError(
                response.message);

            delay(2000);

            stateManager.setState(
                PrismState::ERROR);
        }

        Serial.println(response.message);

        break;
    }

    case PrismState::SUCCESS:

        stateManager.setState(
            PrismState::IDLE);

        break;

    case PrismState::ERROR:

        stateManager.setState(
            PrismState::IDLE);

        break;

    default:
        break;
    }
}