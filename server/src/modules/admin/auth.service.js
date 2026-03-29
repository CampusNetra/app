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
  const regNo = data?.reg_no?.trim();
  const enrollmentNo = data?.enrollment_no?.trim();

  if (!regNo || !enrollmentNo) {
    throw new Error('Registration Number and Enrollment Number are required');
  }

  const [users] = await pool.execute(
    `SELECT
      u.id,
      u.name,
      u.email,
      u.reg_no,
      u.enrollment_no,
      u.role,
      u.dept_id,
      u.section_id,
      u.is_active,
      u.verification_status,
      d.name AS dept_name,
      s.name AS section_name
    FROM users u
    LEFT JOIN departments d ON d.id = u.dept_id
    LEFT JOIN sections s ON s.id = u.section_id
    WHERE u.role = 'student' AND u.reg_no = ? AND u.enrollment_no = ?
    LIMIT 1`,
    [regNo, enrollmentNo]
  );

  if (users.length === 0) {
    throw new Error('No matching student record found. Please check your Registration Number and Enrollment Number.');
  }

  const student = users[0];
  if (Number(student.is_active) === 0) {
    throw new Error('Your account is currently inactive. Please contact your department admin.');
  }

  await pool.execute(
    'UPDATE users SET has_logged_in = 1 WHERE id = ? AND role = ?',
    [student.id, 'student']
  );

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

module.exports = {
  signup,
  login,
  studentLogin
};
