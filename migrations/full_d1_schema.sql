-- Full D1 Schema Sync & Fix
PRAGMA foreign_keys = OFF;

-- 1. Create missing Communication Tables
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

-- 2. Create Academic Tables
CREATE TABLE IF NOT EXISTS `assignments` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `title` TEXT NOT NULL,
    `description` TEXT,
    `due_date` DATETIME,
    `attachment_url` TEXT,
    `allow_submission` BOOLEAN DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `is_active` BOOLEAN DEFAULT 1,
    FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `assignment_targets` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `assignment_id` INTEGER NOT NULL,
    `subject_offering_id` INTEGER NOT NULL,
    FOREIGN KEY (`assignment_id`) REFERENCES `assignments`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`subject_offering_id`) REFERENCES `subject_offerings`(`id`) ON DELETE CASCADE
);

-- 3. Create Polling Tables
CREATE TABLE IF NOT EXISTS `polls` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `question` TEXT NOT NULL,
    `options` TEXT NOT NULL, -- JSON
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

-- 4. Seed Membership (Critical Fix for "No groups found")
-- This ensures the admin user (usually ID 1) is a member of all existing channels
-- so they actually show up in the Sidebar.
INSERT OR IGNORE INTO `channel_members` (channel_id, user_id, role)
SELECT id, 1, 'owner' FROM `channels`;

PRAGMA foreign_keys = ON;
