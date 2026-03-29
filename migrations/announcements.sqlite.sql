-- SQLite Version: Create Announcements Table
-- This table stores official announcements posted by admins to students

CREATE TABLE IF NOT EXISTS announcements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'normal' CHECK(type IN ('important', 'normal', 'event')),
  visibility TEXT DEFAULT 'all' CHECK(visibility IN ('all', 'section', 'department')),
  
  -- Targeting
  target_section_id INTEGER,
  target_dept_id INTEGER,
  
  -- Event Specific Fields (NULL for non-events)
  event_date DATETIME NULL,
  event_location TEXT NULL,
  event_registration_url TEXT NULL,
  image_url TEXT NULL,
  
  created_by INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_active INTEGER DEFAULT 1,
  
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (target_section_id) REFERENCES sections(id),
  FOREIGN KEY (target_dept_id) REFERENCES departments(id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_announcements_visibility ON announcements(visibility);
CREATE INDEX IF NOT EXISTS idx_announcements_target_section ON announcements(target_section_id);
CREATE INDEX IF NOT EXISTS idx_announcements_target_dept ON announcements(target_dept_id);
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
