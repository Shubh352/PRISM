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

FingerResult Fingerprint::authenticate()
{
    FingerResult result;

    result.matched = false;
    result.id = 0;
    result.confidence = 0;

    const int MAX_ATTEMPTS = 5;

    for (int attempt = 1; attempt <= MAX_ATTEMPTS; attempt++)
    {

        uint8_t p;

        // Wait until finger is placed
        p = finger.getImage();

        if (p == FINGERPRINT_NOFINGER)
        {
            return result;
        }

        if (p != FINGERPRINT_OK)
        {
            Serial.print("getImage Error: ");
            Serial.println(p);
            return result;
        }

        Serial.println("Finger Detected!");

        p = finger.image2Tz();

        if (p != FINGERPRINT_OK)
        {
            Serial.println("Bad Finger Position");
            Serial.println("Please adjust finger...");
            waitForFingerRemoval();
            continue;
        }

        p = finger.fingerFastSearch();

        if (p == FINGERPRINT_OK)
        {
            result.matched = true;
            result.id = finger.fingerID;
            result.confidence = finger.confidence;

            Serial.println("Fingerprint Found!");

            return result;
        }

        Serial.println("Fingerprint Not Recognized");
        Serial.println("Please place finger again.");

        waitForFingerRemoval();
    }

    Serial.println("Authentication Failed.");

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

    Serial.println("Model Stored Successfully!");

    finger.getTemplateCount();

    Serial.print("Templates After Store = ");
    Serial.println(finger.templateCount);

    return true;
}

uint16_t Fingerprint::getTemplateCount()
{
    finger.getTemplateCount();
    return finger.templateCount;
}

bool Fingerprint::deleteFinger(uint16_t id)
{
    uint8_t p = finger.deleteModel(id);

    return (p == FINGERPRINT_OK);
}

void Fingerprint::waitForFingerRemoval()
{
    while (finger.getImage() != FINGERPRINT_NOFINGER)
    {
        delay(50);
    }

    delay(200);
}