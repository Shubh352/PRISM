#include "ButtonManager.h"

void ButtonManager::begin()
{
    pinMode(ENTRY_PIN, INPUT_PULLUP);
    pinMode(EXIT_PIN, INPUT_PULLUP);
}

bool ButtonManager::entryJustPressed()
{
    bool current = (digitalRead(ENTRY_PIN) == LOW);

    bool pressed = current && !lastEntryState;

    lastEntryState = current;

    return pressed;
}

bool ButtonManager::exitJustPressed()
{
    bool current = (digitalRead(EXIT_PIN) == LOW);

    bool pressed = current && !lastExitState;

    lastExitState = current;

    return pressed;
}