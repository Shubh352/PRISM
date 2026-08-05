#include "BuzzerManager.h"

void BuzzerManager::begin()
{
    pinMode(BUZZER_PIN, OUTPUT);

    digitalWrite(BUZZER_PIN, LOW);
}

void BuzzerManager::successBeep()
{
    digitalWrite(BUZZER_PIN, HIGH);
    delay(100);
    digitalWrite(BUZZER_PIN, LOW);
}

void BuzzerManager::errorBeep()
{
    digitalWrite(BUZZER_PIN, HIGH);
    delay(500);
    digitalWrite(BUZZER_PIN, LOW);
}

void BuzzerManager::scanFailBeep()
{
    for (int i = 0; i < 2; i++)
    {
        digitalWrite(BUZZER_PIN, HIGH);
        delay(80);

        digitalWrite(BUZZER_PIN, LOW);
        delay(80);
    }
}