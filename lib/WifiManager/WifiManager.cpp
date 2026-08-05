#include "WiFiManager.h"

void WiFiManager::begin(
    const char* ssid,
    const char* password
)
{
    WiFi.begin(ssid, password);

    Serial.print("Connecting to WiFi");

    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }

    Serial.println();
    Serial.println("WiFi Connected");

    Serial.print("IP Address : ");
    Serial.println(WiFi.localIP());
}

bool WiFiManager::isConnected()
{
    return WiFi.status() == WL_CONNECTED;
}