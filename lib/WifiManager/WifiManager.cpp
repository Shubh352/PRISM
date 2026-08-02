#include "WiFiManager.h"

const char* SSID = "Shubham352";
const char* PASSWORD = "12341234";

void WiFiManager::begin()
{
    Serial.println();
    Serial.println("Connecting to WiFi...");

    WiFi.begin(SSID, PASSWORD);

   while (WiFi.status() != WL_CONNECTED)
{
    Serial.print("Status: ");
    Serial.println(WiFi.status());

    delay(1000);
}

    Serial.println();
    Serial.println("WiFi Connected!");

    Serial.print("IP Address : ");
    Serial.println(WiFi.localIP());
}

bool WiFiManager::isConnected()
{
    return WiFi.status() == WL_CONNECTED;
}