const authService = require('./services/auth.service');
const adminService = require('./services/admin.service');
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
        
        const url = new URL(request.url);
        const path = url.pathname;

        // CORS Preflight
        if (request.method === 'OPTIONS') {
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
                // Ensure JWT_SECRET is available from env
                process.env.JWT_SECRET = env.JWT_SECRET || 'campus_netra_secret_key_123';
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
                const data = await adminService.getChannels(user.dept_id);
                return jsonResponse(data);
            } catch (e) {
                return jsonResponse({ error: e.message }, 500);
            }
        }

        return new Response("CampusNetra API: Route Not Found", { status: 404 });
    },
};
