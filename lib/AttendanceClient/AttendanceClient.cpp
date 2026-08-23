#include "AttendanceClient.h"

#include <HTTPClient.h>
#include <WiFi.h>

#include "Config.h"
#include <ArduinoJson.h>

AttendanceResponse AttendanceClient::sendAttendance(
    const AttendanceRecord &record)
{
    AttendanceResponse response;

    if (WiFi.status() != WL_CONNECTED)
    {
        Serial.println("WiFi Not Connected");

        response.success = false;
        response.delivered = false;
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
        "\"record_id\":\"" +
        record.recordId +
        "\","
        "\"fingerprint_id\":" +
        String(record.fingerprintId) +
        ","
        "\"device_code\":\"" DEVICE_CODE "\","
        "\"scan_timestamp\":\"" +
        record.timestamp.timestamp(DateTime::TIMESTAMP_FULL) +
        "\""
        "}";

    Serial.println("========== JSON ==========");
    Serial.println(body);
    Serial.println("==========================");

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

            response.delivered = true;
        }
        else
        {
            response.success = false;
            response.delivered = false;
            response.message = "Invalid JSON";
        }
    }
    else
    {
        response.success = false;
        response.delivered = false;
        response.message = "HTTP Request Failed";
    }

    http.end();

    return response;
}