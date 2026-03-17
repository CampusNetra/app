# 📄 CampusNetra — Admin Authentication PRD

---

## 🎯 Objective

Enable Department Admins to securely:

* Create an account (Signup)
* Login using email + password
* Access admin dashboard scoped to their department

---

## 👤 User Type

**Role:** `dept_admin`
**Example:** MCA Admin

---

## 🧠 System Scope

### ✅ In Scope

* Admin Signup
* Admin Login (Password-based)
* Session management (JWT)

### ❌ Out of Scope (MVP)

* OTP login
* Email verification
* Multi-factor authentication

---

## 🎨 Design System (From Logo)

### Primary Colors

| Purpose    | Color Code         |
| ---------- | ------------------ |
| Primary    | `#E53935` (Red)    |
| Accent     | `#FB8C00` (Orange) |
| Highlight  | `#FDD835` (Yellow) |
| Secondary  | `#1E88E5` (Blue)   |
| Background | `#FFFFFF`          |
| Text       | `#1A1A1A`          |

### Usage Rules

* Primary actions → **Red**
* Hover states → **Orange**
* Focus states → **Blue**
* Alerts / highlights → **Yellow**
* Background → **White**

---

## 🧱 Data Model

### `users` table (Admin Record)

```json
{
  "id": 1,
  "name": "MCA Admin",
  "email": "admin@mca.edu",
  "password": "hashed_password",
  "role": "dept_admin",
  "dept_id": 1,
  "is_active": true,
  "verification_status": "verified",
  "created_at": "...",
  "updated_at": "..."
}
```

### Constraints

* `email` → UNIQUE
* `password` → hashed (bcrypt)
* `role` → must be `dept_admin`
* `dept_id` → required

---

## 🔐 Authentication Flow

---

### 1️⃣ Signup Flow

#### Steps

1. Admin opens signup page
2. Enters details
3. System validates input
4. Password is hashed
5. Department is created/fetched
6. Admin user is created
7. Redirect to login

---

### API

`POST /auth/signup`

#### Request

```json
{
  "name": "MCA Admin",
  "email": "admin@mca.edu",
  "password": "securepassword",
  "dept_name": "MCA"
}
```

#### Backend Logic

* Validate email uniqueness
* Hash password (bcrypt)
* Create or fetch department
* Create user with role `dept_admin`

---

### Response

```json
{
  "success": true,
  "message": "Account created successfully"
}
```

---

### 2️⃣ Login Flow

#### Steps

1. Admin enters email + password
2. System validates credentials
3. Password compared using bcrypt
4. JWT token generated
5. Admin logged in

---

### API

`POST /auth/login`

#### Request

```json
{
  "email": "admin@mca.edu",
  "password": "securepassword"
}
```

---

#### Backend Logic

* Find user by email
* Check role = `dept_admin`
* Compare password
* Generate JWT token
* Return user data

---

#### Response

```json
{
  "token": "jwt_token",
  "user": {
    "id": 1,
    "name": "MCA Admin",
    "dept_id": 1,
    "role": "dept_admin"
  }
}
```

---

## 🧠 Session Management

* Method: **JWT**
* Storage:

  * `localStorage` OR
  * `httpOnly cookie`
* Header:

```
Authorization: Bearer <token>
```

---

## 🖥️ UI Requirements

---

### Signup Page

#### Fields

* Name
* Email
* Password
* Department Name

---

#### Layout

```
--------------------------------
|   CampusNetra Logo           |
|                             |
|   Create Admin Account      |
|                             |
|   Name Input                |
|   Email Input               |
|   Password Input            |
|   Department Input          |
|                             |
|   [ Create Account ]        |
|                             |
|   Already have account?     |
|   [ Login ]                 |
--------------------------------
```

---

### Login Page

#### Fields

* Email
* Password

---

#### Layout

```
--------------------------------
|   CampusNetra Logo           |
|                             |
|   Admin Login               |
|                             |
|   Email Input               |
|   Password Input            |
|                             |
|   [ Login ]                 |
|                             |
|   Create account?           |
|   [ Signup ]                |
--------------------------------
```

---

## 🎨 UI Styling Rules

* Primary Button → Red (`#E53935`)
* Hover → Orange (`#FB8C00`)
* Input Focus → Blue (`#1E88E5`)
* Background → White
* Text → Dark (`#1A1A1A`)

---

## ⚠️ Edge Cases

### Signup

* Email already exists → `"Account already exists"`
* Weak password → `"Password too short"`

---

### Login

* Invalid email → `"User not found"`
* Wrong password → `"Incorrect password"`
* Non-admin login → `"Unauthorized"`

---

## 🔐 Security Requirements

* Password hashing → bcrypt
* JWT expiry → 7 days
* Input validation (basic)
* Optional rate limiting

---

## 🧠 Dependencies

### Signup Depends On

* `users` table
* `departments` table

---

### Login Depends On

* `users` table
* password hashing

---

## 🚀 Post-Login Behavior

After successful login:

```
→ Redirect to Admin Dashboard
```

---

### First Screen

* Welcome message
* Quick actions:

  * Create Term
  * Create Sections
  * Import Students

---

## 🧠 Summary

The Admin Authentication System is:

* Simple (email + password)
* Role-restricted (`dept_admin`)
* Department-scoped
* Secure (hashed + JWT)
* Ready for MVP deployment

---
