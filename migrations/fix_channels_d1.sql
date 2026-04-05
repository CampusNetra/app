-- Fix Channels Table for D1: Idempotent Recovery Version
PRAGMA foreign_keys = OFF;

-- 1. Create a NEW temporary table with the correct schema
CREATE TABLE IF NOT EXISTS `channels_new` (
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

-- 2. Safely copy data from the old table (if it exists)
INSERT OR IGNORE INTO `channels_new` (id, name, type, dept_id, section_id, subject_offering_id, term_id, created_at)
SELECT id, name, type, dept_id, section_id, subject_offering_id, term_id, created_at FROM `channels`;

-- 3. Swap the tables
DROP TABLE IF EXISTS `channels`;
ALTER TABLE `channels_new` RENAME TO `channels`;

-- 4. Finalize other table structures
-- (Columns below already exist from previous attempts, commenting out to avoid halting the script)
-- ALTER TABLE `channel_members` ADD COLUMN `role` TEXT DEFAULT 'member';
-- ALTER TABLE `channel_members` ADD COLUMN `last_read_message_id` INTEGER DEFAULT NULL;

-- 5. Re-enable Constraints and Triggers
PRAGMA foreign_keys = ON;
DROP TRIGGER IF EXISTS trigger_channels_updated_at;
CREATE TRIGGER trigger_channels_updated_at 
AFTER UPDATE ON `channels`
FOR EACH ROW
BEGIN
    UPDATE `channels` SET updated_at = CURRENT_TIMESTAMP WHERE id = old.id;
END;
