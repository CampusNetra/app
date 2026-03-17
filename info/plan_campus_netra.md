# 🧠 CampusNetra — System Design (Part 1: Core + Admin)

---

# 1. 🧱 System Overview

CampusNetra is a **department-scoped communication platform** designed to replace fragmented tools (WhatsApp, Instagram, etc.) with a **structured, real-time academic system**.

---

## Core Philosophy

```txt
Structure → Automation → Real-time → Simplicity
```

---

## System Layers

```txt
1. Identity Layer (users, roles)
2. Academic Structure Layer (dept, section, subject, term)
3. Communication Layer (channels, messages)
4. Real-time Layer (Socket.IO)
5. Admin Control Layer (data ingestion + orchestration)
```

---

# 2. 🧠 High-Level Architecture

```txt
Frontend (Next.js / Mobile)
        ↓
Backend API (Node.js)
        ↓
Service Layer (business logic)
        ↓
Database (MySQL)
        ↓
Socket Layer (real-time events)
```

---

## Key Concept

```txt
API → fetch initial data
Socket → push live updates
```

---

# 3. 🧩 Core Data Relationships

This is the **brain of the system**.

---

## Academic Structure

```txt
Department (MCA)
   ↓
Sections (Section 1, 2, 4)
   ↓
Subjects (DBMS, OS)
   ↓
Subject Offering
   (DBMS + Section 4 + Faculty + Term)
```

---

## Communication Mapping

```txt
Subject Offering → Channel
Section → Channel
Department → Channel
```

---

## User Mapping

```txt
User
  → belongs to Department
  → belongs to Section (students)
  → assigned via Subject Offering (faculty)
```

---

# 4. 🧠 Core System Behavior

The system is **event-driven**, not batch-driven.

---

## Rule

```txt
Admin action → backend triggers → system updates instantly
```

---

## Example

```txt
Assign Faculty → DBMS + Section 4
↓
System:
✔ creates channel
✔ adds students
✔ adds faculty
```

No cron. No delay.

---

# 5. 👑 Admin System (MOST IMPORTANT)

Admin = **system initializer + controller**

---

## Admin Role

```txt
Dept Admin (MCA)
```

Scope is limited to:

```txt
Only their department
```

---

# 6. 🧭 Admin Workflow (FINAL)

---

## Step 0 — Select/Create Term

```txt
Admin creates term (2025_ODD)
Sets it as active
```

👉 All operations scoped to this term

---

## Step 1 — Create Sections

```txt
Admin creates:
MCA Section 1
MCA Section 4
```

---

### System Action

```txt
✔ create section record
✔ create section channel
✔ (no members yet)
```

---

## Step 2 — Import Students (CSV)

### Input Data

```txt
name
reg_no
enrollment_no
email (optional)
section
```

---

### System Processing

```txt
✔ create users (role=student)
✔ assign dept_id
✔ assign section_id
✔ mark verified/pending
```

---

### Auto Linking

```txt
✔ add to:
   - branch channel (MCA ALL)
   - section channel
```

---

## Step 3 — Import Faculty

### Input

```txt
name
email
```

---

### System

```txt
✔ create user (role=faculty)
✔ assign dept_id
```

---

### Auto Linking

```txt
✔ add to branch channel
```

---

## Step 4 — Create Subjects

```txt
DBMS
Operating Systems
```

---

### System

```txt
✔ create subject records
❌ no channels yet
```

---

## Step 5 — Assign Faculty → Subject + Section

### Example

```txt
DBMS → Section 4 → Prof X
```

---

### System Trigger (CRITICAL)

```txt
✔ create subject_offering
✔ ensure channel exists
✔ create channel if needed
✔ add:
   - students of section
   - assigned faculty
```

---

## Step 6 — System Now LIVE

At this point:

```txt
✔ branch chat active
✔ section chats active
✔ subject chats active
✔ real-time messaging works
```

---

# 7. 📡 Channel System

---

## Channel Types

```txt
branch → MCA ALL
section → Section 4
subject → DBMS - Section 4
```

---

## Channel Dependencies

```txt
Branch → dept_id
Section → section_id
Subject → subject_offering_id
```

---

# 8. 🔐 Permission Model

---

## Branch Channel

```txt
SEND → admin, faculty
REPLY → students
READ → all
```

---

## Section Channel

```txt
SEND → students only
READ → students only
NO faculty/admin
```

---

## Subject Channel

```txt
SEND → faculty
REPLY → students + faculty
READ → all members
```

---

# 9. 💬 Message System

---

## Message Types

```txt
text
file
image
announcement
system
```

---

## Threading Model

```txt
parent_id = null → main message
parent_id != null → reply
```

---

## Behavior

```txt
Teacher posts → root
Students reply → threads
```

---

# 10. ⚡ Real-Time System (Socket.IO)

---

## Rooms

```txt
branch:mca
section:mca-4
subject:dbms-mca-4
```

---

## On Login

```txt
User joins:
✔ branch room
✔ section room
✔ subject rooms
```

---

## Events

```txt
new_message
new_announcement
reply
```

---

## Flow

```txt
API → save message
↓
Socket → emit event
↓
clients update instantly
```

---

# 11. 🧠 Data Storage Philosophy

---

## What is stored

```txt
Users → identity
Subjects → master data
Subject Offering → relationships
Channels → communication containers
Messages → communication data
```

---

## What is NOT stored

```txt
❌ duplicate subject channels
❌ redundant mappings
❌ derived data
```

Everything is derived via relationships.

---

# 12. 🧠 Dependency Map (IMPORTANT)

---

## Channel depends on:

```txt
dept / section / subject_offering
```

---

## Subject Channel depends on:

```txt
subject + section + faculty + term
```

---

## Membership depends on:

```txt
user + section + assignment
```

---

## Messages depend on:

```txt
channel
```

---

# 🧠 Summary

CampusNetra is:

```txt
✔ event-driven
✔ normalized
✔ role-based
✔ real-time
✔ auto-linked
✔ scalable
✔ maintainable
```

---


# 🧠 CampusNetra — System Design

# Part 2: Faculty System

---

# 1. 👨‍🏫 Faculty Role Overview

Faculty are not just users — they are:

```txt
Content creators
Communication anchors
Academic authorities
```

They drive:

* announcements
* assignments
* discussions
* engagement

---

# 2. 🔑 Faculty Identity

Faculty are stored in:

```txt
users table
role = faculty
```

---

## Authentication

```txt
Login via:
✔ university email
✔ OTP verification
```

---

## No Password System (MVP)

```txt
OTP → login
```

Simple, secure enough for campus.

---

# 3. 🧠 Faculty Context in System

Each faculty is linked via:

```txt
subject_offerings
```

---

## Meaning:

```txt
Faculty → teaches → Subject → in → Section → during → Term
```

---

## Example

```txt
Prof X
→ DBMS
→ Section 4
→ Term 2025_ODD
```

---

👉 This single mapping gives them:

```txt
✔ access to subject channel
✔ authority to send messages
✔ visibility of students
```

---

# 4. 📡 Faculty Channels

Faculty are automatically added to:

---

## 1️⃣ Branch Channel

```txt
MCA ALL
```

Use case:

* announcements
* department-wide updates

---

## 2️⃣ Subject Channels (primary)

```txt
DBMS - Section 4
OS - Section 2
```

👉 This is their **main workspace**

---

## 🚫 NOT added to

```txt
Section chat (student-only)
```

Important for student freedom.

---

# 5. 💬 Faculty Communication Powers

---

## In Branch Channel

```txt
✔ send announcements
✔ students can reply (thread)
```

---

## In Subject Channel

```txt
✔ send messages
✔ send announcements
✔ reply to students
✔ share files
```

---

# 🧠 Communication Model

```txt
Faculty posts → root message
Students respond → thread replies
```

---

# 6. 🧾 Faculty Actions (Core Features)

---

## 1️⃣ Post Announcement

```txt
Type: announcement
Channel: subject or branch
```

---

### Example

```txt
"Assignment 3 uploaded. Deadline Friday."
```

---

### System Behavior

```txt
✔ saved in messages
✔ broadcast via socket
✔ visible instantly
```

---

## 2️⃣ Share Files

```txt
Type: file
file_url stored
```

---

Use cases:

* notes
* assignments
* PDFs

---

## 3️⃣ Start Discussion

```txt
Type: text
```

Example:

```txt
"Any doubts in normalization?"
```

---

## 4️⃣ Reply to Students

Thread-based replies:

```txt
student question → faculty reply
```

---

# 7. ⚡ Real-Time Faculty Experience

---

## When faculty sends message:

```txt
API → save message
↓
Socket emit → channel room
↓
Students receive instantly
```

---

## No refresh required

System feels like:

```txt
WhatsApp + Structure
```

---

# 8. 🧠 Faculty Dashboard (MVP)

Keep it simple.

---

## Main Screen

```txt
List of channels:

MCA ALL
DBMS - Section 4
OS - Section 2
```

---

## Inside Channel

```txt
Messages (threaded)
Input box
File upload
```

---

## No complex UI needed yet

```txt
❌ no analytics
❌ no attendance
❌ no grading system
```

---

# 9. 🧠 Faculty Dependency Model

---

## Faculty depends on:

```txt
subject_offerings
```

---

## Channels depend on:

```txt
faculty assignment
```

---

## Messages depend on:

```txt
faculty presence in channel
```

---

# 10. 🔄 Dynamic Behavior

---

## When faculty is assigned

```txt
✔ added to channel
✔ channel created if not exists
```

---

## When faculty is removed

```txt
✔ removed from channel
✔ messages remain
```

---

## When new students added

```txt
✔ automatically visible to faculty
```

---

# 11. 🧠 Edge Cases (Handled)

---

## Case 1 — Multiple faculty per subject

```txt
✔ both added to channel
✔ both can send
```

---

## Case 2 — Faculty reassigned

```txt
✔ removed from old channel
✔ added to new
```

---

## Case 3 — No faculty assigned yet

```txt
❌ no subject channel created
```

Clean behavior.

---

# 12. 🧠 What Faculty SHOULD NOT DO (MVP)

---

```txt
❌ create channels manually
❌ manage students
❌ edit structure
❌ access section chat
```

Keep them focused.

---

# 13. 🧠 Faculty System Summary

Faculty system is:

```txt
✔ role-based
✔ assignment-driven
✔ channel-scoped
✔ real-time
✔ minimal UI
✔ high impact
```

---

# 🔥 Key Insight

Your system turns faculty from:

```txt
passive WhatsApp senders
```

into:

```txt
structured content publishers
```

---


# 🧠 CampusNetra — System Design

# Part 3: Student System (MOST CRITICAL)

---

# 1. 👨‍🎓 Student Role Overview

Students are:

```txt
Primary consumers
Secondary contributors
Main growth engine
```

If they don’t like it → app dies
If they like it → admin approval becomes easy

---

# 2. 🔑 Student Identity

Stored in:

```txt
users table
role = student
```

---

## Login

```txt
reg_no / email + OTP (future)
```

---

## Context

Each student is tied to:

```txt
department
section
```

From this, system derives:

```txt
channels
subjects
feed
```

---

# 3. 📡 Student Channel Access

Each student automatically gets:

---

## 1️⃣ Branch Channel

```txt
MCA ALL
```

---

## 2️⃣ Section Channel (🔥 important)

```txt
MCA Section 4
```

---

## 3️⃣ Subject Channels

```txt
DBMS - Section 4
OS - Section 4
```

---

👉 This is their **full communication universe**

---

# 4. 🧠 Student Experience Model

Students don’t think in:

```txt
channels
```

They think in:

```txt
“What’s new?”
“What’s important?”
“What do I need to do?”
```

---

👉 That’s why your **Feed system later = critical**

---

# 5. 💬 Student Permissions (LOCKED)

---

## Branch Channel

```txt
READ → yes
REPLY → yes
SEND → no
```

---

## Section Channel

```txt
READ → yes
SEND → yes
REPLY → yes

NO faculty
NO admin
```

👉 This becomes:

```txt
safe space + informal communication
```

---

## Subject Channel

```txt
READ → yes
REPLY → yes
SEND → no (root)

faculty → send
students → reply
```

---

# 6. 🧠 Student Behavior Flow

---

## Scenario 1 — Announcement

```txt
Teacher posts
↓
Student sees instantly
↓
Student replies (thread)
```

---

## Scenario 2 — Discussion

```txt
Teacher asks question
↓
Students reply in thread
↓
Peer discussion happens
```

---

## Scenario 3 — Section Chat

```txt
Students talk freely
(no faculty pressure)
```

---

# 7. ⚡ Real-Time Experience

---

## When something happens

```txt
Message created
↓
Socket event
↓
UI updates instantly
```

---

Students feel:

```txt
alive system
```

not:

```txt
dead portal
```

---

# 8. 🧠 Student UI (MVP)

Keep it **simple but addictive**

---

## Main Screen

```txt
Tabs:

1. Feed (later)
2. Chats
3. Profile
```

---

## Chats Screen

```txt
Sections:

Branch
Section
Subjects
```

---

Example:

```txt
MCA ALL
Section 4
DBMS
OS
```

---

## Chat Screen

```txt
Messages
Thread replies
Input box
```

---

# 9. 🧠 Psychological Design (VERY IMPORTANT)

Students use apps if:

```txt
✔ fast
✔ simple
✔ relevant
✔ slightly social
```

---

## Why your system works

---

### WhatsApp problem

```txt
spam
lost messages
no structure
```

---

### CampusNetra solution

```txt
structured chats
threads
clear separation
```

---

# 10. 🧠 Adoption Strategy (hidden system design)

---

## Phase 1 — Your Section

```txt
force usage
teacher uses it
students follow
```

---

## Phase 2 — Curiosity Spread

```txt
other sections hear about it
want access
```

---

## Phase 3 — Organic Growth

```txt
more faculty join
more sections onboard
```

---

👉 This is **bottom-up adoption**

---

# 11. 🧠 Future Feature (Feed System — IMPORTANT)

---

## Problem

Students don’t want to open 10 chats.

---

## Solution

```txt
Feed = aggregated important content
```

---

## Feed Sources

```txt
✔ announcements
✔ subject posts
✔ club posts (future)
```

---

## Example Feed

```txt
[DBMS]
Assignment uploaded

[OS]
Class cancelled

[Coding Club]
Hackathon announced
```

---

👉 This will become your **killer feature**

---

# 12. 🧠 Data Flow (Student Side)

---

## On Login

```txt
Fetch:
✔ user info
✔ channels
✔ messages (latest)
```

---

## After that

```txt
Socket handles everything
```

---

# 13. 🧠 Dependency Map (Student)

---

Student depends on:

```txt
section
subject_offerings
channels
```

---

Channels depend on:

```txt
admin + faculty setup
```

---

Messages depend on:

```txt
faculty activity
```

---

# 14. 🧠 Edge Cases

---

## Student changes section

```txt
✔ remove from old channels
✔ add to new
```

---

## Student joins late

```txt
✔ auto-added to all channels
✔ can see history
```

---

## Student inactive

```txt
is_active = false
→ remove access
```

---

# 15. 🧠 What makes students STAY

---

Not features.

But:

```txt
✔ fast updates
✔ useful info
✔ less noise
✔ peer interaction
```

---

# 🧠 Final Student System Summary

```txt
✔ auto-mapped
✔ role-restricted
✔ thread-based
✔ real-time
✔ minimal UI
✔ high engagement potential
```

---

# 🔥 Big Picture (All 3 Parts Together)

---

## Admin

```txt
creates structure
controls system
```

---

## Faculty

```txt
creates content
drives communication
```

---

## Students

```txt
consume + engage
create adoption
```

---

