-- MySQL Version: Create Announcements Table
-- This table stores official announcements posted by admins to students

CREATE TABLE IF NOT EXISTS announcements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content LONGTEXT NOT NULL,
  type ENUM('important', 'normal', 'event') DEFAULT 'normal',
  visibility ENUM('all', 'section', 'department') DEFAULT 'all',
  
  -- Event Specific Fields (NULL for non-events)
  event_date DATETIME NULL,
  event_location VARCHAR(255) NULL,
  event_registration_url VARCHAR(280) NULL,
  image_url VARCHAR(255) NULL,
  
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_active TINYINT DEFAULT 1,
  
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
  
  INDEX idx_visibility (visibility),
  INDEX idx_created_at (created_at DESC),
  INDEX idx_is_active (is_active),
  INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Mapping for multiple targets (Sections, etc.)
CREATE TABLE IF NOT EXISTS announcement_targets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  announcement_id INT NOT NULL,
  target_section_id INT DEFAULT NULL,
  target_dept_id INT DEFAULT NULL,
  FOREIGN KEY (announcement_id) REFERENCES announcements(id) ON DELETE CASCADE,
  FOREIGN KEY (target_section_id) REFERENCES sections(id) ON DELETE CASCADE,
  FOREIGN KEY (target_dept_id) REFERENCES departments(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- MySQL Version: Create Assignments Table
CREATE TABLE IF NOT EXISTS assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description LONGTEXT DEFAULT NULL,
  
  -- Timing & Management
  due_date DATETIME DEFAULT NULL,
  attachment_url VARCHAR(255) DEFAULT NULL,
  allow_submission TINYINT DEFAULT 1,
  
  created_by INT NOT NULL, 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_active TINYINT DEFAULT 1,

  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_faculty_assignment (created_by),
  INDEX idx_due_date (due_date ASC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Mapping for multiple subject offerings (sections)
CREATE TABLE IF NOT EXISTS assignment_targets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  assignment_id INT NOT NULL,
  subject_offering_id INT NOT NULL,
  FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
  FOREIGN KEY (subject_offering_id) REFERENCES subject_offerings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Polling System
CREATE TABLE IF NOT EXISTS polls (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question VARCHAR(255) NOT NULL,
  options JSON NOT NULL, -- e.g. ["Option A", "Option B"]
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_active TINYINT DEFAULT 1,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS poll_targets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  poll_id INT NOT NULL,
  target_section_id INT DEFAULT NULL,
  target_dept_id INT DEFAULT NULL,
  FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE,
  FOREIGN KEY (target_section_id) REFERENCES sections(id) ON DELETE CASCADE,
  FOREIGN KEY (target_dept_id) REFERENCES departments(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS poll_responses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  poll_id INT NOT NULL,
  user_id INT NOT NULL,
  option_index INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_poll_user (poll_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
