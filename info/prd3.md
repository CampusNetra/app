# CampusConnect – Faculty Platform PRD

## 1. Overview

The Faculty Platform is a dedicated interface within CampusConnect designed to enable faculty members to efficiently communicate with students, share academic materials, manage class discussions, and broadcast academic announcements.

The platform replaces unstructured communication methods such as WhatsApp groups with structured communication channels aligned with academic hierarchies like branch, section, and subject.

Faculty can access the system through:

* **Mobile Application** – for quick announcements and communication
* **Web Panel** – for academic management tasks such as assignments and content sharing

The design philosophy prioritizes **speed, simplicity, and minimal friction**, ensuring that faculty can perform common actions faster than existing messaging tools.

---

# 2. Goals

## Primary Goals

* Provide faculty with a structured communication tool
* Simplify distribution of assignments and academic materials
* Enable faculty to communicate with multiple sections simultaneously
* Improve visibility of academic announcements
* Reduce dependency on external messaging platforms

## Secondary Goals

* Enable faculty to moderate subject discussions
* Provide insights into student engagement
* Provide future foundation for academic workflow tools

---

# 3. User Roles

## Faculty

Primary users responsible for teaching and communicating with students.

Capabilities include:

* Posting announcements
* Uploading assignments and materials
* Managing subject group chats
* Viewing enrolled students

## Admin

Responsible for assigning faculty to sections and subjects.

---

# 4. Faculty Access

Faculty will log into the system using their institutional email.

Authentication flow:

1. Faculty enters registered email
2. System verifies email in database
3. OTP sent to email
4. Login successful

Upon login, the system identifies assigned subjects and sections automatically.

---

# 5. Faculty Dashboard

The faculty dashboard provides a quick overview of ongoing activities.

## Dashboard Components

### Class Overview

Displays subjects currently taught.

Example:

DBMS – MCA Section 4
Operating Systems – MCA Section 3

### Pending Student Messages

Shows unread student queries.

### Active Assignments

Displays assignments with upcoming deadlines.

### Recent Announcements

Lists recently posted announcements.

---

# 6. Core Features (MVP)

## 6.1 Announcement Posting

Faculty can post announcements to specific academic groups.

Supported target scopes:

* Subject group
* Section group
* Entire branch

### Announcement Fields

Title
Content
Target Audience
Attachment (optional)
Notification priority

### Example

Title: Assignment 3 Released
Target: DBMS – Section 4
Attachment: assignment3.pdf

Announcements appear in:

* Student feed
* Subject chat (pinned)

---

## 6.2 Assignment Posting

Faculty can create assignment posts for their subjects.

### Assignment Fields

Title
Description
Subject
Section
Due Date
Attachments

### Example

Title: DBMS Assignment 3
Subject: DBMS – Section 4
Due Date: 25 March

Students receive the assignment in their feed.

---

## 6.3 Material Sharing

Faculty can upload lecture materials for students.

### Supported Files

PDF
PPT
DOC
Images

### Example Materials

Lecture Notes
Slides
Reference Documents

Students can download materials at any time.

---

## 6.4 Subject Chat Management

Faculty members moderate subject chat channels.

Capabilities include:

Pin message
Delete message
Lock chat temporarily
Send announcements inside chat

Pinned messages remain visible to students.

---

## 6.5 Multi-Section Posting

Faculty teaching multiple sections can post announcements to multiple sections simultaneously.

Example:

Target Sections:

Section 1
Section 2
Section 4

A single announcement is distributed to all selected sections.

---

## 6.6 Student Directory

Faculty can view a list of students in their assigned sections.

### Student Profile Information

Name
Registration Number
Section
Branch

Faculty can optionally message students individually.

---

# 7. Chat Moderation

Faculty members have moderation privileges within subject channels.

Moderation actions include:

Delete inappropriate messages
Mute students temporarily
Restrict chat activity during exams
Lock chat channels temporarily

These tools help maintain academic discipline within communication channels.

---

# 8. Notifications

Faculty can control notification levels for announcements.

### Notification Types

Push Notification
Email Notification
Silent Post

Critical announcements may trigger immediate push notifications.

---

# 9. Faculty Web Panel

Some tasks are more convenient on desktop devices.

The web panel provides additional management features.

## Web Panel Features

Assignment management
Material library
Announcement history
Student lists
Analytics dashboard

---

# 10. Analytics

Faculty members can view engagement metrics for their announcements and materials.

### Example Metrics

Announcement views
Material downloads
Student participation in chats

These insights help faculty assess student engagement.

---

# 11. Permissions Model

| Action             | Faculty | Student |
| ------------------ | ------- | ------- |
| Post announcement  | Yes     | No      |
| Upload assignments | Yes     | No      |
| Send chat message  | Yes     | Yes     |
| Pin messages       | Yes     | No      |
| Delete messages    | Yes     | No      |

---

# 12. Data Model

## Faculty

id
name
email
department

---

## Faculty Assignments

faculty_id
subject_id
section_id

Defines which subjects a faculty member teaches.

---

## Announcements

id
author_id
target_scope
content
attachment
priority
created_at

---

## Assignments

id
subject_id
section_id
title
description
due_date
attachment
created_at

---

## Materials

id
subject_id
title
file_url
uploaded_by
created_at

---

# 13. Non-Functional Requirements

### Usability

Faculty must be able to create announcements within 10 seconds.

### Reliability

System must maintain high availability during academic periods.

### Performance

Real-time messaging must maintain low latency.

### Security

Only authorized faculty can post announcements.

---

# 14. Future Features (Post-MVP)

## Assignment Submission System

Students can upload assignment files directly to the platform.

Faculty can review submissions.

---

## Quiz System

Faculty can conduct quizzes and polls inside the platform.

---

## Attendance Tracking

Faculty can record attendance for each class.

---

## Scheduled Announcements

Faculty can schedule announcements for future times.

---

## Academic Calendar Integration

Faculty announcements can integrate with official academic schedules.

---

## Event and Workshop Management

Faculty organizing workshops can manage registrations through the platform.

---

# 15. Long-Term Vision

The Faculty Platform will evolve into a comprehensive academic management system supporting:

Assignment workflows
Course material management
Student engagement analytics
Classroom collaboration tools

Ultimately, the platform aims to provide faculty with a modern alternative to fragmented communication tools currently used in academic environments.

---

End of Document
