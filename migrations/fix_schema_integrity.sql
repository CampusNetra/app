-- ⚠️ NUCLEAR SCHEMA RECOVERY ⚠️
-- Use this to force-fix corruption where 'channels_old' is haunting the database.
PRAGMA foreign_keys = OFF;

-- 1. Kill EVERY possible trigger name that could be causing the "channels_old" ghost error
DROP TRIGGER IF EXISTS "trigger.channels.updated_at";
DROP TRIGGER IF EXISTS `trigger.channels.updated_at`;
DROP TRIGGER IF EXISTS trigger_channels_updated_at;
DROP TRIGGER IF EXISTS channels_updated_at;
DROP TRIGGER IF EXISTS update_channels_timestamp;

-- 2. COMPLETELY REBUILD the core chat tables (The ones affected by the ghost table)
-- We will DO NOT use RENAME here because RENAME checks for integrity and fails.
-- We will DROP and then RECREATE from scratch.

DROP TABLE IF EXISTS `channel_members`;
DROP TABLE IF EXISTS `messages`;
DROP TABLE IF EXISTS `channels`;

-- 3. Now recreate them CLEANLY with correct links
CREATE TABLE `channels` (
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

CREATE TABLE `channel_members` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `channel_id` INTEGER,
    `user_id` INTEGER,
    `role` TEXT DEFAULT 'member',
    `last_read_message_id` INTEGER DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(channel_id, user_id),
    FOREIGN KEY (`channel_id`) REFERENCES `channels`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

CREATE TABLE `messages` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `channel_id` INTEGER,
    `sender_id` INTEGER,
    `content` TEXT,
    `type` TEXT DEFAULT 'text' CHECK(type IN ('text', 'file', 'image', 'announcement', 'system')),
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

-- 4. Restore Global Channels (Essential for Admin/Faculty Login)
INSERT OR IGNORE INTO `channels` (name, type, visibility, dept_id) VALUES ('MCA ALL', 'branch', 'department', 1);

-- 5. Finalize Sync
PRAGMA foreign_keys = ON;
DROP TRIGGER IF EXISTS trigger_channels_updated_at;
CREATE TRIGGER trigger_channels_updated_at 
AFTER UPDATE ON `channels`
FOR EACH ROW
BEGIN
    UPDATE `channels` SET updated_at = CURRENT_TIMESTAMP WHERE id = old.id;
END;
