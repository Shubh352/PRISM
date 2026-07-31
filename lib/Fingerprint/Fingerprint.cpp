#include "Fingerprint.h"

#include <HardwareSerial.h>
#include <Adafruit_Fingerprint.h>

// ----------------------------
// Private Hardware Objects
// ----------------------------

HardwareSerial mySerial(2);
Adafruit_Fingerprint finger(&mySerial);

// ----------------------------
// Constructor
// ----------------------------

Fingerprint::Fingerprint()
{
}

// ----------------------------
// Initialize Fingerprint Sensor
// ----------------------------

void Fingerprint::begin()
{
    mySerial.begin(57600, SERIAL_8N1, 16, 17);

    finger.begin(57600);

    finger.getTemplateCount();

    Serial.print("Templates = ");
    Serial.println(finger.templateCount);
}

// ----------------------------
// Verify Sensor Connection
// ----------------------------

bool Fingerprint::verifySensor()
{
    return finger.verifyPassword();
}

// ----------------------------
// Placeholder Functions
// ----------------------------

FingerResult Fingerprint::scanFinger()
{
    FingerResult result;

    result.matched = false;
    result.id = 0;
    result.confidence = 0;

    uint8_t p = finger.getImage();

    if (p != FINGERPRINT_OK)
    {
        if (p != FINGERPRINT_NOFINGER)
        {
            Serial.print("getImage() Error: ");
            Serial.println(p);
        }
        return result;
    }

    Serial.println("Image Captured");

    p = finger.image2Tz();

    if (p != FINGERPRINT_OK)
    {
        Serial.print("image2Tz() Error: ");
        Serial.println(p);
        return result;
    }

    Serial.println("Image Converted");

    p = finger.fingerFastSearch();

    if (p != FINGERPRINT_OK)
    {
        Serial.print("fingerSearch() Error: ");
        Serial.println(p);
        return result;
    }

    Serial.println("Fingerprint Found!");

    result.matched = true;
    result.id = finger.fingerID;
    result.confidence = finger.confidence;

    return result;
}

bool Fingerprint::enrollFinger(uint16_t id)
{
    uint8_t p;

    Serial.print("Enrolling Finger ID : ");
    Serial.println(id);

    Serial.println("Place your finger...");

    while ((p = finger.getImage()) != FINGERPRINT_OK)
    {
        if (p == FINGERPRINT_NOFINGER)
            continue;

        Serial.print("getImage Error : ");
        Serial.println(p);
        return false;
    }

    Serial.println("Image Captured");

    p = finger.image2Tz(1);

    if (p != FINGERPRINT_OK)
    {
        Serial.println("Failed to convert first image.");
        return false;
    }

    Serial.println("First Scan Stored");

    Serial.println("Remove Finger...");

    while (finger.getImage() != FINGERPRINT_NOFINGER)
        ;

    delay(2000);

    Serial.println("Place SAME Finger Again...");

    while ((p = finger.getImage()) != FINGERPRINT_OK)
    {
        if (p == FINGERPRINT_NOFINGER)
            continue;

        Serial.print("getImage Error : ");
        Serial.println(p);
        return false;
    }

    Serial.println("Second Image Captured");

    p = finger.image2Tz(2);

    if (p != FINGERPRINT_OK)
    {
        Serial.print("image2Tz(2) Error : ");
        Serial.println(p);
        return false;
    }

    Serial.println("Second Scan Stored");

    p = finger.createModel();

    if (p != FINGERPRINT_OK)
    {
        Serial.println("Fingerprints Do Not Match.");
        return false;
    }

    Serial.println("Model Created");

    p = finger.storeModel(id);

    if (p != FINGERPRINT_OK)
    {
        Serial.print("storeModel Error : ");
        Serial.println(p);
        return false;
    }

    return true;
}

uint16_t Fingerprint::getTemplateCount()
{
    finger.getTemplateCount();
    return finger.templateCount;
}

bool Fingerprint::deleteFinger(uint16_t id)
{
    return false;
}