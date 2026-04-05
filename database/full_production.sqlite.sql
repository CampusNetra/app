-- CAMPUS NETRA: MASTER PRODUCTION D1 SCHEMA
-- This script contains all tables, constraints, and triggers in one file.

PRAGMA foreign_keys = OFF;

-- 1. Departments
CREATE TABLE IF NOT EXISTS `departments` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `name` TEXT UNIQUE NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Sections
CREATE TABLE IF NOT EXISTS `sections` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `name` TEXT NOT NULL,
    `dept_id` INTEGER,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(`name`, `dept_id`),
    FOREIGN KEY (`dept_id`) REFERENCES `departments`(`id`) ON DELETE CASCADE
);

-- 3. Terms
CREATE TABLE IF NOT EXISTS `terms` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `name` TEXT UNIQUE NOT NULL,
    `is_active` BOOLEAN DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Users
CREATE TABLE IF NOT EXISTS `users` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `name` TEXT NOT NULL,
    `email` TEXT UNIQUE,
    `avatar_url` TEXT DEFAULT NULL,
    `phone` TEXT DEFAULT NULL,
    `reg_no` TEXT UNIQUE,
    `enrollment_no` TEXT UNIQUE,
    `role` TEXT NOT NULL CHECK(`role` IN ('student', 'faculty', 'dept_admin', 'super_admin')),
    `dept_id` INTEGER,
    `section_id` INTEGER,
    `password` TEXT,
    `bio` TEXT DEFAULT NULL,
    `last_seen` DATETIME DEFAULT NULL,
    `is_online` INTEGER DEFAULT 0,
    `has_logged_in` INTEGER DEFAULT 0,
    `is_active` BOOLEAN DEFAULT 1,
    `verification_status` TEXT DEFAULT 'pending' CHECK(`verification_status` IN ('pending', 'verified')),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`dept_id`) REFERENCES `departments`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON DELETE SET NULL
);

-- 5. Subjects & Offerings
CREATE TABLE IF NOT EXISTS `subjects` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `name` TEXT NOT NULL,
    `dept_id` INTEGER,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(`name`, `dept_id`),
    FOREIGN KEY (`dept_id`) REFERENCES `departments`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `subject_offerings` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `subject_id` INTEGER,
    `section_id` INTEGER,
    `faculty_id` INTEGER,
    `term_id` INTEGER,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(`subject_id`, `section_id`, `term_id`),
    FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`faculty_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`term_id`) REFERENCES `terms`(`id`) ON DELETE CASCADE
);

-- 6. Channels & Communication
CREATE TABLE IF NOT EXISTS `channels` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `name` TEXT NOT NULL,
    `description` TEXT DEFAULT NULL,
    `type` TEXT NOT NULL CHECK(`type` IN ('branch', 'section', 'subject', 'announcement', 'general', 'club', 'system', 'global', 'branch_all')),
    `visibility` TEXT DEFAULT 'department' CHECK(`visibility` IN ('department', 'public', 'private')),
    `dept_id` INTEGER,
    `section_id` INTEGER,
    `subject_offering_id` INTEGER,
    `term_id` INTEGER,
    `creator_id` INTEGER DEFAULT NULL,
    `avatar_url` TEXT DEFAULT NULL,
    `is_locked` INTEGER DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`dept_id`) REFERENCES `departments`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`subject_offering_id`) REFERENCES `subject_offerings`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`term_id`) REFERENCES `terms`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `channel_members` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `channel_id` INTEGER,
    `user_id` INTEGER,
    `role` TEXT DEFAULT 'member' CHECK(`role` IN ('owner', 'admin', 'member')),
    `last_read_message_id` INTEGER DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(`channel_id`, `user_id`),
    FOREIGN KEY (`channel_id`) REFERENCES `channels`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `messages` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `channel_id` INTEGER,
    `sender_id` INTEGER,
    `content` TEXT,
    `type` TEXT DEFAULT 'text' CHECK(`type` IN ('text', 'file', 'image', 'announcement', 'system')),
    `parent_id` INTEGER,
    `file_url` TEXT,
    `is_edited` INTEGER DEFAULT 0,
    `is_deleted` INTEGER DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`channel_id`) REFERENCES `channels`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`parent_id`) REFERENCES `messages`(`id`) ON DELETE CASCADE
);

-- 7. Clubs, Announcements, Assignments, Polls
CREATE TABLE IF NOT EXISTS `clubs` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `name` TEXT NOT NULL,
    `description` TEXT,
    `category` TEXT,
    `dept_id` INTEGER,
    `channel_id` INTEGER,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`dept_id`) REFERENCES `departments`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`channel_id`) REFERENCES `channels`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `announcements` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `title` TEXT NOT NULL,
    `content` TEXT NOT NULL,
    `type` TEXT DEFAULT 'normal' CHECK(`type` IN ('important', 'normal', 'event')),
    `visibility` TEXT DEFAULT 'all' CHECK(`visibility` IN ('all', 'section', 'department')),
    `event_date` DATETIME NULL,
    `event_location` TEXT NULL,
    `event_registration_url` TEXT NULL,
    `image_url` TEXT NULL,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `is_active` INTEGER DEFAULT 1,
    FOREIGN KEY (`created_by`) REFERENCES `users`(`id`)
);

CREATE TABLE IF NOT EXISTS `announcement_targets` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `announcement_id` INTEGER NOT NULL,
  `target_section_id` INTEGER DEFAULT NULL,
  `target_dept_id` INTEGER DEFAULT NULL,
  FOREIGN KEY (`announcement_id`) REFERENCES `announcements`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `assignments` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `title` TEXT NOT NULL,
  `description` TEXT,
  `due_date` DATETIME,
  `attachment_url` TEXT,
  `allow_submission` INTEGER DEFAULT 1,
  `created_by` INTEGER NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `is_active` INTEGER DEFAULT 1,
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `assignment_targets` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `assignment_id` INTEGER NOT NULL,
  `subject_offering_id` INTEGER NOT NULL,
  FOREIGN KEY (`assignment_id`) REFERENCES `assignments`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`subject_offering_id`) REFERENCES `subject_offerings`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `polls` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `question` TEXT NOT NULL,
  `options` TEXT NOT NULL, 
  `created_by` INTEGER NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `is_active` INTEGER DEFAULT 1,
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `poll_targets` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `poll_id` INTEGER NOT NULL,
  `target_section_id` INTEGER DEFAULT NULL,
  `target_dept_id` INTEGER DEFAULT NULL,
  FOREIGN KEY (`poll_id`) REFERENCES `polls`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `poll_responses` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `poll_id` INTEGER NOT NULL,
  `user_id` INTEGER NOT NULL,
  `option_index` INTEGER NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`poll_id`) REFERENCES `polls`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  UNIQUE(`poll_id`, `user_id`)
);

-- 8. Infrastructure (Notifications, Preferences, Reports, OTP)
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `user_id` INTEGER NOT NULL,
  `type` TEXT NOT NULL,
  `title` TEXT NOT NULL,
  `message` TEXT NOT NULL,
  `data` TEXT DEFAULT NULL, 
  `is_read` INTEGER DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `user_preferences` (
  `user_id` INTEGER PRIMARY KEY,
  `theme` TEXT DEFAULT 'light',
  `notifications_enabled` INTEGER DEFAULT 1,
  `email_alerts` INTEGER DEFAULT 1,
  `language` TEXT DEFAULT 'en',
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `channel_reports` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `message_id` INTEGER,
  `reporter_id` INTEGER,
  `reason` TEXT,
  `status` TEXT DEFAULT 'pending' CHECK(`status` IN ('pending', 'resolved', 'dismissed')),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `otp_codes` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `email` TEXT,
  `user_id` INTEGER,
  `otp` TEXT NOT NULL,
  `expires_at` TIMESTAMP NOT NULL,
  `used` INTEGER DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Indexes & Triggers
CREATE INDEX IF NOT EXISTS `idx_users_dept` ON `users`(`dept_id`);
CREATE INDEX IF NOT EXISTS `idx_users_section` ON `users`(`section_id`);
CREATE INDEX IF NOT EXISTS `idx_channels_type` ON `channels`(`type`);
CREATE INDEX IF NOT EXISTS `idx_messages_channel` ON `messages`(`channel_id`);
CREATE INDEX IF NOT EXISTS `idx_announcements_visibility` ON `announcements`(`visibility`);

CREATE TRIGGER IF NOT EXISTS `trigger_users_updated_at` 
AFTER UPDATE ON `users`
FOR EACH ROW
BEGIN
    UPDATE `users` SET updated_at = CURRENT_TIMESTAMP WHERE id = old.id;
END;

CREATE TRIGGER IF NOT EXISTS `trigger_channels_updated_at` 
AFTER UPDATE ON `channels`
FOR EACH ROW
BEGIN
    UPDATE `channels` SET updated_at = CURRENT_TIMESTAMP WHERE id = old.id;
END;

PRAGMA foreign_keys = ON;
