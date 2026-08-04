# PRISM Entity Relationship Diagram

## Database Entities

1. Department
2. AcademicSession
3. Schedule
4. ScheduleSession
5. User
6. Attendance
7. Device
8. DeviceLog

---

## Relationships

Department
│
├── User
│
├── Device
│
└── Schedule
        │
        └── ScheduleSession

AcademicSession
        │
        └── Schedule

User
        │
        └── Attendance

Attendance
        │
        └── DeviceLog

---

(Professional ER Diagram will be added here.)