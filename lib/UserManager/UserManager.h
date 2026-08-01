#ifndef USER_MANAGER_H
#define USER_MANAGER_H

#include <Arduino.h>

enum class UserType
{
    STUDENT,
    FACULTY,
    ADMIN
};

struct User
{
    uint16_t fingerprintID;

    String rollNumber;

    String name;

    String department;

    uint8_t semester;

    UserType type;
};

class UserManager
{
public:

    void begin();

    User getUser(uint16_t fingerprintID);

};

#endif