-- Migration to add faculty details to users table
ALTER TABLE users ADD COLUMN phone VARCHAR(20) AFTER email;
ALTER TABLE users ADD COLUMN office_location VARCHAR(100) AFTER dept_id;
ALTER TABLE users ADD COLUMN employment_type VARCHAR(50) DEFAULT 'Full Time' AFTER role;
ALTER TABLE users ADD COLUMN avatar_url VARCHAR(255) AFTER name;

-- Login tracking column (MySQL / normal SQL)
ALTER TABLE users
ADD COLUMN has_logged_in TINYINT(1) NOT NULL DEFAULT 0;

-- Login tracking column (SQLite)
-- Run this on SQLite databases instead of the MySQL query above.
ALTER TABLE users
ADD COLUMN has_logged_in INTEGER NOT NULL DEFAULT 0;

-- Ensure some test activity data for the image
-- (Optional: only if you want to see sample activity)
-- INSERT INTO messages (channel_id, sender_id, content, type) 
-- VALUES (1, 1, 'Updated syllabus for Calculus', 'announcement');
