#ifndef BUTTON_MANAGER_H
#define BUTTON_MANAGER_H

#include <Arduino.h>

class ButtonManager
{
public:

    void begin();

    bool entryJustPressed();

    bool exitJustPressed();

private:

    const uint8_t ENTRY_PIN = 25;
    const uint8_t EXIT_PIN = 26;

    bool lastEntryState = false;
    bool lastExitState = false;
};

#endif