const pool = require('../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getJwtSecret = () => {
  if (typeof globalThis !== 'undefined' && globalThis.JWT_SECRET) {
    return globalThis.JWT_SECRET;
  }
  return process.env.JWT_SECRET || 'campus_netra_secret_key_123';
};

const getJwtExpire = () => {
  if (typeof globalThis !== 'undefined' && globalThis.JWT_EXPIRE) {
    return globalThis.JWT_EXPIRE;
  }
  return process.env.JWT_EXPIRE || '1d';
};

const signup = async (data) => {
  const { name, email, password, dept_name } = data;

  // 1. Check if user exists
  const [existingUser] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
  if (existingUser.length > 0) {
    throw new Error('Account already exists');
  }

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Create or fetch department
  let dept_id;
  const [existingDept] = await pool.execute('SELECT id FROM departments WHERE name = ?', [dept_name]);
  
  if (existingDept.length > 0) {
    dept_id = existingDept[0].id;
  } else {
    const [result] = await pool.execute('INSERT INTO departments (name) VALUES (?)', [dept_name]);
    dept_id = result.insertId;
  }

  // 4. Create user
  await pool.execute(
    'INSERT INTO users (name, email, password, role, dept_id, verification_status) VALUES (?, ?, ?, ?, ?, ?)',
    [name, email, hashedPassword, 'dept_admin', dept_id, 'verified']
  );

  return { success: true, message: 'Account created successfully' };
};

const login = async (data) => {
  const { email, password } = data;

  // 1. Find user
  const [users] = await pool.execute(
    `SELECT 
      u.id,
      u.name,
      u.email,
      u.password,
      u.role,
      u.dept_id,
      d.name AS dept_name
    FROM users u
    LEFT JOIN departments d ON d.id = u.dept_id
    WHERE u.email = ?`,
    [email]
  );

  if (users.length === 0) {
    throw new Error('User not found');
  }

  const user = users[0];

  // 2. Check role
  if (user.role !== 'dept_admin') {
    throw new Error('Unauthorized');
  }

  // 3. Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Incorrect password');
  }

  // 4. Generate JWT
  const token = jwt.sign(
    { id: user.id, role: user.role, dept_id: user.dept_id },
    getJwtSecret(),
    { expiresIn: getJwtExpire() }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      dept_id: user.dept_id,
      dept_name: user.dept_name,
      role: user.role
    }
  };
};

const studentLogin = async (data) => {
  const { identifier, password } = data;

  if (!identifier || !password) {
    throw new Error('Registration Number and Password are required');
  }

  const [users] = await pool.execute(
    `SELECT u.*, d.name AS dept_name, s.name AS section_name 
     FROM users u 
     LEFT JOIN departments d ON d.id = u.dept_id 
     LEFT JOIN sections s ON s.id = u.section_id 
     WHERE u.role = 'student' AND (u.reg_no = ? OR u.name = ?)
     LIMIT 1`,
    [identifier.trim(), identifier.trim()]
  );

  if (users.length === 0) {
    throw new Error('No student record found. Please register first.');
  }

  const student = users[0];

  if (Number(student.has_logged_in) === 0) {
    // Custom error code or flag to trigger modal
    const err = new Error('You need to create your account password first.');
    err.code = 'NEED_REGISTRATION';
    throw err;
  }

  if (Number(student.is_active) === 0) {
    throw new Error('Your account is currently inactive. Please contact your department admin.');
  }

  const isMatch = await bcrypt.compare(password, student.password);
  if (!isMatch) {
    throw new Error('Incorrect password');
  }

  const token = jwt.sign(
    { id: student.id, role: student.role, dept_id: student.dept_id, section_id: student.section_id },
    getJwtSecret(),
    { expiresIn: getJwtExpire() }
  );

  return {
    token,
    user: {
      id: student.id,
      name: student.name,
      email: student.email,
      reg_no: student.reg_no,
      enrollment_no: student.enrollment_no,
      role: student.role,
      dept_id: student.dept_id,
      dept_name: student.dept_name,
      section_id: student.section_id,
      section_name: student.section_name,
      verification_status: student.verification_status
    }
  };
};

const studentRegisterCheck = async (data) => {
  const regNo = data?.reg_no?.trim();
  const enrollmentNo = data?.enrollment_no?.trim();

  if (!regNo || !enrollmentNo) {
    throw new Error('Registration Number and Enrollment Number are required to find your record.');
  }

  const [users] = await pool.execute(
    'SELECT id, name, has_logged_in FROM users WHERE role = "student" AND reg_no = ? AND enrollment_no = ?',
    [regNo, enrollmentNo]
  );

  if (users.length === 0) {
    throw new Error('No record found matching these details. Please contact your admin.');
  }

  const student = users[0];
  if (student.has_logged_in) {
    throw new Error('Account already registered. Please login with your password.');
  }

  return { student_id: student.id, name: student.name };
};

const studentSetPassword = async (data) => {
  const { student_id, password } = data;

  if (!student_id || !password) {
    throw new Error('Invalid registration data');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await pool.execute(
    'UPDATE users SET password = ?, has_logged_in = 1, verification_status = "verified" WHERE id = ? AND role = "student"',
    [hashedPassword, student_id]
  );

  return { success: true, message: 'Password created successfully. You can now login.' };
};

const facultyLogin = async (data) => {
  const { identifier, password } = data;

  if (!identifier || !password) {
    throw new Error('Registration Number/Email and Password are required');
  }

  const [users] = await pool.execute(
    `SELECT u.*, d.name AS dept_name 
     FROM users u 
     LEFT JOIN departments d ON d.id = u.dept_id 
     WHERE u.role = 'faculty' AND (u.reg_no = ? OR u.email = ?)
     LIMIT 1`,
    [identifier.trim(), identifier.trim()]
  );

  if (users.length === 0) {
    throw new Error('No faculty record found. Please register first.');
  }

  const faculty = users[0];

  if (Number(faculty.has_logged_in) === 0) {
    const err = new Error('Your account is not activated. Please create your password first.');
    err.code = 'NEED_REGISTRATION';
    throw err;
  }

  if (Number(faculty.is_active) === 0) {
    throw new Error('Your account is currently inactive. Please contact your administrator.');
  }

  const isMatch = await bcrypt.compare(password, faculty.password);
  if (!isMatch) {
    throw new Error('Incorrect password');
  }

  const token = jwt.sign(
    { id: faculty.id, role: faculty.role, dept_id: faculty.dept_id },
    getJwtSecret(),
    { expiresIn: getJwtExpire() }
  );

  return {
    token,
    user: {
      id: faculty.id,
      name: faculty.name,
      email: faculty.email,
      reg_no: faculty.reg_no,
      role: faculty.role,
      dept_id: faculty.dept_id,
      dept_name: faculty.dept_name,
      office_location: faculty.office_location,
      verification_status: faculty.verification_status
    }
  };
};

const facultyRegisterCheck = async (data) => {
  const regNo = data?.reg_no?.trim();
  const email = data?.email?.trim();

  if (!regNo || !email) {
    throw new Error('Registration Number and Organizational Email are required.');
  }

  const [users] = await pool.execute(
    'SELECT id, name, has_logged_in FROM users WHERE role = "faculty" AND reg_no = ? AND email = ?',
    [regNo, email]
  );

  if (users.length === 0) {
    throw new Error('No faculty record found with these details. Please contact the administrator.');
  }

  const faculty = users[0];
  if (faculty.has_logged_in) {
    throw new Error('Account already registered. Please login with your password.');
  }

  return { faculty_id: faculty.id, name: faculty.name };
};

const facultySetPassword = async (data) => {
  const { faculty_id, password } = data;

  if (!faculty_id || !password) {
    throw new Error('Invalid registration data');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await pool.execute(
    'UPDATE users SET password = ?, has_logged_in = 1, verification_status = "verified" WHERE id = ? AND role = "faculty"',
    [hashedPassword, faculty_id]
  );

  return { success: true, message: 'Faculty account activated successfully. You can now login.' };
};

module.exports = {
  signup,
  login,
  studentLogin,
  studentRegisterCheck,
  studentSetPassword,
  facultyLogin,
  facultyRegisterCheck,
  facultySetPassword
};
