const pool = require('../config/db');

const getPollBreakdown = async (poll_id, optionsInput = null, connection = pool) => {
  let options = optionsInput;

  if (!options) {
    const [pollRows] = await connection.execute(
      `SELECT options FROM polls WHERE id = ? LIMIT 1`,
      [poll_id]
    );

    if (!pollRows[0]) {
      return {
        response_count: 0,
        option_results: []
      };
    }

    options = JSON.parse(pollRows[0].options || '[]');
  }

  const [rows] = await connection.execute(
    `SELECT option_index, COUNT(*) as vote_count
     FROM poll_responses
     WHERE poll_id = ?
     GROUP BY option_index`,
    [poll_id]
  );

  const countsMap = new Map((rows || []).map((row) => [Number(row.option_index), Number(row.vote_count)]));
  const response_count = Array.from(countsMap.values()).reduce((sum, value) => sum + value, 0);

  const option_results = (options || []).map((option, index) => {
    const vote_count = countsMap.get(index) || 0;
    const percentage = response_count > 0 ? Math.round((vote_count / response_count) * 100) : 0;

    return {
      option,
      option_index: index,
      vote_count,
      percentage
    };
  });

  return {
    response_count,
    option_results
  };
};

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

    return Promise.all(
      rows.map(async (row) => {
        const options = JSON.parse(row.options || '[]');
        const breakdown = await getPollBreakdown(row.id, options);
        return {
          ...row,
          options,
          response_count: breakdown.response_count,
          option_results: breakdown.option_results
        };
      })
    );
  } catch (err) {
    console.error('[PollService] Error fetching polls:', err);
    throw err;
  }
};

const submitPollResponse = async ({ poll_id, user_id, option_index, dept_id, section_id }) => {
  const connection = await pool.getConnection();
  try {
    const [eligibleRows] = await connection.execute(
      `SELECT p.id
       FROM polls p
       LEFT JOIN poll_targets pt ON pt.poll_id = p.id
       WHERE p.id = ?
         AND p.is_active = 1
         AND (
           pt.target_section_id = ?
           OR pt.target_dept_id = ?
         )
       LIMIT 1`,
      [poll_id, section_id || null, dept_id || null]
    );

    if (!eligibleRows[0]) {
      throw new Error('Poll not available for this student');
    }

    const [pollRows] = await connection.execute(
      `SELECT options FROM polls WHERE id = ? LIMIT 1`,
      [poll_id]
    );

    if (!pollRows[0]) {
      throw new Error('Poll not found');
    }

    const options = JSON.parse(pollRows[0].options || '[]');
    if (!Number.isInteger(option_index) || option_index < 0 || option_index >= options.length) {
      throw new Error('Invalid poll option');
    }

    const [existingRows] = await connection.execute(
      `SELECT id FROM poll_responses WHERE poll_id = ? AND user_id = ? LIMIT 1`,
      [poll_id, user_id]
    );

    if (existingRows[0]) {
      throw new Error('Your vote has already been recorded');
    }

    await connection.execute(
      `INSERT INTO poll_responses (poll_id, user_id, option_index)
       VALUES (?, ?, ?)`,
      [poll_id, user_id, option_index]
    );

    const breakdown = await getPollBreakdown(poll_id, options, connection);

    return {
      poll_id,
      option_index,
      response_count: breakdown.response_count,
      option_results: breakdown.option_results
    };
  } catch (err) {
    console.error('[PollService] Error submitting poll response:', err);
    throw err;
  } finally {
    connection.release();
  }
};

module.exports = {
  createPoll,
  getFacultyPolls,
  submitPollResponse,
  getPollBreakdown
};
