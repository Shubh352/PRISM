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
#include "BuzzerManager.h"
#include "SDCardManager.h"
#include "AttendanceIdManager.h"
#include "AttendanceStorage.h"
#include "SyncManager.h"

PrismDisplay prismDisplay;
Fingerprint fingerprint;
RTCManager rtc;
StateManager stateManager;
FingerResult currentFinger;
WiFiManager wifiManager;
AttendanceClient attendanceClient;
ButtonManager buttonManager;

BuzzerManager buzzer;

AttendanceIdManager attendanceIdManager;
SDCardManager sdCardManager;
AttendanceStorage attendanceStorage;
SyncManager syncManager(
    attendanceStorage,
    attendanceClient);

unsigned long lastClockUpdate = 0;
bool wasWifiConnected = false;
unsigned long lastPendingSync = 0;

const unsigned long PENDING_SYNC_INTERVAL = 15000;

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

    if (rtc.lostPower())
    {
        Serial.println("RTC Lost Power");

        rtc.adjustToCompileTime();
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

    if (!sdCardManager.begin())
    {
        Serial.println("SD FAILED");

        while (true)
            ;
    }

    Serial.println("SD OK");

    if (!attendanceStorage.begin())
    {
        Serial.println("Attendance Storage FAILED");

        while (true)
            ;
    }

    Serial.println("Attendance Storage OK");

    if (!attendanceIdManager.begin())
    {
        Serial.println("AttendanceIdManager FAILED");

        while (true)
            ;
    }

    Serial.println("AttendanceIdManager OK");

    wifiManager.begin(
        WIFI_SSID,
        WIFI_PASSWORD);

    wasWifiConnected =
        wifiManager.isConnected();

    if (wasWifiConnected)
    {
        rtc.syncWithNTP();

        syncManager.syncPending();
    }

    stateManager.setState(PrismState::IDLE);

    // Test buzzer
    buzzer.successBeep();
    delay(300);

    buzzer.errorBeep();
    delay(300);

    buzzer.scanFailBeep();
}

void loop()
{

    wifiManager.maintainConnection();

    bool wifiConnected =
        wifiManager.isConnected();

    if (
        wifiConnected &&
        !wasWifiConnected)
    {
        Serial.println(
            "WiFi Reconnected");

        rtc.syncWithNTP();

        syncManager.syncPending();
    }

    wasWifiConnected =
        wifiConnected;

    if (
        wifiConnected &&
        millis() - lastPendingSync >= PENDING_SYNC_INTERVAL)
    {
        syncManager.syncPending();

        lastPendingSync = millis();
    }

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
            stateManager.setState(
                PrismState::WAIT_FOR_FINGER);
        }

        break;

    case PrismState::WAIT_FOR_FINGER:
    {
        prismDisplay.showScanning("SCAN");

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
        AttendanceRecord record;

        record.recordId =
            attendanceIdManager.generateId();

        record.timestamp =
            rtc.now();

        record.fingerprintId =
            currentFinger.id;

        AttendanceResponse response =
            syncManager.processAttendance(record);

        if (response.success)
        {
            // Backend accepted the attendance
            prismDisplay.showSuccess(
                response.message);

            buzzer.successBeep();

            delay(2000);

            stateManager.setState(
                PrismState::SUCCESS);
        }
        else if (!response.delivered)
        {
            // Backend could not be reached.
            // Attendance has been saved locally
            // and will be synchronized later.

            prismDisplay.showPending();

            buzzer.successBeep();

            delay(2000);

            stateManager.setState(
                PrismState::SUCCESS);
        }
        else
        {
            // Backend received the request
            // but rejected the attendance.

            prismDisplay.showError(
                response.message);

            buzzer.errorBeep();

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