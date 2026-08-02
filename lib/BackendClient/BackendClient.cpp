#include "BackendClient.h"

#include <WiFi.h>
#include <HTTPClient.h>

bool BackendClient::sendAttendance(uint16_t fingerprintID)
{
    HTTPClient http;

    http.begin("http://10.40.120.54:8000/attendance");

    http.addHeader("Content-Type", "application/json");

    String body =
        "{\"fingerprint_id\": " +
        String(fingerprintID) +
        ", \"device_id\": \"PRISM-FPNS-01\"}";

    int responseCode = http.POST(body);

    Serial.print("HTTP Response : ");
    Serial.println(responseCode);

    if (responseCode > 0)
    {
        String response = http.getString();

        Serial.println(response);
    }

    http.end();

    return responseCode == 200;
}