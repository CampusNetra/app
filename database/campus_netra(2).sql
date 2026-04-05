-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 05, 2026 at 06:15 PM
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
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `type` enum('important','normal','event') DEFAULT 'normal',
  `visibility` enum('all','section','department') DEFAULT 'all',
  `target_section_id` int(11) DEFAULT NULL,
  `target_dept_id` int(11) DEFAULT NULL,
  `event_date` datetime DEFAULT NULL,
  `event_location` varchar(255) DEFAULT NULL,
  `event_registration_url` varchar(280) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_active` tinyint(4) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `announcements`
--

INSERT INTO `announcements` (`id`, `title`, `content`, `type`, `visibility`, `target_section_id`, `target_dept_id`, `event_date`, `event_location`, `event_registration_url`, `image_url`, `created_by`, `created_at`, `updated_at`, `is_active`) VALUES
(1, 'Campus Announcement Test', 'This is a test announcement for all students', 'important', 'all', NULL, NULL, NULL, NULL, NULL, NULL, 2, '2026-03-29 15:17:11', '2026-03-29 15:17:11', 1),
(2, 'Testing', ' Engineering resilience into every system.\n\nI am Sumit Srivastava, a specialized engineer dedicated to building high-performance SaaS, robust cloud backends, and modular architectures designed to scale indefinitely. I also lead Syntax Sinners, a collective of elite developers. ', 'event', 'all', NULL, 1, '2026-03-29 10:00:00', 'C-402', 'https://syntax-sinners.github.io/web/', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-XTqMTfcGvQyv8twRx4CiJaKfn3Gmt9GmKw&s', 1, '2026-03-29 15:49:19', '2026-03-29 16:29:17', 1),
(3, 'Uni Fest 2026', 'All the students must come to the event or there ass will be whopped.', 'event', 'all', NULL, 1, '2026-03-29 10:00:00', 'A-103', 'https://github.com/sumit7739', 'https://www.bizzabo.com/wp-content/uploads/2021/09/event-marketing-examples-user-conference-min.png', 1, '2026-03-29 16:03:47', '2026-03-29 16:13:40', 1),
(4, 'Class Close', 'Hello everyone, this is to inform you, class will remain close tomorrow.', 'normal', 'all', NULL, 1, NULL, NULL, NULL, NULL, 1, '2026-03-30 08:36:42', '2026-03-30 08:36:42', 1),
(5, 'Uni Fest', 'Uni fest is today, every one should come to the new auditorium quickly.', 'event', 'all', NULL, 1, '2026-03-30 11:00:00', 'New Auditoriam', 'https://docs.google.com/forms/d/e/1FAIpQLSfvA9GS-pqpPDjuXx5vR7to4o98pCkO74bTVGqM8XzAklV_Jw/viewform?usp=header', 'https://media.licdn.com/dms/image/v2/C5612AQFDXzzapeJe0A/article-inline_image-shrink_1000_1488/article-inline_image-shrink_1000_1488/0/1520196055762?e=1775692800&v=beta&t=DfMaHTGLDKLctZy0hGuudNfwb2AsDHn9ZWel6ulcjNM', 1, '2026-03-30 08:38:36', '2026-03-30 08:38:36', 1),
(6, 'Testing', 'shows you can handle workload (proven) ✅\nremoves their biggest fear (burnout / inconsistency) ✅\nmentions dean → signals real-world adjustment ability ✅\nasks about timing → but not in a demanding way ✅', 'important', 'section', 1, 1, NULL, NULL, NULL, NULL, 1, '2026-03-30 10:28:57', '2026-03-30 10:28:57', 1),
(7, 'sports meet', 'meet me \nshows you can handle workload (proven) ✅\nremoves their biggest fear (burnout / inconsistency) ✅\nmentions dean → signals real-world adjustment ability ✅\nasks about timing → but not in a demanding way ✅\nends with:', 'normal', 'section', 2, 1, NULL, NULL, NULL, NULL, 1, '2026-03-30 10:29:49', '2026-03-30 10:29:49', 1);

-- --------------------------------------------------------

--
-- Table structure for table `announcement_targets`
--

CREATE TABLE `announcement_targets` (
  `id` int(11) NOT NULL,
  `announcement_id` int(11) NOT NULL,
  `target_section_id` int(11) DEFAULT NULL,
  `target_dept_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `assignments`
--

CREATE TABLE `assignments` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` longtext DEFAULT NULL,
  `due_date` datetime DEFAULT NULL,
  `attachment_url` varchar(255) DEFAULT NULL,
  `allow_submission` tinyint(4) DEFAULT 1,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_active` tinyint(4) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `assignment_targets`
--

CREATE TABLE `assignment_targets` (
  `id` int(11) NOT NULL,
  `assignment_id` int(11) NOT NULL,
  `subject_offering_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `channels`
--

CREATE TABLE `channels` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `type` enum('branch','section','subject','announcement','general','club','system') NOT NULL,
  `visibility` enum('department','public','private') DEFAULT 'department',
  `dept_id` int(11) DEFAULT NULL,
  `section_id` int(11) DEFAULT NULL,
  `subject_offering_id` int(11) DEFAULT NULL,
  `term_id` int(11) DEFAULT NULL,
  `creator_id` int(11) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `is_locked` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `channels`
--

INSERT INTO `channels` (`id`, `name`, `description`, `type`, `visibility`, `dept_id`, `section_id`, `subject_offering_id`, `term_id`, `creator_id`, `avatar_url`, `is_locked`, `created_at`, `updated_at`) VALUES
(4, 'MCA - MCA-4', NULL, 'section', 'department', 1, 1, NULL, NULL, NULL, NULL, 0, '2026-03-20 09:41:43', '2026-03-30 09:35:44'),
(7, 'MCA - MCA-5', NULL, 'section', 'department', 1, 2, NULL, NULL, NULL, NULL, 0, '2026-03-20 13:20:12', '2026-03-30 09:35:44'),
(11, 'MCA ALL', NULL, 'branch', 'department', 1, NULL, NULL, NULL, 1, NULL, 0, '2026-03-29 11:32:53', '2026-03-30 09:46:34'),
(13, 'Test Channel', 'testing', 'general', 'department', 1, NULL, NULL, NULL, 1, NULL, 0, '2026-03-29 18:28:06', '2026-03-30 09:46:36'),
(14, 'DBMS (MCA-4)', NULL, 'subject', 'department', 1, 1, 6, 2, NULL, NULL, 0, '2026-03-29 19:42:41', '2026-03-30 09:35:44'),
(15, 'DBMS (MCA-5)', NULL, 'subject', 'department', 1, 2, 7, 2, NULL, NULL, 0, '2026-03-29 19:42:41', '2026-03-30 09:35:44'),
(16, 'JAVA (MCA-4)', NULL, 'subject', 'department', 1, 1, 8, 2, NULL, NULL, 0, '2026-03-29 21:29:24', '2026-03-30 09:35:44'),
(17, 'JAVA (MCA-5)', NULL, 'subject', 'department', 1, 2, 9, 2, NULL, NULL, 0, '2026-03-29 21:29:51', '2026-03-30 09:35:44');

-- --------------------------------------------------------

--
-- Table structure for table `channel_members`
--

CREATE TABLE `channel_members` (
  `id` int(11) NOT NULL,
  `channel_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `role` enum('owner','admin','member') DEFAULT 'member',
  `last_read_message_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `channel_members`
--

INSERT INTO `channel_members` (`id`, `channel_id`, `user_id`, `role`, `last_read_message_id`, `created_at`) VALUES
(12, 11, 1, 'owner', NULL, '2026-03-29 11:32:53'),
(13, 11, 2, 'member', NULL, '2026-03-29 11:32:53'),
(14, 11, 3, 'admin', NULL, '2026-03-29 11:32:53'),
(15, 11, 4, 'member', NULL, '2026-03-29 11:32:53'),
(16, 11, 5, 'member', NULL, '2026-03-29 11:32:53'),
(17, 11, 6, 'member', NULL, '2026-03-29 11:32:53'),
(25, 11, 7, 'member', NULL, '2026-03-29 17:27:34'),
(32, 13, 1, 'owner', NULL, '2026-03-29 18:43:20'),
(33, 13, 5, 'member', NULL, '2026-03-29 18:43:20'),
(34, 13, 6, 'member', NULL, '2026-03-29 18:43:20'),
(35, 13, 4, 'member', NULL, '2026-03-29 18:43:20'),
(36, 13, 7, 'member', NULL, '2026-03-29 18:43:20'),
(37, 13, 3, 'admin', NULL, '2026-03-29 18:43:20'),
(38, 11, 8, 'member', NULL, '2026-03-29 19:20:45'),
(39, 11, 10, 'admin', NULL, '2026-03-29 19:34:26'),
(64, 14, 2, 'member', NULL, '2026-03-29 20:55:25'),
(65, 14, 5, 'member', NULL, '2026-03-29 20:55:25'),
(66, 14, 6, 'member', NULL, '2026-03-29 20:55:25'),
(67, 14, 10, 'admin', NULL, '2026-03-29 20:55:25'),
(68, 15, 4, 'member', NULL, '2026-03-29 20:55:25'),
(69, 15, 7, 'member', NULL, '2026-03-29 20:55:25'),
(70, 15, 8, 'member', NULL, '2026-03-29 20:55:25'),
(71, 15, 10, 'admin', NULL, '2026-03-29 20:55:25'),
(72, 16, 2, 'member', NULL, '2026-03-29 21:29:24'),
(73, 16, 5, 'member', NULL, '2026-03-29 21:29:24'),
(74, 16, 6, 'member', NULL, '2026-03-29 21:29:24'),
(75, 16, 3, 'admin', NULL, '2026-03-29 21:29:24'),
(76, 17, 4, 'member', NULL, '2026-03-29 21:29:51'),
(77, 17, 7, 'member', NULL, '2026-03-29 21:29:51'),
(78, 17, 8, 'member', NULL, '2026-03-29 21:29:51'),
(79, 17, 3, 'admin', NULL, '2026-03-29 21:29:51');

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
  `is_edited` tinyint(1) DEFAULT 0,
  `is_deleted` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `channel_id`, `sender_id`, `content`, `type`, `parent_id`, `file_url`, `is_edited`, `is_deleted`, `created_at`, `updated_at`) VALUES
(25, 11, 1, 'hii', 'text', NULL, NULL, 0, 0, '2026-03-30 08:34:32', '2026-03-30 09:35:44'),
(26, 11, 2, 'hello', 'text', 25, NULL, 0, 0, '2026-03-30 08:34:49', '2026-03-30 09:35:44'),
(27, 11, 1, 'Hello everyone, this is to inform you, class will remain close tommorow.', 'announcement', NULL, NULL, 0, 0, '2026-03-30 08:35:19', '2026-03-30 09:35:44'),
(28, 11, 2, 'ok sir', 'text', 27, NULL, 0, 0, '2026-03-30 08:35:36', '2026-03-30 09:35:44'),
(29, 13, 1, 'hii', 'text', NULL, NULL, 0, 0, '2026-03-30 08:39:56', '2026-03-30 09:35:44'),
(30, 13, 2, 'yo 2', 'text', NULL, NULL, 1, 1, '2026-03-30 08:53:45', '2026-03-30 10:07:23'),
(31, 13, 1, 'what', 'text', NULL, NULL, 0, 0, '2026-03-30 08:53:54', '2026-03-30 09:35:44'),
(32, 11, 2, 'yo', 'text', 27, NULL, 0, 0, '2026-03-30 08:54:53', '2026-03-30 09:35:44'),
(33, 13, 1, 'ok', 'announcement', NULL, NULL, 0, 0, '2026-03-30 08:57:20', '2026-03-30 09:35:44'),
(34, 13, 2, 'yo', 'text', NULL, NULL, 0, 0, '2026-03-30 10:12:55', '2026-03-30 10:12:55'),
(35, 13, 8, 'hii', 'text', NULL, NULL, 0, 0, '2026-03-30 10:16:13', '2026-03-30 10:16:13'),
(36, 11, 8, 'ok, what about assingment?', 'text', 27, NULL, 0, 0, '2026-03-30 10:17:58', '2026-03-30 10:17:58'),
(37, 4, 2, 'yo', 'text', NULL, NULL, 0, 0, '2026-03-30 10:20:18', '2026-03-30 10:20:18'),
(38, 13, 2, 'get lost', 'text', 35, NULL, 0, 0, '2026-03-30 10:25:42', '2026-03-30 10:25:42'),
(39, 13, 8, 'u get lost', 'text', 35, NULL, 0, 0, '2026-03-30 10:27:18', '2026-03-30 10:27:18'),
(40, 11, 2, 'ok', 'text', 27, NULL, 0, 0, '2026-04-05 17:08:39', '2026-04-05 17:08:39');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` varchar(50) NOT NULL COMMENT 'chat, announcement, system, alert',
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Stores extra info like channel_id, message_id etc' CHECK (json_valid(`data`)),
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(6, 2, 1, 10, 2, '2026-03-29 19:33:46'),
(7, 2, 2, 10, 2, '2026-03-29 19:34:18'),
(8, 1, 1, 3, 2, '2026-03-29 21:29:24'),
(9, 1, 2, 3, 2, '2026-03-29 21:29:51');

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
  `bio` text DEFAULT NULL,
  `section_id` int(11) DEFAULT NULL,
  `password` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `verification_status` enum('pending','verified') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `has_logged_in` tinyint(1) NOT NULL DEFAULT 0,
  `last_seen` timestamp NULL DEFAULT NULL,
  `is_online` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `avatar_url`, `email`, `phone`, `reg_no`, `enrollment_no`, `role`, `employment_type`, `dept_id`, `office_location`, `bio`, `section_id`, `password`, `is_active`, `verification_status`, `created_at`, `updated_at`, `has_logged_in`, `last_seen`, `is_online`) VALUES
(1, 'Sumit', NULL, 'admin@gu.in', NULL, NULL, NULL, 'dept_admin', 'Full Time', 1, NULL, NULL, NULL, '$2b$10$EGGBGcCZNHvcZnqlNDzFqeBl8laY1mLHFH8/UCvCX3Tu41UhaohKy', 1, 'verified', '2026-03-17 20:01:00', '2026-04-05 17:38:50', 0, '2026-04-05 17:38:50', 0),
(2, 'Arpit', NULL, NULL, NULL, '25SCSE2030342', '25132030846', 'student', 'Full Time', 1, NULL, NULL, 1, '$2a$10$N05x2hC9E2CDlIIz2fjT1ezQ76icmLE.9bE7iU.EazpdcyTVnmW7O', 1, 'verified', '2026-03-20 09:27:12', '2026-04-05 17:52:06', 1, '2026-04-05 17:52:06', 0),
(3, 'Priyanshu Singh', NULL, 'pr@gu.in', '911234567890', 'REG252030', 'ENR2030128', 'faculty', 'Full Time', 1, 'Block-C Room-443', NULL, NULL, NULL, 1, 'verified', '2026-03-20 09:28:05', '2026-03-29 21:28:50', 0, NULL, 0),
(4, 'Aditya', NULL, NULL, NULL, '25SCSE2030243', '2039198398', 'student', 'Full Time', 1, NULL, NULL, 2, NULL, 1, 'pending', '2026-03-20 13:23:22', '2026-03-29 18:53:09', 0, NULL, 0),
(5, 'Test1', NULL, NULL, NULL, '25SCSE2030431', '124214323', 'student', 'Full Time', 1, NULL, NULL, 1, NULL, 1, 'pending', '2026-03-22 09:17:50', '2026-03-29 18:53:11', 0, NULL, 0),
(6, 'Test2', NULL, NULL, NULL, '25SCSE2030432', '124214324', 'student', 'Full Time', 1, NULL, NULL, 1, NULL, 1, 'pending', '2026-03-22 09:17:50', '2026-03-29 18:53:14', 0, NULL, 0),
(7, 'Test3', NULL, 'test3@gu.in', NULL, 'reg893439', 'enr938439', 'student', 'Full Time', 1, NULL, NULL, 2, NULL, 1, 'pending', '2026-03-29 17:27:21', '2026-03-29 18:53:16', 0, NULL, 0),
(8, 'test4', NULL, NULL, NULL, 'reg83939', 'enr98393', 'student', 'Full Time', 1, NULL, NULL, 2, '$2a$10$nkXf0gpnkWIRaYgtctaQQ.81gI0BP8X9Q6b1UcQbwBff.DaEA7pTC', 1, 'verified', '2026-03-29 18:54:08', '2026-03-30 10:27:57', 1, '2026-03-30 10:27:57', 0),
(10, 'Aditya', NULL, 'adi@gu.in', NULL, 'reg8934392', 'enr89339', 'faculty', 'Full Time', 1, NULL, NULL, NULL, '$2a$10$coO/aJ8SyC53iP6/voH1TeLyoJmp1gmPUnWs9IVaUZ6SPblh3h8ey', 1, 'verified', '2026-03-29 19:33:25', '2026-04-05 17:53:23', 1, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `user_preferences`
--

CREATE TABLE `user_preferences` (
  `user_id` int(11) NOT NULL,
  `theme` varchar(20) DEFAULT 'light',
  `notifications_enabled` tinyint(1) DEFAULT 1,
  `email_alerts` tinyint(1) DEFAULT 1,
  `language` varchar(10) DEFAULT 'en'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_visibility` (`visibility`),
  ADD KEY `idx_target_section` (`target_section_id`),
  ADD KEY `idx_target_dept` (`target_dept_id`),
  ADD KEY `idx_created_at` (`created_at` DESC),
  ADD KEY `idx_is_active` (`is_active`),
  ADD KEY `idx_announcements_visibility_date` (`visibility`,`created_at` DESC),
  ADD KEY `idx_type` (`type`);

--
-- Indexes for table `announcement_targets`
--
ALTER TABLE `announcement_targets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `announcement_id` (`announcement_id`),
  ADD KEY `target_section_id` (`target_section_id`),
  ADD KEY `target_dept_id` (`target_dept_id`);

--
-- Indexes for table `assignments`
--
ALTER TABLE `assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_faculty_assignment` (`created_by`),
  ADD KEY `idx_due_date` (`due_date`);

--
-- Indexes for table `assignment_targets`
--
ALTER TABLE `assignment_targets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `assignment_id` (`assignment_id`),
  ADD KEY `subject_offering_id` (`subject_offering_id`);

--
-- Indexes for table `channels`
--
ALTER TABLE `channels`
  ADD PRIMARY KEY (`id`),
  ADD KEY `dept_id` (`dept_id`),
  ADD KEY `term_id` (`term_id`),
  ADD KEY `idx_channels_type` (`type`),
  ADD KEY `idx_channels_section` (`section_id`),
  ADD KEY `idx_channels_subject` (`subject_offering_id`),
  ADD KEY `fk_channel_creator` (`creator_id`);

--
-- Indexes for table `channel_members`
--
ALTER TABLE `channel_members`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_member` (`channel_id`,`user_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `fk_member_last_read` (`last_read_message_id`);

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
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_notif_user` (`user_id`),
  ADD KEY `idx_notif_read` (`is_read`);

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
-- Indexes for table `user_preferences`
--
ALTER TABLE `user_preferences`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `announcement_targets`
--
ALTER TABLE `announcement_targets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `assignments`
--
ALTER TABLE `assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `assignment_targets`
--
ALTER TABLE `assignment_targets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `channels`
--
ALTER TABLE `channels`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `channel_members`
--
ALTER TABLE `channel_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=80;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `terms`
--
ALTER TABLE `terms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `announcements`
--
ALTER TABLE `announcements`
  ADD CONSTRAINT `1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `2` FOREIGN KEY (`target_section_id`) REFERENCES `sections` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `3` FOREIGN KEY (`target_dept_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `announcement_targets`
--
ALTER TABLE `announcement_targets`
  ADD CONSTRAINT `1` FOREIGN KEY (`announcement_id`) REFERENCES `announcements` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `2` FOREIGN KEY (`target_section_id`) REFERENCES `sections` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `3` FOREIGN KEY (`target_dept_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `assignments`
--
ALTER TABLE `assignments`
  ADD CONSTRAINT `1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `assignment_targets`
--
ALTER TABLE `assignment_targets`
  ADD CONSTRAINT `1` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `2` FOREIGN KEY (`subject_offering_id`) REFERENCES `subject_offerings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `channels`
--
ALTER TABLE `channels`
  ADD CONSTRAINT `1` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `2` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `3` FOREIGN KEY (`subject_offering_id`) REFERENCES `subject_offerings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `4` FOREIGN KEY (`term_id`) REFERENCES `terms` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_channel_creator` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `channel_members`
--
ALTER TABLE `channel_members`
  ADD CONSTRAINT `1` FOREIGN KEY (`channel_id`) REFERENCES `channels` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_member_last_read` FOREIGN KEY (`last_read_message_id`) REFERENCES `messages` (`id`) ON DELETE SET NULL;

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
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `fk_notif_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

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

--
-- Constraints for table `user_preferences`
--
ALTER TABLE `user_preferences`
  ADD CONSTRAINT `fk_pref_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
