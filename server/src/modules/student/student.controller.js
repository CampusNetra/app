const studentService = require('../../services/student.service');

const getFeed = async (req, res) => {
  try {
    const user = req.user || {};
    
    console.log('[StudentController] getFeed called');
    console.log('[StudentController] req.user:', user);
    console.log('[StudentController] user.role:', user.role);
    console.log('[StudentController] user.id:', user.id);
    
    if (!user || !user.id) {
      console.log('[StudentController] No user or user.id found');
      return res.status(401).json({ error: 'Unauthorized: No user found' });
    }
    
    if (user.role !== 'student') {
      console.log(`[StudentController] Role mismatch: expected 'student', got '${user.role}'`);
      return res.status(403).json({ error: `Only students can access feed (got role: ${user.role})` });
    }

    const data = await studentService.getFeed({
      user_id: user.id,
      dept_id: user.dept_id,
      section_id: user.section_id,
      limit: req.query.limit || 50
    });

    return res.json(data);
  } catch (error) {
    console.error('[StudentController] Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch student feed' });
  }
};

module.exports = {
  getFeed
};
