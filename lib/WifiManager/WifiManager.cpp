#include "WiFiManager.h"

void WiFiManager::begin(
    const char *ssid,
    const char *password)
{
    savedSSID = ssid;
    savedPassword = password;

    WiFi.begin(
        savedSSID,
        savedPassword);

    Serial.print("Connecting to WiFi");

    int retries = 0;

    while (
        WiFi.status() != WL_CONNECTED &&
        retries < 20)
    {
        delay(500);
        Serial.print(".");
        retries++;
    }

    Serial.println();

    if (WiFi.status() == WL_CONNECTED)
    {
        Serial.println("WiFi Connected");

        Serial.print("IP Address : ");
        Serial.println(WiFi.localIP());
    }
    else
    {
        Serial.println("WiFi Connection Failed");
        Serial.println("Continuing in Offline Mode");
    }

    lastReconnectAttempt = millis();
}

bool WiFiManager::isConnected()
{
    return WiFi.status() == WL_CONNECTED;
}

void WiFiManager::maintainConnection()
{
    wl_status_t status = WiFi.status();

    if (status == WL_CONNECTED)
    {
        return;
    }

    // Already attempting to connect
    if (status == WL_NO_SSID_AVAIL ||
        status == WL_IDLE_STATUS)
    {
        return;
    }

    if (millis() - lastReconnectAttempt <
        RECONNECT_INTERVAL)
    {
        return;
    }

    lastReconnectAttempt = millis();

    Serial.println(
        "WiFi disconnected. Attempting reconnect...");

    WiFi.begin(
        savedSSID,
        savedPassword);
}