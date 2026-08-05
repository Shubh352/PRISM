#include "AttendanceClient.h"

#include <HTTPClient.h>
#include <WiFi.h>

#include "Config.h"

bool AttendanceClient::sendAttendance(
    uint16_t fingerprintId)
{
    if (WiFi.status() != WL_CONNECTED)
    {
        Serial.println("WiFi Not Connected");
        return false;
    }

    HTTPClient http;

    String url = String(SERVER_URL) + "/attendance";
    http.begin(url);

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
        Serial.println(
            http.getString());
    }

    http.end();

    return (responseCode == 200);
}