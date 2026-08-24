#include "DeviceClient.h"

#include <HTTPClient.h>
#include <WiFi.h>
#include <ArduinoJson.h>

#include "Config.h"

bool DeviceClient::sendHeartbeat()
{
    if (WiFi.status() != WL_CONNECTED)
    {
        Serial.println("Heartbeat skipped: WiFi Not Connected");
        return false;
    }

    HTTPClient http;

    String url =
        String(SERVER_URL) + "/devices/heartbeat";

    http.begin(url);

    http.addHeader(
        "Content-Type",
        "application/json");

    String body =
        "{"
        "\"device_code\":\"" DEVICE_CODE "\""
        "}";

    int responseCode =
        http.POST(body);

    Serial.print("Heartbeat HTTP Code : ");
    Serial.println(responseCode);

    if (responseCode <= 0)
    {
        http.end();
        return false;
    }

    String payload = http.getString();

    Serial.print("Heartbeat Response : ");
    Serial.println(payload);

    JsonDocument doc;

    DeserializationError error =
        deserializeJson(doc, payload);

    bool success =
        !error && doc["success"];

    http.end();

    return success;
}