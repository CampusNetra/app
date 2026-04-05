const authService = require('./services/auth.service');
const adminService = require('./services/admin.service');
const termsService = require('./services/terms.service');
const studentService = require('./services/student.service');
const facultyService = require('./services/faculty.service');
const chatService = require('./services/chat.service');
const announcementService = require('./services/announcement.service');
const jwt = require('jsonwebtoken');

const jsonResponse = (data, status = 200) => {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
    });
};

const authMiddleware = async (request, env) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    const token = authHeader.split(' ')[1];
    try {
        return jwt.verify(token, env.JWT_SECRET || 'campus_netra_secret_key_123');
    } catch (e) {
        return null;
    }
};

export default {
    async fetch(request, env, ctx) {
        // Expose DB binding globally
        globalThis.DB = env.DB;
        globalThis.JWT_SECRET = env.JWT_SECRET || 'campus_netra_secret_key_123';
        globalThis.JWT_EXPIRE = env.JWT_EXPIRE || '1d';
        
        const url = new URL(request.url);
        const path = url.pathname;
        const isApiRoute = path.startsWith('/api');

        // CORS Preflight
        if (request.method === 'OPTIONS' && isApiRoute) {
            return jsonResponse({});
        }

        // --- AUTH ROUTES ---
        if (path === '/api/auth/signup' && request.method === 'POST') {
            const body = await request.json();
            try {
                const result = await authService.signup(body);
                return jsonResponse(result, 201);
            } catch (e) {
                return jsonResponse({ error: e.message }, 400);
            }
        }

        if (path === '/api/auth/login' && request.method === 'POST') {
            const body = await request.json();
            try {
                const result = await authService.login(body);
                return jsonResponse(result);
            } catch (e) {
                return jsonResponse({ error: e.message }, 400);
            }
        }

        if (path === '/api/auth/student-login' && request.method === 'POST') {
            const body = await request.json();
            try {
                const result = await authService.studentLogin(body);
                return jsonResponse(result);
            } catch (e) {
                return jsonResponse({ error: e.message }, 400);
            }
        }

        if (path === '/api/student/feed' && request.method === 'GET') {
            const student = await authMiddleware(request, env);
            if (!student || student.role !== 'student') {
                return jsonResponse({ error: 'Unauthorized' }, 401);
            }

            try {
                const data = await studentService.getFeed({
                    user_id: student.id,
                    dept_id: student.dept_id,
                    section_id: student.section_id,
                    limit: url.searchParams.get('limit') || 50
                });
                return jsonResponse(data);
            } catch (e) {
                return jsonResponse({ error: e.message }, 500);
            }
        }

        if (path === '/api/student/profile' && request.method === 'GET') {
            const student = await authMiddleware(request, env);
            if (!student || student.role !== 'student') {
                return jsonResponse({ error: 'Unauthorized' }, 401);
            }

            try {
                const data = await studentService.getProfile(student.id);
                return jsonResponse(data);
            } catch (e) {
                return jsonResponse({ error: e.message }, 500);
            }
        }

        // Student Chat Routes
        if (path.startsWith('/api/student/chat')) {
            const student = await authMiddleware(request, env);
            if (!student || student.role !== 'student') {
                return jsonResponse({ error: 'Unauthorized' }, 401);
            }

            if (path === '/api/student/chat/channels' && request.method === 'GET') {
                const data = await chatService.getStudentChannels(student.id, student.dept_id, student.section_id);
                return jsonResponse(data);
            }

            const chanDetailsMatch = path.match(/^\/api\/student\/chat\/channels\/(\d+)$/);
            if (chanDetailsMatch && request.method === 'GET') {
                const data = await chatService.getChannelDetails(chanDetailsMatch[1]);
                return jsonResponse(data);
            }

            const chanMessagesMatch = path.match(/^\/api\/student\/chat\/channels\/(\d+)\/messages$/);
            if (chanMessagesMatch && request.method === 'GET') {
                const data = await chatService.getChannelMessages(chanMessagesMatch[1], url.searchParams.get('limit'));
                return jsonResponse(data);
            }

            if (chanMessagesMatch && request.method === 'POST') {
                const body = await request.json();
                const data = await chatService.sendMessage({
                    channel_id: chanMessagesMatch[1],
                    sender_id: student.id,
                    ...body
                });
                return jsonResponse(data, 201);
            }

            const chanReadMatch = path.match(/^\/api\/student\/chat\/channels\/(\d+)\/read$/);
            if (chanReadMatch && request.method === 'POST') {
                await chatService.markChannelAsRead(chanReadMatch[1], student.id);
                return jsonResponse({ success: true });
            }

            const msgRepliesMatch = path.match(/^\/api\/student\/chat\/messages\/(\d+)\/replies$/);
            if (msgRepliesMatch && request.method === 'GET') {
                const data = await chatService.getMessageReplies(msgRepliesMatch[1], url.searchParams.get('limit'));
                return jsonResponse(data);
            }
        }

        // --- ANNOUNCEMENTS ROUTES ---
        if (path.startsWith('/api/announcements')) {
            if (!user) {
                return jsonResponse({ error: 'Unauthorized' }, 401);
            }

            if (path === '/api/announcements' && request.method === 'GET') {
                try {
                    const limit = url.searchParams.get('limit') || 50;
                    const announcements = await announcementService.getAnnouncements({
                        limit: Math.min(Math.max(Number(limit) || 50, 1), 100),
                        is_active: 1
                    });
                    return jsonResponse(announcements);
                } catch (e) {
                    return jsonResponse({ error: e.message }, 500);
                }
            }

            if (path === '/api/announcements' && request.method === 'POST') {
                try {
                    const body = await request.json();
                    const announcement = await announcementService.createAnnouncement({
                        ...body,
                        created_by: user.id
                    });
                    return jsonResponse(announcement, 201);
                } catch (e) {
                    return jsonResponse({ error: e.message }, 400);
                }
            }

            return jsonResponse({ error: 'Not Found' }, 404);
        }

        // --- ADMIN ROUTES (Protected) ---
        const user = await authMiddleware(request, env);
        if (!user) {
            if (path.startsWith('/api/admin')) {
                return jsonResponse({ error: 'Unauthorized' }, 401);
            }
        }

        if (path === '/api/admin/stats' && request.method === 'GET') {
            try {
                const stats = await adminService.getDashboardStats(user.dept_id);
                return jsonResponse(stats);
            } catch (e) {
                return jsonResponse({ error: e.message }, 500);
            }
        }

        if (path === '/api/admin/announcements' && (request.method === 'GET' || request.method === 'POST')) {
            try {
                if (request.method === 'GET') {
                    const data = await adminService.getRecentAnnouncements(user.dept_id);
                    return jsonResponse(data);
                } else {
                    const body = await request.json();
                    const result = await adminService.createAnnouncement({
                        sender_id: user.id,
                        dept_id: user.dept_id,
                        ...body
                    });
                    return jsonResponse(result, 201);
                }
            } catch (e) {
                return jsonResponse({ error: e.message }, 500);
            }
        }

        if (path === '/api/admin/activity' && request.method === 'GET') {
            try {
                const data = await adminService.getUserActivity(user.dept_id);
                return jsonResponse(data);
            } catch (e) {
                return jsonResponse({ error: e.message }, 500);
            }
        }

        if (path === '/api/admin/channels' && request.method === 'GET') {
            try {
                const data = await adminService.getChannels(user.dept_id, url.searchParams.get('type'));
                return jsonResponse(data);
            } catch (e) {
                return jsonResponse({ error: e.message }, 500);
            }
        }

        if (path === '/api/admin/channels' && request.method === 'POST') {
            try {
                const body = await request.json();
                const result = await adminService.createChannel({ dept_id: user.dept_id, ...body });
                return jsonResponse(result, 201);
            } catch (e) {
                return jsonResponse({ error: e.message }, 500);
            }
        }

        if (path === '/api/admin/faculty' && request.method === 'GET') {
            try {
                const params = url.searchParams;
                const data = await adminService.getFaculty({
                    dept_id: user.dept_id,
                    search: params.get('search') || '',
                    is_active: params.get('is_active'),
                    page: params.get('page') || 1,
                    limit: params.get('limit') || 20
                });
                return jsonResponse(data);
            } catch (e) {
                return jsonResponse({ error: e.message }, 500);
            }
        }

        if (path === '/api/admin/faculty' && request.method === 'POST') {
            try {
                const body = await request.json();
                const result = await adminService.createFaculty({
                    dept_id: user.dept_id,
                    data: body
                });
                return jsonResponse(result, 201);
            } catch (e) {
                const message = e.message || 'Failed to create faculty';
                const statusCode =
                    message.includes('required') ||
                    message.includes('already') ||
                    message.includes('Invalid')
                        ? 400
                        : 500;
                return jsonResponse({ error: message }, statusCode);
            }
        }

        const updateFacultyMatch = path.match(/^\/api\/admin\/faculty\/(\d+)$/);
        if (updateFacultyMatch && request.method === 'PUT') {
            try {
                const body = await request.json();
                const result = await adminService.updateUser({
                    dept_id: user.dept_id,
                    userId: updateFacultyMatch[1],
                    data: body
                });
                return jsonResponse(result);
            } catch (e) {
                return jsonResponse(
                    { error: e.message },
                    e.message === 'User not found in this department' ? 404 : 500
                );
            }
        }

        if (path === '/api/admin/students' && request.method === 'GET') {
            try {
                const params = url.searchParams;
                const data = await adminService.getStudents({
                    dept_id: user.dept_id,
                    search: params.get('search') || '',
                    section_id: params.get('section_id'),
                    verification_status: params.get('verification_status'),
                    is_active: params.get('is_active'),
                    page: params.get('page') || 1,
                    limit: params.get('limit') || 20
                });
                return jsonResponse(data);
            } catch (e) {
                return jsonResponse({ error: e.message }, 500);
            }
        }

        if (path === '/api/admin/students' && request.method === 'POST') {
            try {
                const body = await request.json();
                const result = await adminService.createStudent({
                    dept_id: user.dept_id,
                    data: body
                });
                return jsonResponse(result, 201);
            } catch (e) {
                const message = e.message || 'Failed to create student';
                const statusCode =
                    message.includes('required') ||
                    message.includes('already') ||
                    message.includes('Invalid')
                        ? 400
                        : 500;
                return jsonResponse({ error: message }, statusCode);
            }
        }

        const updateStudentMatch = path.match(/^\/api\/admin\/students\/(\d+)$/);
        if (updateStudentMatch && request.method === 'PUT') {
            try {
                const body = await request.json();
                const result = await adminService.updateUser({
                    dept_id: user.dept_id,
                    userId: updateStudentMatch[1],
                    data: body
                });
                return jsonResponse(result);
            } catch (e) {
                return jsonResponse(
                    { error: e.message },
                    e.message === 'User not found in this department' ? 404 : 500
                );
            }
        }

        if (path === '/api/admin/departments' && request.method === 'GET') {
            try {
                const deptIdToFetch = user.role === 'super_admin' ? null : user.dept_id;
                const data = await adminService.getDepartments(deptIdToFetch);
                return jsonResponse(data);
            } catch (e) {
                return jsonResponse({ error: e.message }, 500);
            }
        }

        if (path === '/api/admin/departments' && request.method === 'POST') {
            try {
                if (user.role !== 'super_admin') {
                    return jsonResponse({ error: 'Only super admins can create departments' }, 403);
                }
                const body = await request.json();
                const result = await adminService.createDepartment(body.name);
                return jsonResponse(result, 201);
            } catch (e) {
                return jsonResponse({ error: e.message }, 500);
            }
        }

        if (path === '/api/admin/sections' && request.method === 'GET') {
            try {
                const data = await adminService.getSections(user.dept_id);
                return jsonResponse(data);
            } catch (e) {
                return jsonResponse({ error: e.message }, 500);
            }
        }

        if (path === '/api/admin/sections' && request.method === 'POST') {
            try {
                const body = await request.json();
                const result = await adminService.createSection({ dept_id: user.dept_id, name: body.name });
                return jsonResponse(result, 201);
            } catch (e) {
                return jsonResponse({ error: e.message }, 500);
            }
        }

        if (path === '/api/admin/subjects' && request.method === 'GET') {
            try {
                const data = await adminService.getSubjects(user.dept_id);
                return jsonResponse(data);
            } catch (e) {
                return jsonResponse({ error: e.message }, 500);
            }
        }

        if (path === '/api/admin/subjects' && request.method === 'POST') {
            try {
                const body = await request.json();
                const result = await adminService.createSubject({ dept_id: user.dept_id, name: body.name });
                return jsonResponse(result, 201);
            } catch (e) {
                return jsonResponse({ error: e.message }, 500);
            }
        }

        const subjectMatch = path.match(/^\/api\/admin\/subjects\/(\d+)$/);
        if (subjectMatch && request.method === 'PUT') {
            try {
                const body = await request.json();
                const result = await adminService.updateSubject(user.dept_id, subjectMatch[1], body);
                return jsonResponse(result);
            } catch (e) {
                return jsonResponse({ error: e.message }, e.message === 'Subject not found' ? 404 : 500);
            }
        }

        if (subjectMatch && request.method === 'DELETE') {
            try {
                const result = await adminService.deleteSubject(user.dept_id, subjectMatch[1]);
                return jsonResponse(result);
            } catch (e) {
                if ((e.message || '').includes('active faculty assignments')) {
                    return jsonResponse({ error: e.message }, 400);
                }
                return jsonResponse({ error: e.message }, e.message === 'Subject not found' ? 404 : 500);
            }
        }

        const subjectAnalyticsMatch = path.match(/^\/api\/admin\/subjects\/(\d+)\/analytics$/);
        if (subjectAnalyticsMatch && request.method === 'GET') {
            try {
                const data = await adminService.getSubjectAnalytics(user.dept_id, subjectAnalyticsMatch[1]);
                return jsonResponse(data);
            } catch (e) {
                return jsonResponse({ error: e.message }, 500);
            }
        }

        const createSubjectChannelsMatch = path.match(/^\/api\/admin\/subjects\/(\d+)\/create-channels$/);
        if (createSubjectChannelsMatch && request.method === 'POST') {
            try {
                const result = await adminService.createSubjectChannels(user.dept_id, createSubjectChannelsMatch[1]);
                return jsonResponse(result);
            } catch (e) {
                return jsonResponse({ error: e.message }, 500);
            }
        }

        if (path === '/api/admin/offerings' && request.method === 'GET') {
            try {
                const data = await adminService.getSubjectOfferings(user.dept_id, url.searchParams.get('section_id'));
                return jsonResponse(data);
            } catch (e) {
                return jsonResponse({ error: e.message }, 500);
            }
        }

        if (path === '/api/admin/offerings/assign-faculty' && request.method === 'POST') {
            try {
                const body = await request.json();
                const result = await adminService.createSubjectOffering({
                    subject_id: body.subject_id,
                    section_id: body.section_id,
                    faculty_id: body.faculty_id,
                    term_id: body.term_id,
                    dept_id: user.dept_id
                });
                return jsonResponse(result, 201);
            } catch (e) {
                return jsonResponse({ error: e.message }, 500);
            }
        }

        const offeringMatch = path.match(/^\/api\/admin\/offerings\/(\d+)$/);
        if (offeringMatch && request.method === 'PUT') {
            try {
                const body = await request.json();
                const result = await adminService.updateSubjectOffering(user.dept_id, offeringMatch[1], body);
                return jsonResponse(result);
            } catch (e) {
                return jsonResponse({ error: e.message }, e.message === 'Offering not found' ? 404 : 500);
            }
        }

        if (offeringMatch && request.method === 'DELETE') {
            try {
                const result = await adminService.deleteSubjectOffering(user.dept_id, offeringMatch[1]);
                return jsonResponse(result);
            } catch (e) {
                return jsonResponse({ error: e.message }, e.message === 'Offering not found' ? 404 : 500);
            }
        }

        if (path === '/api/admin/clubs' && request.method === 'GET') {
            try {
                const data = await adminService.getClubs(user.dept_id);
                return jsonResponse(data);
            } catch (e) {
                return jsonResponse({ error: e.message }, 500);
            }
        }

        if (path === '/api/admin/clubs' && request.method === 'POST') {
            try {
                const body = await request.json();
                const result = await adminService.createClub({ dept_id: user.dept_id, ...body });
                return jsonResponse(result, 201);
            } catch (e) {
                return jsonResponse({ error: e.message }, 500);
            }
        }

        const clubMatch = path.match(/^\/api\/admin\/clubs\/(\d+)$/);
        if (clubMatch && request.method === 'PUT') {
            try {
                const body = await request.json();
                const result = await adminService.updateClub(clubMatch[1], body);
                return jsonResponse(result);
            } catch (e) {
                return jsonResponse({ error: e.message }, 500);
            }
        }

        if (clubMatch && request.method === 'DELETE') {
            try {
                const result = await adminService.deleteClub(clubMatch[1]);
                return jsonResponse(result);
            } catch (e) {
                return jsonResponse({ error: e.message }, 500);
            }
        }

        if (path === '/api/admin/reports' && request.method === 'GET') {
            try {
                const data = await adminService.getReports(user.dept_id);
                return jsonResponse(data);
            } catch (e) {
                return jsonResponse({ error: e.message }, 500);
            }
        }

        const resolveReportMatch = path.match(/^\/api\/admin\/reports\/(\d+)\/resolve$/);
        if (resolveReportMatch && request.method === 'POST') {
            try {
                const body = await request.json();
                const result = await adminService.resolveReport(resolveReportMatch[1], body.action);
                return jsonResponse(result);
            } catch (e) {
                return jsonResponse({ error: e.message }, 500);
            }
        }

        const deleteChannelMatch = path.match(/^\/api\/admin\/channels\/(\d+)$/);
        if (deleteChannelMatch && request.method === 'DELETE') {
            try {
                const result = await adminService.deleteChannel(deleteChannelMatch[1]);
                return jsonResponse(result);
            } catch (e) {
                return jsonResponse({ error: e.message }, 500);
            }
        }

        if (path === '/api/admin/channels/eligible-users' && request.method === 'GET') {
            try {
                const data = await adminService.getChannelEligibleUsers(user.dept_id);
                return jsonResponse(data);
            } catch (e) {
                return jsonResponse({ error: e.message }, 500);
            }
        }

        const syncMembersMatch = path.match(/^\/api\/admin\/channels\/(\d+)\/members$/);
        if (syncMembersMatch && request.method === 'POST') {
            try {
                const body = await request.json();
                const result = await adminService.syncChannelMembers({ 
                    channel_id: syncMembersMatch[1], 
                    user_ids: body.userIds 
                });
                return jsonResponse(result);
            } catch (e) {
                return jsonResponse({ error: e.message }, 500);
            }
        }

        // --- CHAT SYSTEM ROUTES ---
        if (path === '/api/admin/chat/channels' && request.method === 'GET') {
            try {
                const data = await adminService.getChatChannels(user.id, user.dept_id);
                return jsonResponse(data);
            } catch (e) {
                return jsonResponse({ error: e.message }, 500);
            }
        }

        const chatDetailsMatch = path.match(/^\/api\/admin\/chat\/channels\/(\d+)\/details$/);
        if (chatDetailsMatch && request.method === 'GET') {
            try {
                const data = await adminService.getChatChannelDetails(chatDetailsMatch[1], user.dept_id);
                return jsonResponse(data);
            } catch (e) {
                return jsonResponse({ error: e.message }, 500);
            }
        }

        const chatMessagesMatch = path.match(/^\/api\/admin\/chat\/channels\/(\d+)\/messages$/);
        if (chatMessagesMatch && request.method === 'GET') {
            try {
                const data = await adminService.getChannelMessages(chatMessagesMatch[1]);
                return jsonResponse(data);
            } catch (e) {
                return jsonResponse({ error: e.message }, 500);
            }
        }

        if (chatMessagesMatch && request.method === 'POST') {
            try {
                const body = await request.json();
                const result = await adminService.sendMessage({
                    channel_id: chatMessagesMatch[1],
                    sender_id: user.id,
                    ...body
                });
                return jsonResponse(result, 201);
            } catch (e) {
                return jsonResponse({ error: e.message }, 500);
            }
        }

        const msgRepliesMatch = path.match(/^\/api\/admin\/chat\/messages\/(\d+)\/replies$/);
        if (msgRepliesMatch && request.method === 'GET') {
            try {
                const data = await adminService.getMessageReplies(msgRepliesMatch[1]);
                return jsonResponse(data);
            } catch (e) {
                return jsonResponse({ error: e.message }, 500);
            }
        }

        if (msgRepliesMatch && request.method === 'POST') {
            try {
                const body = await request.json();
                const result = await adminService.sendMessage({
                    parent_id: msgRepliesMatch[1],
                    sender_id: user.id,
                    content: body.content,
                    type: 'text'
                });
                return jsonResponse(result, 201);
            } catch (e) {
                return jsonResponse({ error: e.message }, 500);
            }
        }

        // --- TERMS ROUTES ---
        if (path === '/api/terms' && request.method === 'GET') {
            try {
                const terms = await termsService.getAllTerms();
                return jsonResponse(terms);
            } catch (e) {
                return jsonResponse({ error: e.message }, 500);
            }
        }

        if (path === '/api/terms' && request.method === 'POST') {
            try {
                const body = await request.json();
                const term = await termsService.createTerm(body);
                return jsonResponse(term, 201);
            } catch (e) {
                return jsonResponse({ error: e.message }, 400);
            }
        }

        const activateTermMatch = path.match(/^\/api\/terms\/(\d+)\/activate$/);
        if (activateTermMatch && request.method === 'PATCH') {
            try {
                const result = await termsService.setActiveTerm(activateTermMatch[1]);
                return jsonResponse(result);
            } catch (e) {
                return jsonResponse({ error: e.message }, 400);
            }
        }

        // --- FACULTY ROUTES ---
        if (path.startsWith('/api/faculty')) {
            const faculty = await authMiddleware(request, env);
            if (!faculty || faculty.role !== 'faculty') {
                return jsonResponse({ error: 'Unauthorized' }, 401);
            }

            if (path === '/api/faculty/dashboard' && request.method === 'GET') {
                const data = await facultyService.getFacultyDashboard(faculty.id);
                return jsonResponse(data);
            }
            if (path === '/api/faculty/subjects' && request.method === 'GET') {
                const data = await facultyService.getFacultySubjects(faculty.id);
                return jsonResponse(data);
            }
            if (path === '/api/faculty/targets' && request.method === 'GET') {
                const data = await facultyService.getFacultyTargets(faculty.id);
                return jsonResponse(data);
            }

            // Faculty Chat
            if (path.startsWith('/api/faculty/chat')) {
                if (path === '/api/faculty/chat/channels' && request.method === 'GET') {
                    const data = await chatService.getFacultyChannels(faculty.id, faculty.dept_id);
                    return jsonResponse(data);
                }

                const facChanDetailsMatch = path.match(/^\/api\/faculty\/chat\/channels\/(\d+)$/);
                if (facChanDetailsMatch && request.method === 'GET') {
                    const data = await chatService.getChannelDetails(facChanDetailsMatch[1]);
                    return jsonResponse(data);
                }

                const facChanMessagesMatch = path.match(/^\/api\/faculty\/chat\/channels\/(\d+)\/messages$/);
                if (facChanMessagesMatch && request.method === 'GET') {
                    const data = await chatService.getChannelMessages(facChanMessagesMatch[1], url.searchParams.get('limit'));
                    return jsonResponse(data);
                }

                if (facChanMessagesMatch && request.method === 'POST') {
                    const body = await request.json();
                    const data = await chatService.sendMessage({
                        channel_id: facChanMessagesMatch[1],
                        sender_id: faculty.id,
                        ...body
                    });
                    return jsonResponse(data, 201);
                }

                const facChanReadMatch = path.match(/^\/api\/faculty\/chat\/channels\/(\d+)\/read$/);
                if (facChanReadMatch && request.method === 'POST') {
                    await chatService.markChannelAsRead(facChanReadMatch[1], faculty.id);
                    return jsonResponse({ success: true });
                }

                const facMsgRepliesMatch = path.match(/^\/api\/faculty\/chat\/messages\/(\d+)\/replies$/);
                if (facMsgRepliesMatch && request.method === 'GET') {
                    const data = await chatService.getMessageReplies(facMsgRepliesMatch[1], url.searchParams.get('limit'));
                    return jsonResponse(data);
                }
            }
        }

        if (isApiRoute) {
            return jsonResponse({ error: 'Route Not Found' }, 404);
        }

        // Serve static assets and SPA routes for non-API paths.
        if (env.ASSETS && typeof env.ASSETS.fetch === 'function') {
            const assetResponse = await env.ASSETS.fetch(request);
            if (assetResponse.status !== 404) {
                return assetResponse;
            }

            const indexRequest = new Request(new URL('/index.html', request.url), request);
            return env.ASSETS.fetch(indexRequest);
        }

        return new Response('CampusNetra API is running. Use /api/* endpoints.', { status: 200 });
    },
};
