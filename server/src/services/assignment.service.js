const pool = require('../config/db');

const createAssignment = async (data) => {
  const { title, description, offering_ids = [], due_date, attachment_url, allow_submission, created_by } = data;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [result] = await connection.execute(`
      INSERT INTO assignments 
      (title, description, due_date, attachment_url, allow_submission, created_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [title, description, due_date || null, attachment_url || null, allow_submission ? 1 : 0, created_by]);

    const assignmentId = result.insertId;

    if (offering_ids && offering_ids.length > 0) {
      for (const offering_id of offering_ids) {
        await connection.execute(`
          INSERT INTO assignment_targets (assignment_id, subject_offering_id)
          VALUES (?, ?)
        `, [assignmentId, offering_id]);
      }
    }

    await connection.commit();
    return { id: assignmentId, ...data };
  } catch (err) {
    await connection.rollback();
    console.error('[AssignmentService] Error creating assignment:', err);
    throw err;
  } finally {
    connection.release();
  }
};

const getFacultyAssignments = async (faculty_id) => {
  const [rows] = await pool.execute(`
    SELECT a.*, 
      GROUP_CONCAT(DISTINCT s.name SEPARATOR ', ') as subjects,
      GROUP_CONCAT(DISTINCT sec.name SEPARATOR ', ') as sections
    FROM assignments a
    LEFT JOIN assignment_targets at ON at.assignment_id = a.id
    LEFT JOIN subject_offerings so ON so.id = at.subject_offering_id
    LEFT JOIN subjects s ON s.id = so.subject_id
    LEFT JOIN sections sec ON sec.id = so.section_id
    WHERE a.created_by = ?
    GROUP BY a.id
    ORDER BY a.created_at DESC
  `, [faculty_id]);
  return rows;
};

module.exports = {
  createAssignment,
  getFacultyAssignments
};
