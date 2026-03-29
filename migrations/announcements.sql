-- MySQL Version: Create Announcements Table
-- This table stores official announcements posted by admins to students

CREATE TABLE IF NOT EXISTS announcements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content LONGTEXT NOT NULL,
  type ENUM('important', 'normal', 'event') DEFAULT 'normal',
  visibility ENUM('all', 'section', 'department') DEFAULT 'all',
  
  -- Targeting
  target_section_id INT NULL,
  target_dept_id INT NULL,
  
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
  FOREIGN KEY (target_section_id) REFERENCES sections(id) ON DELETE SET NULL,
  FOREIGN KEY (target_dept_id) REFERENCES departments(id) ON DELETE SET NULL,
  
  INDEX idx_visibility (visibility),
  INDEX idx_target_section (target_section_id),
  INDEX idx_target_dept (target_dept_id),
  INDEX idx_created_at (created_at DESC),
  INDEX idx_is_active (is_active),
  INDEX idx_type (type)
);
