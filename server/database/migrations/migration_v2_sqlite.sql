-- Campus Netra Database Enhancement Migration (SQLite)
-- Version: 2.0

-- 1. Enhance `channels` table
ALTER TABLE `channels` ADD COLUMN `creator_id` INTEGER DEFAULT NULL;
ALTER TABLE `channels` ADD COLUMN `avatar_url` VARCHAR(255) DEFAULT NULL;
ALTER TABLE `channels` ADD COLUMN `is_locked` BOOLEAN DEFAULT 0;
ALTER TABLE `channels` ADD COLUMN `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP;

-- 2. Enhance `messages` table
ALTER TABLE `messages` ADD COLUMN `is_edited` BOOLEAN DEFAULT 0;
ALTER TABLE `messages` ADD COLUMN `is_deleted` BOOLEAN DEFAULT 0;
ALTER TABLE `messages` ADD COLUMN `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP;

-- 3. Enhance `users` table
ALTER TABLE `users` ADD COLUMN `bio` TEXT DEFAULT NULL;
ALTER TABLE `users` ADD COLUMN `last_seen` DATETIME DEFAULT NULL;
ALTER TABLE `users` ADD COLUMN `is_online` BOOLEAN DEFAULT 0;

-- 4. Enhance `channel_members` table
ALTER TABLE `channel_members` ADD COLUMN `role` VARCHAR(50) DEFAULT 'member';
ALTER TABLE `channel_members` ADD COLUMN `last_read_message_id` INTEGER DEFAULT NULL;

-- 5. Create `notifications` table
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `user_id` INTEGER NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `data` TEXT DEFAULT NULL, -- SQLite doesn't have a native JSON type, so we use TEXT
  `is_read` BOOLEAN DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
);

-- 6. Create `user_preferences` table
CREATE TABLE IF NOT EXISTS `user_preferences` (
  `user_id` INTEGER PRIMARY KEY,
  `theme` VARCHAR(20) DEFAULT 'light',
  `notifications_enabled` BOOLEAN DEFAULT 1,
  `email_alerts` BOOLEAN DEFAULT 1,
  `language` VARCHAR(10) DEFAULT 'en',
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
);
