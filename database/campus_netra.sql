-- Disable foreign key checks
PRAGMA foreign_keys = OFF;

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS otp_codes;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS channel_members;
DROP TABLE IF EXISTS channels;
DROP TABLE IF EXISTS subject_offerings;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS terms;
DROP TABLE IF EXISTS sections;
DROP TABLE IF EXISTS departments;

-- =========================
-- 1. departments
-- =========================
CREATE TABLE departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 2. sections
-- =========================
CREATE TABLE sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    dept_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(name, dept_id),
    FOREIGN KEY (dept_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- =========================
-- 3. terms
-- =========================
CREATE TABLE terms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 4. users
-- =========================
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL,
    email TEXT UNIQUE,

    reg_no TEXT UNIQUE,
    enrollment_no TEXT UNIQUE,

    role TEXT NOT NULL CHECK(role IN ('student', 'faculty', 'dept_admin', 'super_admin')),

    dept_id INTEGER,
    section_id INTEGER,

    password TEXT,

    is_active BOOLEAN DEFAULT TRUE,
    verification_status TEXT DEFAULT 'pending' CHECK(verification_status IN ('pending', 'verified')),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (dept_id) REFERENCES departments(id) ON DELETE SET NULL,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE SET NULL
);

-- =========================
-- 5. subjects
-- =========================
CREATE TABLE subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    dept_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(name, dept_id),
    FOREIGN KEY (dept_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- =========================
-- 6. subject_offerings
-- =========================
CREATE TABLE subject_offerings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    subject_id INTEGER,
    section_id INTEGER,
    faculty_id INTEGER,
    term_id INTEGER,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(subject_id, section_id, term_id),

    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE,
    FOREIGN KEY (faculty_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (term_id) REFERENCES terms(id) ON DELETE CASCADE
);

-- =========================
-- 7. channels
-- =========================
CREATE TABLE channels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL,

    type TEXT NOT NULL CHECK(type IN ('branch', 'section', 'subject')),

    dept_id INTEGER,
    section_id INTEGER,
    subject_offering_id INTEGER,
    term_id INTEGER,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (dept_id) REFERENCES departments(id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_offering_id) REFERENCES subject_offerings(id) ON DELETE CASCADE,
    FOREIGN KEY (term_id) REFERENCES terms(id) ON DELETE CASCADE
);

-- =========================
-- 8. channel_members
-- =========================
CREATE TABLE channel_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    channel_id INTEGER,
    user_id INTEGER,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(channel_id, user_id),

    FOREIGN KEY (channel_id) REFERENCES channels(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================
-- 9. messages
-- =========================
CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    channel_id INTEGER,
    sender_id INTEGER,

    content TEXT,

    type TEXT DEFAULT 'text' CHECK(type IN ('text', 'file', 'image', 'announcement', 'system')),

    parent_id INTEGER,

    file_url TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (channel_id) REFERENCES channels(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (parent_id) REFERENCES messages(id) ON DELETE CASCADE
);

-- =========================
-- 10. otp_codes
-- =========================
CREATE TABLE otp_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    email TEXT,
    user_id INTEGER,

    otp TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================
-- INDEXES
-- =========================
CREATE INDEX idx_users_dept ON users(dept_id);
CREATE INDEX idx_users_section ON users(section_id);

CREATE INDEX idx_channels_type ON channels(type);
CREATE INDEX idx_channels_section ON channels(section_id);
CREATE INDEX idx_channels_subject ON channels(subject_offering_id);

CREATE INDEX idx_messages_channel ON messages(channel_id);
CREATE INDEX idx_messages_parent ON messages(parent_id);

CREATE INDEX idx_subject_offerings_section ON subject_offerings(section_id);

-- Trigger for updated_at in users table (since SQLite doesn't support ON UPDATE directly)
CREATE TRIGGER IF NOT EXISTS trigger_users_updated_at 
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = old.id;
END;

-- Enable foreign key checks
PRAGMA foreign_keys = ON;