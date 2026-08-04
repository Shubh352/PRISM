# PRISM Architecture

## High Level Architecture

```
ESP32
   │
Fingerprint
   │
WiFi
   │
REST API
   │
FastAPI Backend
   │
Business Logic
   │
MySQL Database
   │
Next.js Dashboard
```

---

# Backend Philosophy

The backend is the brain of PRISM.

Responsibilities:

- Validate users
- Validate attendance windows
- Determine attendance status
- Record attendance
- Handle synchronization
- Generate reports

The ESP32 never decides attendance.

---

# ESP32 Philosophy

Responsibilities:

- Read fingerprint
- Read button presses
- Display OLED messages
- Store offline records
- Synchronize records

No attendance rules exist inside the firmware.

---

# Dashboard Philosophy

Dashboard responsibilities:

- User Management
- Schedule Management
- Attendance Reports
- Analytics
- Device Monitoring

Dashboard never performs attendance calculations.

---

# Database Philosophy

Database stores only persistent information.

Business logic remains inside FastAPI services.

No attendance logic should be implemented through SQL triggers.

---

# Design Principles

- Single Responsibility Principle
- Separation of Concerns
- Configuration over Hardcoding
- Offline First
- Modular Design