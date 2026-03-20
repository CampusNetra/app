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

const updateTerm = async (id, data) => {
  const { name, is_active } = data;

  if (is_active) {
    await pool.execute('UPDATE terms SET is_active = FALSE');
  }

  await pool.execute(
    'UPDATE terms SET name = ?, is_active = ? WHERE id = ?',
    [name, is_active || false, id]
  );

  return { id, name, is_active };
};

const deleteTerm = async (id) => {
  // Check if term exists
  const [rows] = await pool.execute('SELECT is_active FROM terms WHERE id = ?', [id]);
  if (rows.length === 0) throw new Error('Term not found');

  if (rows[0].is_active) {
    throw new Error('Cannot delete the currently active academic term.');
  }

  await pool.execute('DELETE FROM terms WHERE id = ?', [id]);
  return { success: true };
};

module.exports = {
  getAllTerms,
  createTerm,
  setActiveTerm,
  updateTerm,
  deleteTerm
};
