#include "PrismDisplay.h"

#include <Wire.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

Adafruit_SSD1306 display(
    SCREEN_WIDTH,
    SCREEN_HEIGHT,
    &Wire,
    -1
);

bool PrismDisplay::begin()
{
    if(!display.begin(
        SSD1306_SWITCHCAPVCC,
        0x3C
    ))
    {
        return false;
    }

    display.clearDisplay();
    display.setTextColor(SSD1306_WHITE);
    display.display();

    return true;
}

void PrismDisplay::showBootScreen()
{
    display.clearDisplay();

    display.setTextSize(2);
    display.setCursor(5,10);
    display.println("PRISM");

    display.setTextSize(1);
    display.setCursor(10,40);
    display.println("Initializing...");

    display.display();
}

void PrismDisplay::showClock(
    const DateTime& now
)
{
    display.clearDisplay();

    display.setTextSize(1);

    display.setCursor(0,0);
    display.println("PROJECT PRISM");

    display.setCursor(0,20);

    display.print(now.day());
    display.print("/");
    display.print(now.month());
    display.print("/");
    display.println(now.year());

    display.setCursor(0,40);

    display.print(now.hour());
    display.print(":");

    if(now.minute() < 10)
        display.print("0");

    display.print(now.minute());

    display.print(":");

    if(now.second() < 10)
        display.print("0");

    display.println(now.second());

    display.display();
}