-- SQLite Version: Create Announcements Table
-- This table stores official announcements posted by admins to students

CREATE TABLE IF NOT EXISTS announcements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'normal' CHECK(type IN ('important', 'normal', 'event')),
  visibility TEXT DEFAULT 'all' CHECK(visibility IN ('all', 'section', 'department')),
  
  -- Event Specific Fields (NULL for non-events)
  event_date DATETIME NULL,
  event_location TEXT NULL,
  event_registration_url TEXT NULL,
  image_url TEXT NULL,
  
  created_by INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_active INTEGER DEFAULT 1,
  
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Mapping for multiple targets
CREATE TABLE IF NOT EXISTS announcement_targets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  announcement_id INTEGER NOT NULL,
  target_section_id INTEGER DEFAULT NULL,
  target_dept_id INTEGER DEFAULT NULL,
  FOREIGN KEY (announcement_id) REFERENCES announcements(id) ON DELETE CASCADE,
  FOREIGN KEY (target_section_id) REFERENCES sections(id),
  FOREIGN KEY (target_dept_id) REFERENCES departments(id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_announcements_visibility ON announcements(visibility);
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON announcements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_is_active ON announcements(is_active);
CREATE INDEX IF NOT EXISTS idx_announcements_type ON announcements(type);

-- ==========================================
-- MIGRATION: Update Existing SQLite Table
-- ==========================================
-- These ALTER statements add columns if you already have the announcements table

-- ALTER TABLE announcements ADD COLUMN event_date DATETIME NULL;
-- ALTER TABLE announcements ADD COLUMN event_location TEXT NULL;
-- ALTER TABLE announcements ADD COLUMN event_registration_url TEXT NULL;
-- ALTER TABLE announcements ADD COLUMN image_url TEXT NULL;

------------------------------------------------------------------


-- SQLite Version: Create Assignments Table
-- Used for local development and testing

CREATE TABLE IF NOT EXISTS assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  
  -- Timing & Management
  due_date DATETIME,
  attachment_url TEXT,
  allow_submission BOOLEAN DEFAULT 1,
  
  created_by INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT 1,

  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS assignment_targets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  assignment_id INTEGER NOT NULL,
  subject_offering_id INTEGER NOT NULL,
  FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
  FOREIGN KEY (subject_offering_id) REFERENCES subject_offerings(id) ON DELETE CASCADE
);

-- Polling System
CREATE TABLE IF NOT EXISTS polls (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question TEXT NOT NULL,
  options TEXT NOT NULL, -- JSON string
  created_by INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_active INTEGER DEFAULT 1,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS poll_targets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  poll_id INTEGER NOT NULL,
  target_section_id INTEGER DEFAULT NULL,
  target_dept_id INTEGER DEFAULT NULL,
  FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE,
  FOREIGN KEY (target_section_id) REFERENCES sections(id),
  FOREIGN KEY (target_dept_id) REFERENCES departments(id)
);

CREATE TABLE IF NOT EXISTS poll_responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  poll_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  option_index INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(poll_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_faculty_assignment ON assignments(created_by);
CREATE INDEX IF NOT EXISTS idx_due_date ON assignments(due_date ASC);
