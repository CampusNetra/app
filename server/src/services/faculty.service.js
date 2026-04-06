const pool = require('../config/db');

const getFacultyDashboard = async (faculty_id) => {
  try {
    // 1. Fetch Faculty Profile info
    const [facultyRows] = await pool.execute(`
      SELECT id, name, email, avatar_url, role, dept_id, office_location 
      FROM users 
      WHERE id = ? AND role = 'faculty'
    `, [faculty_id]);

    if (!facultyRows[0]) throw new Error('Faculty not found');
    const faculty = facultyRows[0];

    // 2. Fetch Assigned Subject Offerings (Classes)
    const [offerings] = await pool.execute(`
      SELECT 
        so.id as offering_id,
        s.name as subject_name,
        sec.name as section_name,
        c.id as channel_id
      FROM subject_offerings so
      JOIN subjects s ON s.id = so.subject_id
      JOIN sections sec ON sec.id = so.section_id
      LEFT JOIN channels c ON c.subject_offering_id = so.id
      WHERE so.faculty_id = ?
    `, [faculty_id]);

    // 3. Fetch Recent Activity
    // - Recent messages in their channels
    // - Recent announcements created by them
    const [messages] = await pool.execute(`
      SELECT 
        m.id, m.content, m.created_at, m.type as msg_type,
        sender.name as sender_name, sender.avatar_url as sender_avatar,
        c.name as channel_name, c.id as channel_id,
        'message' as activity_type
      FROM messages m
      JOIN users sender ON sender.id = m.sender_id
      JOIN channels c ON c.id = m.channel_id
      WHERE m.channel_id IN (
        SELECT id FROM channels WHERE subject_offering_id IN (
          SELECT id FROM subject_offerings WHERE faculty_id = ?
        )
      ) AND m.sender_id != ?
      ORDER BY m.created_at DESC
      LIMIT 10
    `, [faculty_id, faculty_id]);

    const [announcements] = await pool.execute(`
      SELECT 
        id, title as content, created_at, 'announcement' as activity_type,
        'Announcement' as sender_name, NULL as sender_avatar,
        NULL as channel_name, NULL as channel_id
      FROM announcements
      WHERE created_by = ?
      ORDER BY created_at DESC
      LIMIT 5
    `, [faculty_id]);

    // Combine and sort activities
    const activities = [...messages, ...announcements]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 10);

    return {
      profile: faculty,
      classesToday: offerings.length,
      subjectSummary: offerings,
      recentActivity: activities
    };
  } catch (err) {
    console.error('[FacultyService] Error fetching dashboard:', err);
    throw err;
  }
};

const getFacultySubjects = async (faculty_id) => {
  try {
    const [offerings] = await pool.execute(`
      SELECT 
        so.id as offering_id,
        s.name as subject_name,
        sec.name as section_name,
        t.name as term_name,
        c.id as channel_id,
        c.name as channel_name,
        so.created_at,
        (SELECT COUNT(*) FROM users u WHERE u.section_id = sec.id AND u.role = 'student') as student_count,
        (SELECT COUNT(*) FROM channel_members cm WHERE cm.channel_id = c.id) as member_count,
        (SELECT COUNT(*) FROM messages m WHERE m.channel_id = c.id AND m.parent_id IS NULL) as message_count,
        (
          SELECT COUNT(*)
          FROM assignment_targets at
          JOIN assignments a ON a.id = at.assignment_id
          WHERE at.subject_offering_id = so.id AND a.is_active = 1
        ) as assignment_count
      FROM subject_offerings so
      JOIN subjects s ON s.id = so.subject_id
      JOIN sections sec ON sec.id = so.section_id
      LEFT JOIN terms t ON t.id = so.term_id
      LEFT JOIN channels c ON c.subject_offering_id = so.id
      WHERE so.faculty_id = ?
    `, [faculty_id]);
    
    return offerings;
  } catch (err) {
    console.error('[FacultyService] Error fetching subjects:', err);
    throw err;
  }
};

const getFacultyTargets = async (faculty_id) => {
  try {
    // 1. Get faculty's department
    const [deptRows] = await pool.execute(`
      SELECT d.id, d.name 
      FROM departments d
      JOIN users u ON u.dept_id = d.id
      WHERE u.id = ?
    `, [faculty_id]);

    const dept = deptRows[0];
    if (!dept) return { dept: null, sections: [], offerings: [] };

    // 2. Get all sections in that department
    const [sections] = await pool.execute(`
      SELECT id, name FROM sections WHERE dept_id = ?
    `, [dept.id]);

    // 3. Get faculty's own subject offerings
    const [offerings] = await pool.execute(`
      SELECT 
        so.id as offering_id,
        s.name as subject_name,
        sec.name as section_name,
        s.id as subject_id,
        sec.id as section_id
      FROM subject_offerings so
      JOIN subjects s ON s.id = so.subject_id
      JOIN sections sec ON sec.id = so.section_id
      WHERE so.faculty_id = ?
    `, [faculty_id]);

    // 4. Get all subjects in department (for manual selection)
    const [allSubjects] = await pool.execute(`
      SELECT id, name FROM subjects WHERE dept_id = ?
    `, [dept.id]);

    return {
      dept,
      sections,
      offerings,
      allSubjects
    };
  } catch (err) {
    console.error('[FacultyService] Error fetching targets:', err);
    throw err;
  }
};

module.exports = {
  getFacultyDashboard,
  getFacultyTargets,
  getFacultySubjects
};
