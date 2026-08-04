# PRISM Database Design

## Database Overview

PRISM uses a relational database to manage academic schedules, users, attendance records, devices, and system logs.

The database is designed using normalization principles to minimize redundancy while keeping the attendance engine simple and maintainable.

---

# Core Entities

The following entities form the core of PRISM Version 1.

1. Department
2. Academic Session
3. Schedule
4. Schedule Session
5. User
6. Attendance
7. Device
8. Device Log

---

# Entity Relationships

Department
│
├── Users
│
├── Devices
│
└── Schedule
        │
        └── Schedule Session

Academic Session
        │
        └── Schedule

User
        │
        └── Attendance

Attendance
        │
        └── Device Log

---

# Database Philosophy

The database stores only persistent information.

Attendance rules are never implemented inside the database.

The FastAPI backend is solely responsible for all attendance decisions.

---

# Normalization

The database is normalized to reduce duplication.

Schedules are separated from attendance.

Attendance records are separated from scan logs.

Departments are separated from users.

Devices are separated from attendance records.

---

# Future Expansion

The architecture supports future additions without redesign.

Examples include:

- Multiple ESP32 devices
- Additional departments
- Additional attendance sessions
- Analytics
- Notifications
- Mobile applications