const pool = require('../config/db');

const getAllTerms = async () => {
  const [rows] = await pool.execute('SELECT * FROM terms ORDER BY created_at DESC');
  return rows;
};

const createTerm = async (data) => {
  const { name, is_active } = data;

  // 1. If is_active is true, deactivate all other terms first
  if (is_active) {
    await pool.execute('UPDATE terms SET is_active = FALSE');
  }

  // 2. Insert new term
  const [result] = await pool.execute(
    'INSERT INTO terms (name, is_active) VALUES (?, ?)',
    [name, is_active || false]
  );

  return { id: result.insertId, name, is_active };
};

const setActiveTerm = async (id) => {
  // 1. Deactivate all terms
  await pool.execute('UPDATE terms SET is_active = FALSE');
  
  // 2. Set specific term as active
  await pool.execute('UPDATE terms SET is_active = TRUE WHERE id = ?', [id]);
  
  return { success: true, message: 'Active term updated' };
};

module.exports = {
  getAllTerms,
  createTerm,
  setActiveTerm
};
