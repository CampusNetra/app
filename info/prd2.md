# CampusConnect – Academic Lifecycle & Data Architecture PRD

## 1. Document Purpose

This document defines the **academic lifecycle model, data architecture, and operational workflows** for the CampusConnect platform.

The purpose of this PRD is to ensure that the platform correctly models the **temporal nature of academic institutions**, including:

* student progression across years and semesters
* academic term management
* subject offerings per semester
* automatic channel management
* graduation and alumni transitions

Without this lifecycle modeling, the system would fail to handle real-world university operations such as promotions, semester changes, and alumni management.

---

# 2. Academic Lifecycle Overview

University students move through structured academic stages over time.

The platform must support the following lifecycle:

```
Admission
↓
Year 1 / Semester 1
↓
Year 1 / Semester 2
↓
Year 2 / Semester 3
↓
Year 2 / Semester 4
↓
Graduation
↓
Alumni
```

CampusConnect must track these changes while preserving historical academic records.

---

# 3. Core Academic Entities

The academic structure of the system follows this hierarchy:

```
University
   └── Branch / Program
           └── Batch
                   └── Section
                           └── Subjects
```

Example:

```
Branch: MCA
Batch: 2025–2027
Section: MCA Section 4
Subjects:
    - Database Systems
    - Operating Systems
    - Computer Networks
```

---

# 4. Academic Term System

Universities operate in **academic terms**, typically semesters.

CampusConnect must support a flexible term system.

### Academic Terms

Academic terms represent a teaching period.

Examples:

| Term Name | Type       |
| --------- | ---------- |
| 2025_ODD  | Semester 1 |
| 2025_EVEN | Semester 2 |

---

### Academic Term Table

| Field      | Description        |
| ---------- | ------------------ |
| id         | Unique identifier  |
| name       | Term name          |
| start_date | Term start         |
| end_date   | Term end           |
| status     | active / completed |

---

# 5. Batch Management

A **batch** represents a group of students admitted in the same academic year.

Example:

```
MCA Batch 2025–2027
```

This allows the system to track:

* graduation timelines
* alumni groups
* academic progression

---

### Batch Table

| Field      | Description                 |
| ---------- | --------------------------- |
| id         | Unique identifier           |
| branch_id  | Associated academic program |
| start_year | Admission year              |
| end_year   | Graduation year             |

---

# 6. Student Lifecycle States

Students transition through multiple states during their academic journey.

### Student Status

| Status    | Description                 |
| --------- | --------------------------- |
| active    | Currently enrolled          |
| suspended | Temporarily restricted      |
| graduated | Completed course            |
| alumni    | Converted to alumni account |

---

### Lifecycle Transition Example

```
Active Student
↓
Graduated
↓
Alumni
```

When a student becomes **alumni**, their access to certain channels is restricted.

---

# 7. Enrollment System

Rather than storing academic information directly on the user record, CampusConnect maintains **enrollment records**.

This allows the system to track **historical academic data**.

---

### Enrollment Table

| Field      | Description              |
| ---------- | ------------------------ |
| id         | Unique enrollment record |
| user_id    | Student reference        |
| branch_id  | Academic program         |
| section_id | Assigned section         |
| year       | Academic year            |
| semester   | Current semester         |
| term_id    | Associated academic term |
| status     | active / archived        |

---

### Example Enrollment Record

```
User: Sumit Srivastava
Branch: MCA
Section: 4
Year: 1
Semester: 1
Term: 2025_ODD
Status: Active
```

At the next semester, a new enrollment record is created.

---

# 8. Promotion System

At the end of an academic term, administrators perform **student promotion**.

Promotion workflow:

```
Current semester completed
↓
Admin triggers promotion
↓
System creates new enrollment record
↓
Year and semester updated
↓
Channels automatically updated
```

---

# 9. Subject Offering Model

Subjects are not static across the system.

Each subject must be offered **per section and per term**.

Example:

```
Subject: Database Systems
Section: MCA Section 4
Term: 2025_ODD
Faculty: Dr Sharma
```

---

### Subject Offerings Table

| Field      | Description         |
| ---------- | ------------------- |
| id         | Offering identifier |
| subject_id | Subject reference   |
| section_id | Section reference   |
| faculty_id | Assigned faculty    |
| term_id    | Academic term       |
| status     | active / archived   |

---

# 10. Automatic Channel Creation

CampusConnect automatically creates communication channels based on subject offerings.

Example:

```
Subject: DBMS
Section: 4
Term: 2025_ODD
```

Channel created:

```
DBMS – Section 4
```

Members automatically added:

* assigned faculty
* all enrolled students

---

# 11. Channel Membership Rules

Channels update dynamically based on enrollment and status changes.

### When Student Joins

Added to:

* branch channel
* section channel
* subject channels

### When Student Graduates

Removed from:

* subject channels
* section channels

May remain in:

* branch announcements
* alumni channels

---

# 12. Alumni Conversion

When a batch completes its program:

```
Batch completed
↓
Student status → graduated
↓
Converted to alumni
```

Alumni may be given access to optional channels such as:

```
MCA Alumni Network
Career Opportunities
Mentorship Programs
```

---

# 13. Section Lifecycle

Sections exist only during a batch lifecycle.

Example:

```
MCA Section 4 (2025 Batch)
```

Once the batch graduates, the section is archived.

---

### Section Status

| Status   | Meaning              |
| -------- | -------------------- |
| active   | currently in use     |
| archived | historical reference |

Archived sections remain in the system for data consistency.

---

# 14. Administrative Controls

Administrators must have tools to manage the academic lifecycle.

### Required Admin Operations

* create academic term
* import new batch of students
* promote students to next semester
* graduate batch
* archive sections
* assign faculty to subjects

---

# 15. Automated System Workflows

## Student Promotion

```
Admin clicks "Promote Students"
↓
New enrollment records created
↓
Section membership updated
↓
New subject channels created
```

---

## Batch Graduation

```
Batch end year reached
↓
Students marked as graduated
↓
Converted to alumni
↓
Removed from academic channels
```

---

# 16. Database Architecture Summary

Core tables supporting academic lifecycle:

```
users
branches
sections
subjects

batches
academic_terms

enrollments
subject_offerings

channels
channel_members
messages

posts
post_targets

clubs
club_members

reports
notifications
audit_logs
```

This structure ensures:

* academic history preservation
* scalable channel management
* flexible subject assignments
* automated lifecycle management

---

# 17. Future Lifecycle Features

Future versions of CampusConnect may include:

### Timetable Management

Class schedule integration per section.

### Assignment Tracking

Assignment submissions and grading.

### Attendance System

Faculty attendance recording.

### Placement Tracking

Batch-level placement statistics.

### Alumni Engagement

Mentorship programs and job networks.

---

# 18. Design Principles

The lifecycle system follows several core principles:

1. **Historical Accuracy**
   Academic records should never be overwritten.

2. **Automation First**
   Channels and memberships must update automatically.

3. **Scalability**
   The architecture must support thousands of students.

4. **Administrative Simplicity**
   Complex academic processes should require minimal manual intervention.

---

# 19. Long-Term Vision

The academic lifecycle model forms the foundation for transforming CampusConnect into a **complete campus operating system** capable of managing:

* communication
* academic workflows
* student lifecycle
* alumni engagement
* institutional analytics

---

End of Document
