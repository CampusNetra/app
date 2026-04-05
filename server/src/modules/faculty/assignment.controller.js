const assignmentService = require('../../services/assignment.service');

const createAssignment = async (req, res) => {
  try {
    const { id: created_by } = req.user;
    const { title, description, offering_ids, due_date, attachment_url, allow_submission } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Assignment title is required' });
    }

    if (!offering_ids || (Array.isArray(offering_ids) && offering_ids.length === 0)) {
        return res.status(400).json({ error: 'At least one subject/section is required' });
    }

    // Ensure array
    const targets = Array.isArray(offering_ids) ? offering_ids : [offering_ids];

    const assignment = await assignmentService.createAssignment({
      title,
      description,
      offering_ids: targets,
      due_date,
      attachment_url,
      allow_submission,
      created_by
    });

    res.status(201).json(assignment);
  } catch (error) {
    console.error('[AssignmentController] Error creating assignment:', error);
    res.status(500).json({ error: error.message });
  }
};

const getMyAssignments = async (req, res) => {
    try {
        const { id: faculty_id } = req.user;
        const assignments = await assignmentService.getFacultyAssignments(faculty_id);
        res.json(assignments);
    } catch (error) {
        console.error('[AssignmentController] Error fetching assignments:', error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
  createAssignment,
  getMyAssignments
};
