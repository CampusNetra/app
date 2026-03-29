-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 29, 2026 at 10:51 AM
-- Server version: 12.2.2-MariaDB
-- PHP Version: 8.5.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `campus_netra`
--

-- --------------------------------------------------------

--
-- Table structure for table `channels`
--

CREATE TABLE `channels` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `type` enum('branch','section','subject') NOT NULL,
  `dept_id` int(11) DEFAULT NULL,
  `section_id` int(11) DEFAULT NULL,
  `subject_offering_id` int(11) DEFAULT NULL,
  `term_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `channels`
--

INSERT INTO `channels` (`id`, `name`, `type`, `dept_id`, `section_id`, `subject_offering_id`, `term_id`, `created_at`) VALUES
(4, 'MCA - MCA-4', 'section', 1, 1, NULL, NULL, '2026-03-20 09:41:43'),
(5, 'JAVA (MCA-4)', 'subject', 1, 1, 1, 1, '2026-03-20 10:17:55'),
(7, 'MCA - MCA-5', 'section', 1, 2, NULL, NULL, '2026-03-20 13:20:12'),
(8, 'JAVA (MCA-5)', 'subject', 1, 2, 3, 1, '2026-03-20 13:20:34'),
(10, 'DBMS (MCA-5)', 'subject', 1, 2, 5, 2, '2026-03-22 09:35:17');

-- --------------------------------------------------------

--
-- Table structure for table `channel_members`
--

CREATE TABLE `channel_members` (
  `id` int(11) NOT NULL,
  `channel_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `channel_members`
--

INSERT INTO `channel_members` (`id`, `channel_id`, `user_id`, `created_at`) VALUES
(4, 5, 3, '2026-03-20 10:17:55'),
(5, 5, 2, '2026-03-20 10:17:55'),
(8, 8, 3, '2026-03-20 13:20:34'),
(10, 10, 3, '2026-03-22 09:35:17'),
(11, 10, 4, '2026-03-22 09:35:17');

-- --------------------------------------------------------

--
-- Table structure for table `channel_reports`
--

CREATE TABLE `channel_reports` (
  `id` int(11) NOT NULL,
  `message_id` int(11) DEFAULT NULL,
  `reporter_id` int(11) DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `clubs`
--

CREATE TABLE `clubs` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `dept_id` int(11) DEFAULT NULL,
  `channel_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`, `created_at`) VALUES
(1, 'MCA', '2026-03-17 20:01:00');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `channel_id` int(11) DEFAULT NULL,
  `sender_id` int(11) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `type` enum('text','file','image','announcement','system') DEFAULT 'text',
  `parent_id` int(11) DEFAULT NULL,
  `file_url` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `channel_id`, `sender_id`, `content`, `type`, `parent_id`, `file_url`, `created_at`) VALUES
(6, 7, 1, 'Test', 'announcement', NULL, NULL, '2026-03-22 10:09:48');

-- --------------------------------------------------------

--
-- Table structure for table `otp_codes`
--

CREATE TABLE `otp_codes` (
  `id` int(11) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `otp` varchar(10) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `used` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sections`
--

CREATE TABLE `sections` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `dept_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sections`
--

INSERT INTO `sections` (`id`, `name`, `dept_id`, `created_at`) VALUES
(1, 'MCA-4', 1, '2026-03-20 09:41:43'),
(2, 'MCA-5', 1, '2026-03-20 13:20:12');

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `dept_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`id`, `name`, `dept_id`, `created_at`) VALUES
(1, 'JAVA', 1, '2026-03-20 09:46:19'),
(2, 'DBMS', 1, '2026-03-20 13:18:39');

-- --------------------------------------------------------

--
-- Table structure for table `subject_offerings`
--

CREATE TABLE `subject_offerings` (
  `id` int(11) NOT NULL,
  `subject_id` int(11) DEFAULT NULL,
  `section_id` int(11) DEFAULT NULL,
  `faculty_id` int(11) DEFAULT NULL,
  `term_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `subject_offerings`
--

INSERT INTO `subject_offerings` (`id`, `subject_id`, `section_id`, `faculty_id`, `term_id`, `created_at`) VALUES
(1, 1, 1, 3, 2, '2026-03-20 10:17:55'),
(3, 1, 2, 3, 2, '2026-03-20 13:20:34'),
(5, 2, 2, 3, 2, '2026-03-22 09:35:17');

-- --------------------------------------------------------

--
-- Table structure for table `terms`
--

CREATE TABLE `terms` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `is_active` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `terms`
--

INSERT INTO `terms` (`id`, `name`, `is_active`, `created_at`) VALUES
(1, '2025_ODD', 0, '2026-03-17 20:06:52'),
(2, '2026_EVEN', 1, '2026-03-20 14:47:20');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `reg_no` varchar(100) DEFAULT NULL,
  `enrollment_no` varchar(100) DEFAULT NULL,
  `role` enum('student','faculty','dept_admin','super_admin') NOT NULL,
  `employment_type` varchar(50) DEFAULT 'Full Time',
  `dept_id` int(11) DEFAULT NULL,
  `office_location` varchar(100) DEFAULT NULL,
  `section_id` int(11) DEFAULT NULL,
  `password` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `verification_status` enum('pending','verified') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `avatar_url`, `email`, `phone`, `reg_no`, `enrollment_no`, `role`, `employment_type`, `dept_id`, `office_location`, `section_id`, `password`, `is_active`, `verification_status`, `created_at`, `updated_at`) VALUES
(1, 'Sumit', NULL, 'admin@gu.in', NULL, NULL, NULL, 'dept_admin', 'Full Time', 1, NULL, NULL, '$2b$10$EGGBGcCZNHvcZnqlNDzFqeBl8laY1mLHFH8/UCvCX3Tu41UhaohKy', 1, 'verified', '2026-03-17 20:01:00', '2026-03-17 20:01:00'),
(2, 'Sumit Srivastava', NULL, NULL, NULL, '25SCSE2030342', '25132030846', 'student', 'Full Time', 1, NULL, 1, '$2a$10$2bsNU0xTZHTVG26XZbGEy./PO4qc0NqxrXEE4Vsa9UqULGIH6r336', 1, 'pending', '2026-03-20 09:27:12', '2026-03-20 10:01:53'),
(3, 'Priyanshu Singh', NULL, 'pr@gu.in', '911234567890', 'REG252030', 'ENR2030128', 'faculty', 'Full Time', 1, 'Block-C Room-443', NULL, '$2a$10$8syNVORGCGDoswYg51xAp.slAay0Dfq9jvLrHravr/tE6pLRZqeZW', 1, 'pending', '2026-03-20 09:28:05', '2026-03-20 10:10:00'),
(4, 'Aditya', NULL, NULL, NULL, '25SCSE2030243', '2039198398', 'student', 'Full Time', 1, NULL, 2, '$2a$10$P.IPaMCwIu/1lkZoIQj/uu7zMECRPkUfikUrusqbT41FV2vDiyPse', 1, 'pending', '2026-03-20 13:23:22', '2026-03-20 13:23:22'),
(5, 'Test1', NULL, NULL, NULL, '25SCSE2030431', '124214323', 'student', 'Full Time', 1, NULL, 1, '$2a$10$wcJoy3eFHxPZXyPaJIIqjulB9E67qtmJqfV06t0LBHQ8GFU.pJ4bq', 1, 'pending', '2026-03-22 09:17:50', '2026-03-22 09:18:05'),
(6, 'Test2', NULL, NULL, NULL, '25SCSE2030432', '124214324', 'student', 'Full Time', 1, NULL, 1, '$2a$10$A2OciT7nmvKycieoZlSWUOScXUVoiyDYgYfr12c1f89yFfcZp04Fa', 1, 'pending', '2026-03-22 09:17:50', '2026-03-22 09:18:09');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `channels`
--
ALTER TABLE `channels`
  ADD PRIMARY KEY (`id`),
  ADD KEY `dept_id` (`dept_id`),
  ADD KEY `term_id` (`term_id`),
  ADD KEY `idx_channels_type` (`type`),
  ADD KEY `idx_channels_section` (`section_id`),
  ADD KEY `idx_channels_subject` (`subject_offering_id`);

--
-- Indexes for table `channel_members`
--
ALTER TABLE `channel_members`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_member` (`channel_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `channel_reports`
--
ALTER TABLE `channel_reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reporter_id` (`reporter_id`);

--
-- Indexes for table `clubs`
--
ALTER TABLE `clubs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `dept_id` (`dept_id`),
  ADD KEY `channel_id` (`channel_id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `idx_messages_channel` (`channel_id`),
  ADD KEY `idx_messages_parent` (`parent_id`);

--
-- Indexes for table `otp_codes`
--
ALTER TABLE `otp_codes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `sections`
--
ALTER TABLE `sections`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_section` (`name`,`dept_id`),
  ADD KEY `dept_id` (`dept_id`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_subject` (`name`,`dept_id`),
  ADD KEY `dept_id` (`dept_id`);

--
-- Indexes for table `subject_offerings`
--
ALTER TABLE `subject_offerings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_offering` (`subject_id`,`section_id`,`term_id`),
  ADD KEY `faculty_id` (`faculty_id`),
  ADD KEY `term_id` (`term_id`),
  ADD KEY `idx_subject_offerings_section` (`section_id`);

--
-- Indexes for table `terms`
--
ALTER TABLE `terms`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `reg_no` (`reg_no`),
  ADD UNIQUE KEY `enrollment_no` (`enrollment_no`),
  ADD KEY `idx_users_dept` (`dept_id`),
  ADD KEY `idx_users_section` (`section_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `channels`
--
ALTER TABLE `channels`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `channel_members`
--
ALTER TABLE `channel_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `channel_reports`
--
ALTER TABLE `channel_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `clubs`
--
ALTER TABLE `clubs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `otp_codes`
--
ALTER TABLE `otp_codes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sections`
--
ALTER TABLE `sections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `subject_offerings`
--
ALTER TABLE `subject_offerings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `terms`
--
ALTER TABLE `terms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `channels`
--
ALTER TABLE `channels`
  ADD CONSTRAINT `1` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `2` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `3` FOREIGN KEY (`subject_offering_id`) REFERENCES `subject_offerings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `4` FOREIGN KEY (`term_id`) REFERENCES `terms` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `channel_members`
--
ALTER TABLE `channel_members`
  ADD CONSTRAINT `1` FOREIGN KEY (`channel_id`) REFERENCES `channels` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `channel_reports`
--
ALTER TABLE `channel_reports`
  ADD CONSTRAINT `1` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `clubs`
--
ALTER TABLE `clubs`
  ADD CONSTRAINT `1` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `2` FOREIGN KEY (`channel_id`) REFERENCES `channels` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `1` FOREIGN KEY (`channel_id`) REFERENCES `channels` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `3` FOREIGN KEY (`parent_id`) REFERENCES `messages` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `otp_codes`
--
ALTER TABLE `otp_codes`
  ADD CONSTRAINT `1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sections`
--
ALTER TABLE `sections`
  ADD CONSTRAINT `1` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `subjects`
--
ALTER TABLE `subjects`
  ADD CONSTRAINT `1` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `subject_offerings`
--
ALTER TABLE `subject_offerings`
  ADD CONSTRAINT `1` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `2` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `3` FOREIGN KEY (`faculty_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `4` FOREIGN KEY (`term_id`) REFERENCES `terms` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `1` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `2` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
