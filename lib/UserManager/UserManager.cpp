#include "UserManager.h"

void UserManager::begin()
{
}

User UserManager::getUser(uint16_t fingerprintID)
{
    User user;

    switch (fingerprintID)
    {
    case 1:
        user.fingerprintID = 1;
        user.rollNumber = "2025ctm001";
        user.name = "Shubham Swami";
        user.department = "FPNS";
        user.semester = 3;
        user.type = UserType::STUDENT;
        break;

    case 2:
        user.fingerprintID = 2;
        user.rollNumber = "2025ctm002";
        user.name = "Amisha Jha";
        user.department = "FPNS";
        user.semester = 3;
        user.type = UserType::STUDENT;
        break;

    case 3:
        user.fingerprintID = 3;
        user.rollNumber = "2025ctm003";
        user.name = "Apala Mitra";
        user.department = "FPNS";
        user.semester = 3;
        user.type = UserType::STUDENT;
        break;

    default:
        user.fingerprintID = fingerprintID;
        user.rollNumber = "UNKNOWN";
        user.name = "Unknown User";
        user.department = "";
        user.semester = 0;
        user.type = UserType::STUDENT;
        break;
    }

    return user;
}