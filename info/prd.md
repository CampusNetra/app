# CampurNetra – Product Requirements Document (PRD)

## 1. Product Overview

CampurNetra is a structured campus communication platform designed to replace fragmented communication channels such as WhatsApp groups, Instagram announcements, and unofficial student chats used within universities.

The system provides a centralized platform where students, faculty, departments, and clubs can communicate efficiently using structured feeds, announcements, and organized group chats.

The platform aims to solve the common problem of information fragmentation within universities where important updates are lost across multiple channels.

CampurNetra provides:

- A unified campus announcement feed
- Structured academic communication channels
- Section-based and subject-based chat groups
- Club updates and event notifications
- Automated channel management based on student enrollment data

The system will initially be deployed as a **Minimum Viable Product (MVP)** for a single department and later expanded to the entire university.

---

# 2. Problem Statement

Universities currently rely on unstructured communication methods such as:

- WhatsApp groups for each subject
- Separate WhatsApp groups for each section
- Instagram pages for clubs
- Informal student networks for information sharing
- Notice boards for official announcements

This leads to several issues:

### Information Fragmentation

Students must monitor multiple platforms to stay updated.

### Important Information Loss

Critical announcements (exam updates, assignment deadlines) often get buried under casual messages.

### Lack of Official Channels

Departments and clubs lack a unified official communication system.

### Poor Discoverability of Campus Activities

Many students remain unaware of events, workshops, and opportunities.

CampurNetra aims to solve these problems by introducing structured communication infrastructure for the campus.

---

# 3. Product Goals

### Primary Goals

1. Provide a centralized information feed for all campus updates
2. Replace multiple WhatsApp groups with structured communication channels
3. Enable faculty to communicate with students efficiently
4. Improve visibility of campus events and opportunities
5. Provide a scalable platform for campus-wide communication

### Secondary Goals

- Enable clubs to reach interested students
- Improve student engagement with campus activities
- Provide future foundation for a campus digital ecosystem

---

# 4. Target Users

## Students

Primary consumers of campus information and participants in section and subject discussions.

## Faculty

Responsible for posting assignments, academic announcements, and interacting with students.

## Administration

Responsible for system setup, user management, and university-wide announcements.

---

# 5. Product Architecture

The platform consists of three primary applications:

### 1. Admin Panel (Web Application)

Used by department administrators and IT staff to manage data and system configuration.

Responsibilities:

- Import student records
- Import faculty records
- Assign faculty to subjects and sections
- Manage clubs
- Monitor platform activity

---

### 2. Faculty Interface

Used by faculty members to communicate with students.

Capabilities:

- Post announcements
- Upload assignments
- Participate in subject group discussions
- View student interactions

---

### 3. Student Application

Primary user-facing platform for students.

Features:

- Personalized campus feed
- Subject group chats
- Section chat groups
- Club updates
- Event notifications

---

# 6. Core MVP Features

## 6.1 Campus Feed

The feed aggregates posts from three sources:

### University / Department Announcements

Official notices from administration.

Examples:

- Exam schedules
- Academic calendar updates
- Policy changes

### Faculty Posts

Subject-specific announcements and assignments.

Examples:

- Assignment uploads
- Lecture material
- Class schedule changes

### Club Posts

Updates from student clubs and organizations.

Examples:

- Event announcements
- Workshops
- Competitions

Feed content is personalized based on:

- Department
- Section
- Enrolled subjects
- Followed clubs

---

## 6.2 Chat System

The chat system consists of structured communication groups.

### Branch Group

Example:

MCA ALL

Members:

- All MCA students
- Department faculty
- Department heads

Purpose:
Department-wide announcements and discussions.

Permissions:
Primarily read-only for students (to prevent spam).

---

### Section Group

Example:

MCA Section 4

Members:

- All students in the section
- Class mentor
- Class representative

Purpose:
Section-level discussions and coordination.

---

### Subject Groups

Example:

DBMS – Section 4

Members:

- Subject faculty
- Students enrolled in the subject

Purpose:
Academic discussion, assignment communication, clarifications.

---

# 7. System Setup Process

The system will initially import student and faculty data from the university ERP system via CSV files.

### Step 1 – Student Data Import

Admins export student data from ERP and upload it into the system.

Example CSV:

reg_no,enrollment_no,name,email,branch,year,section
2201345,ENR2022MCA034,Sumit Srivastava,[sumit@university.edu](mailto:sumit@university.edu),MCA,1,4

The system validates and inserts data into the database.

---

### Step 2 – Faculty Data Import

Example CSV:

faculty_id,name,email,department
F102,Dr Sharma,[sharma@university.edu](mailto:sharma@university.edu),MCA

---

### Step 3 – Faculty Assignment

Admins assign faculty to subjects and sections.

Example:

Faculty: Dr Sharma
Subject: DBMS
Section: MCA 4

The system automatically creates the subject channel and enrolls all relevant students.

---

# 8. Authentication

Users log in using their institutional email.

Login Flow:

1. User enters email
2. System verifies email in database
3. OTP sent to email
4. User logs in

Roles are automatically assigned:

- Admin
- Faculty
- Student

---

# 9. Data Model

## Users

| Field   | Description               |
| ------- | ------------------------- |
| id      | Unique user identifier    |
| name    | Full name                 |
| email   | Institutional email       |
| role    | student / faculty / admin |
| branch  | Academic branch           |
| section | Section number            |

---

## Channels

| Field   | Description                      |
| ------- | -------------------------------- |
| id      | Channel ID                       |
| name    | Channel name                     |
| type    | section / subject / announcement |
| branch  | Associated branch                |
| section | Associated section               |

---

## Channel Members

| Field      | Description        |
| ---------- | ------------------ |
| user_id    | User identifier    |
| channel_id | Channel identifier |

---

## Messages

| Field      | Description                  |
| ---------- | ---------------------------- |
| id         | Message ID                   |
| channel_id | Channel where message posted |
| sender_id  | Message sender               |
| content    | Message text                 |
| attachment | Optional file                |
| created_at | Timestamp                    |

---

## Feed Posts

| Field            | Description             |
| ---------------- | ----------------------- |
| id               | Post ID                 |
| author_id        | Creator                 |
| visibility_scope | branch / section / club |
| content          | Post text               |
| attachment       | Optional files          |
| created_at       | Timestamp               |

---

# 10. Permissions Model

| Role    | Feed Posting | Chat Messaging    |
| ------- | ------------ | ----------------- |
| Admin   | Allowed      | Allowed           |
| Faculty | Allowed      | Allowed           |
| Student | Not allowed  | Allowed in groups |

Students cannot post to the main feed to prevent spam.

---

# 11. Security & Moderation

Basic moderation measures include:

- Identity-linked accounts
- Reporting mechanism
- Admin moderation dashboard
- Content filtering
- Permission-based posting

---

# 12. Non-Functional Requirements

### Scalability

System must support thousands of students.

### Reliability

High availability during academic periods.

### Security

Authentication and role-based access control.

### Performance

Real-time messaging with low latency.

---

# 13. Future Roadmap (Post-MVP)

## Assignment Management

Faculty can create assignments with deadlines and submission portals.

---

## Campus Events System

Students can register for workshops, hackathons, and competitions.

---

## Club Management

Clubs can manage members, events, and announcements.

---

## Campus Marketplace

Students can buy and sell books, electronics, and academic materials.

---

## Academic Calendar Integration

Timetable and exam schedules integrated into the platform.

---

## Push Notifications

Real-time alerts for critical announcements.

---

## Attendance Tracking

Integration with academic attendance systems.

---

## Campus Services

Future integration with services such as:

- library systems
- hostel management
- transport updates

---

# 14. Long-Term Vision

CampurNetra aims to evolve into a **Campus Operating System** that digitizes and centralizes all student and faculty interactions within the university.

Potential expansion includes:

- multi-university deployments
- campus analytics dashboards
- academic resource platforms
- institutional collaboration tools

---

# 15. Success Metrics

- Student adoption rate
- Faculty engagement
- Number of announcements delivered
- Reduction in unofficial communication channels
- Event participation increases

---

# 16. MVP Deployment Plan

Phase 1: Pilot launch in one department
Phase 2: Expand to entire university
Phase 3: Introduce advanced modules and integrations

---

End of Document
