Executed 1/1

CREATE TABLE sections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR (
    50
  ) NOT NULL,
  dept_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_section (
    name,
    dept_id
  ),
  FOREIGN KEY (
    dept_id
  ) REFERENCES departments (
    id
  ) ON DELETE CASCADE
);

Error: near "KEY": syntax error at offset 173: SQLITE_ERROR


Executed 1/1

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR (
    150
  ) NOT NULL,
  email VARCHAR (
    150
  ) UNIQUE,
  reg_no VARCHAR (
    100
  ) UNIQUE,
  enrollment_no VARCHAR (
    100
  ) UNIQUE,
  role ENUM (
    'student',
    'faculty',
    'dept_admin',
    'super_admin'
  ) NOT NULL,
  dept_id INT,
  section_id INT,
  password TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  verification_status ENUM (
    'pending',
    'verified'
  ) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (
    dept_id
  ) REFERENCES departments (
    id
  ) ON DELETE
  SET
    NULL,
    FOREIGN KEY (
      section_id
    ) REFERENCES sections (
      id
    ) ON DELETE
  SET
    NULL
);

Error: near "'student'": syntax error at offset 238: SQLITE_ERROR