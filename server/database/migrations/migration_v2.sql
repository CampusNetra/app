-- Campus Netra Database Enhancement Migration (MySQL)
-- Version: 2.0

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Enhance `channels` table
ALTER TABLE `channels` 
ADD COLUMN `creator_id` int(11) DEFAULT NULL AFTER `term_id`,
ADD COLUMN `avatar_url` varchar(255) DEFAULT NULL AFTER `creator_id`,
ADD COLUMN `is_locked` tinyint(1) DEFAULT 0 AFTER `avatar_url`,
ADD COLUMN `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() AFTER `created_at`,
ADD CONSTRAINT `fk_channel_creator` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

-- 2. Enhance `messages` table
ALTER TABLE `messages`
ADD COLUMN `is_edited` tinyint(1) DEFAULT 0 AFTER `file_url`,
ADD COLUMN `is_deleted` tinyint(1) DEFAULT 0 AFTER `is_edited`,
ADD COLUMN `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() AFTER `created_at`;

-- 3. Enhance `users` table
ALTER TABLE `users`
ADD COLUMN `bio` text DEFAULT NULL AFTER `office_location`,
ADD COLUMN `last_seen` timestamp NULL DEFAULT NULL AFTER `has_logged_in`,
ADD COLUMN `is_online` tinyint(1) DEFAULT 0 AFTER `last_seen`;

-- 4. Enhance `channel_members` table
ALTER TABLE `channel_members`
ADD COLUMN `role` enum('owner','admin', 'member') DEFAULT 'member' AFTER `user_id`,
ADD COLUMN `last_read_message_id` int(11) DEFAULT NULL AFTER `role`,
ADD CONSTRAINT `fk_member_last_read` FOREIGN KEY (`last_read_message_id`) REFERENCES `messages` (`id`) ON DELETE SET NULL;

-- 5. Create `notifications` table
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `type` varchar(50) NOT NULL COMMENT 'chat, announcement, system, alert',
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `data` json DEFAULT NULL COMMENT 'Stores extra info like channel_id, message_id etc',
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_notif_user` (`user_id`),
  KEY `idx_notif_read` (`is_read`),
  CONSTRAINT `fk_notif_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Create `user_preferences` table
CREATE TABLE IF NOT EXISTS `user_preferences` (
  `user_id` int(11) NOT NULL,
  `theme` varchar(20) DEFAULT 'light',
  `notifications_enabled` tinyint(1) DEFAULT 1,
  `email_alerts` tinyint(1) DEFAULT 1,
  `language` varchar(10) DEFAULT 'en',
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_pref_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
