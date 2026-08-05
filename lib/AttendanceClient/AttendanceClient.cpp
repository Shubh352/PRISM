#include "AttendanceClient.h"

#include <HTTPClient.h>
#include <WiFi.h>

#include "Config.h"
#include <ArduinoJson.h>

AttendanceResponse AttendanceClient::sendAttendance(
    uint16_t fingerprintId)
{
    AttendanceResponse response;
    if (WiFi.status() != WL_CONNECTED)
    {
        Serial.println("WiFi Not Connected");
        response.success = false;
        response.message = "WiFi Not Connected";

        return response;
    }

    HTTPClient http;

    String url = String(SERVER_URL) + "/attendance";
    http.begin(url);

    http.addHeader(
        "Content-Type",
        "application/json");

    String body =
        "{"
        "\"fingerprint_id\":" +
        String(fingerprintId) +
        ","
        "\"device_code\":\"ESP32-FPNS-001\","
        "\"action\":\"MORNING_ENTRY\""
        "}";

    int responseCode =
        http.POST(body);

    Serial.print("HTTP Code : ");
    Serial.println(responseCode);

    if (responseCode > 0)
    {
        String payload = http.getString();

        Serial.println(payload);

        JsonDocument doc;

        DeserializationError error =
            deserializeJson(doc, payload);

        if (!error)
        {
            response.success =
                doc["success"];

            response.message =
                doc["message"].as<String>();
        }
        else
        {
            response.success = false;
            response.message = "Invalid JSON";
        }
    }
    else
    {
        response.success = false;
        response.message = "HTTP Request Failed";
    }

    http.end();

    return response;
}