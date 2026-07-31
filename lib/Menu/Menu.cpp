#include "Menu.h"

Menu::Menu()
{
}

void Menu::begin()
{
}

int Menu::run()
{
    Serial.println();
    Serial.println("========== PRISM MENU ==========");
    Serial.println("1. Enroll Finger");
    Serial.println("2. Scan Finger");
    Serial.println("3. Delete Finger");
    Serial.println("4. Count Templates");
    Serial.print("Enter Choice : ");

    while (!Serial.available());

    int choice = Serial.parseInt();

    Serial.readStringUntil('\n');

    return choice;

    delay(300);
}