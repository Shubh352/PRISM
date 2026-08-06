#ifndef SD_CARD_MANAGER_H
#define SD_CARD_MANAGER_H

#include <Arduino.h>
#include <FS.h>

class SDCardManager
{
public:
    bool begin();

    bool exists(const char *path);

    bool createDirectory(const char *path);

    File open(const char *path, const char *mode);

    bool remove(const char *path);

    bool rename(
        const char *oldPath,
        const char *newPath);

private:
    bool createPrismFolder();
};

#endif