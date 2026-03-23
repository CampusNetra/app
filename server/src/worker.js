const authService = require('./services/auth.service');
const adminService = require('./services/admin.service');
const termsService = require('./services/terms.service');
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
