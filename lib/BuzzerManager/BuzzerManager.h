#ifndef BUZZER_MANAGER_H
#define BUZZER_MANAGER_H

#include <Arduino.h>

class BuzzerManager
{
public:

    void begin();

    void successBeep();

    void errorBeep();

    void scanFailBeep();

private:

    const uint8_t BUZZER_PIN = 27;
};

#endif