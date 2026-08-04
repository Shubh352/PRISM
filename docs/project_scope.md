# PRISM - Project Scope

## Project Name

PRISM

(Project for Real-time Intelligent Student Presence Monitoring)

---

# Vision

PRISM is a Department Resource & Attendance Management Platform designed to automate attendance using fingerprint authentication while supporting flexible academic schedules, offline operation, and centralized management.

Version 1 focuses on replacing manual attendance registers with a reliable fingerprint-based attendance system.

---

# Objectives

- Eliminate manual attendance registers.
- Record attendance using fingerprint authentication.
- Support different schedules for different departments and semesters.
- Support offline attendance using SD Card.
- Automatically synchronize offline records when Wi-Fi becomes available.
- Provide a modern dashboard for administrators.

---

# Version 1 Modules

## Academic Management

- Departments
- Academic Sessions
- Schedules
- Schedule Sessions

## User Management

- Students
- Faculty
- PhD Scholars

## Attendance

- Morning Entry
- Afternoon Entry
- Punch Out
- Reports

## Device Management

- ESP32
- Fingerprint Sensor
- OLED Display
- SD Card
- Device Logs

## Dashboard

- User Management
- Schedule Management
- Attendance Reports
- Device Monitoring

---

# Out of Scope (Version 1)

The following features are intentionally excluded:

- Face Recognition
- QR Attendance
- RFID Attendance
- Visitor Management
- Hostel Attendance
- Mobile Application
- SMS Notifications
- Email Notifications

---

# Design Philosophy

The backend owns all attendance logic.

The ESP32 acts only as an input/output device.

Attendance behavior must be configurable through schedules rather than hardcoded values.

The system must continue operating even when the network is unavailable.

Future modules should be added without redesigning the core architecture.