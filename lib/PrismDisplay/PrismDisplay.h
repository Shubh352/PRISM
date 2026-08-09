#ifndef DISPLAY_H
#define DISPLAY_H

#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <RTClib.h>

class PrismDisplay
{
public:
    bool begin();

    void showBootScreen();

    void showClock(
        const DateTime &now);

    void showScanning(
        const String &mode);

    void showSuccess(
        const String &message);

    void showError(
        const String &message);

    void showPending();
};

#endif