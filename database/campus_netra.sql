-- Disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- =========================
-- 1. departments
-- =========================
CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 2. sections
-- =========================
CREATE TABLE sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    dept_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY unique_section (name, dept_id),
    FOREIGN KEY (dept_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- =========================
-- 3. terms
-- =========================
CREATE TABLE terms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 4. users
-- =========================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE,

    reg_no VARCHAR(100) UNIQUE,
    enrollment_no VARCHAR(100) UNIQUE,

    role ENUM('student', 'faculty', 'dept_admin', 'super_admin') NOT NULL,

    dept_id INT,
    section_id INT,

    password TEXT,

    is_active BOOLEAN DEFAULT TRUE,
    verification_status ENUM('pending', 'verified') DEFAULT 'pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (dept_id) REFERENCES departments(id) ON DELETE SET NULL,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE SET NULL
);

-- =========================
-- 5. subjects
-- =========================
CREATE TABLE subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    dept_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY unique_subject (name, dept_id),
    FOREIGN KEY (dept_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- =========================
-- 6. subject_offerings
-- =========================
CREATE TABLE subject_offerings (
    id INT AUTO_INCREMENT PRIMARY KEY,

    subject_id INT,
    section_id INT,
    faculty_id INT,
    term_id INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY unique_offering (subject_id, section_id, term_id),

    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE,
    FOREIGN KEY (faculty_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (term_id) REFERENCES terms(id) ON DELETE CASCADE
);

-- =========================
-- 7. channels
-- =========================
CREATE TABLE channels (
    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(150) NOT NULL,

    type ENUM('branch', 'section', 'subject') NOT NULL,

    dept_id INT,
    section_id INT,
    subject_offering_id INT,
    term_id INT,

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
    id INT AUTO_INCREMENT PRIMARY KEY,

    channel_id INT,
    user_id INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY unique_member (channel_id, user_id),

    FOREIGN KEY (channel_id) REFERENCES channels(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================
-- 9. messages
-- =========================
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,

    channel_id INT,
    sender_id INT,

    content TEXT,

    type ENUM('text', 'file', 'image', 'announcement', 'system') DEFAULT 'text',

    parent_id INT,

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
    id INT AUTO_INCREMENT PRIMARY KEY,

    email VARCHAR(150),
    user_id INT,

    otp VARCHAR(10) NOT NULL,
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

-- Enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;