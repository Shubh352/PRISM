#include "SDCardManager.h"

#include <SPI.h>
#include <SD.h>

#include "Config.h"

bool SDCardManager::begin()
{
    SPI.begin(
        SD_SCK_PIN,
        SD_MISO_PIN,
        SD_MOSI_PIN,
        SD_CS_PIN);

    if (!SD.begin(SD_CS_PIN))
    {
        Serial.println("SD Card Mount Failed");
        return false;
    }

    if (!createPrismFolder())
    {
        Serial.println("Failed to create PRISM folder");
        return false;
    }

    Serial.println("SD Card Mounted");

    return true;
}

bool SDCardManager::createPrismFolder()
{
    if (!SD.exists("/PRISM"))
    {
        return SD.mkdir("/PRISM");
    }

    return true;
}

bool SDCardManager::exists(const char *path)
{
    return SD.exists(path);
}

bool SDCardManager::createDirectory(const char *path)
{
    return SD.mkdir(path);
}

File SDCardManager::open(const char *path, const char *mode)
{
    return SD.open(path, mode);
}

bool SDCardManager::remove(const char *path)
{
    return SD.remove(path);
}

bool SDCardManager::rename(
    const char *oldPath,
    const char *newPath)
{
    return SD.rename(oldPath, newPath);
}