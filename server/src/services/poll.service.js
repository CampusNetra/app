const pool = require('../config/db');

const createPoll = async (data) => {
  const { question, options, targets = [], created_by } = data;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [result] = await connection.execute(
      `INSERT INTO polls (question, options, created_by) VALUES (?, ?, ?)`,
      [question, JSON.stringify(options), created_by]
    );

    const pollId = result.insertId;

    if (targets && targets.length > 0) {
      for (const target of targets) {
        if (target.type === 'section') {
           await connection.execute(
             `INSERT INTO poll_targets (poll_id, target_section_id) VALUES (?, ?)`,
             [pollId, target.id]
           );
        } else if (target.type === 'department') {
           await connection.execute(
             `INSERT INTO poll_targets (poll_id, target_dept_id) VALUES (?, ?)`,
             [pollId, target.id]
           );
        }
      }
    }

    await connection.commit();
    return { id: pollId, question, options, targets };
  } catch (err) {
    await connection.rollback();
    console.error('[PollService] Error creating poll:', err);
    throw err;
  } finally {
    connection.release();
  }
};

const getFacultyPolls = async (faculty_id) => {
  try {
    const [rows] = await pool.execute(`
      SELECT p.*, 
        (SELECT COUNT(*) FROM poll_responses pr WHERE pr.poll_id = p.id) as response_count
      FROM polls p
      WHERE p.created_by = ?
      ORDER BY p.created_at DESC
    `, [faculty_id]);

    return rows.map(r => ({ ...r, options: JSON.parse(r.options) }));
  } catch (err) {
    console.error('[PollService] Error fetching polls:', err);
    throw err;
  }
};

module.exports = {
  createPoll,
  getFacultyPolls
};
