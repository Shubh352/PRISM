#ifndef WIFI_MANAGER_H
#define WIFI_MANAGER_H

#include <WiFi.h>

class WiFiManager
{
public:

    void begin(
        const char* ssid,
        const char* password
    );

    bool isConnected();

    void maintainConnection();

private:

    const char* savedSSID = nullptr;
    const char* savedPassword = nullptr;

    unsigned long lastReconnectAttempt = 0;

    static const unsigned long RECONNECT_INTERVAL = 10000;
};

#endif