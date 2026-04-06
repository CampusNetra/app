import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    // If Authorization header is already set, keep it (e.g., student token passed explicitly)
    if (config.headers.Authorization) {
      return config;
    }
    
    // We now look at the TARGET API URL instead of window.location
    const requestUrl = config.url || "";

    // 1. Requests to Faculty API
    if (requestUrl.includes('/faculty/')) {
      const facultyToken = localStorage.getItem('faculty_token');
      if (facultyToken) {
        config.headers.Authorization = `Bearer ${facultyToken}`;
        return config;
      }
    }

    // 2. Requests to Student API
    if (requestUrl.includes('/student/')) {
      const studentToken = localStorage.getItem('student_token');
      if (studentToken) {
        config.headers.Authorization = `Bearer ${studentToken}`;
        return config;
      }
    }

    // 3. Requests to Admin API
    // Admin routes in the backend are usually /api/admin/... or non-prefixed auth
    if (requestUrl.includes('/admin/') || requestUrl.includes('/auth/')) {
      const adminToken = localStorage.getItem('token');
      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
        return config;
      }
    }
    
    // 4. Default fallback: Logic for general API calls
    const studentToken = localStorage.getItem('student_token');
    const facultyToken = localStorage.getItem('faculty_token');
    const adminToken = localStorage.getItem('token');
    
    const tokenToUse = facultyToken || studentToken || adminToken;
    if (tokenToUse) {
      config.headers.Authorization = `Bearer ${tokenToUse}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('[API] Unauthorized access detected. Clearing sessions and redirecting.');
      
      // Clear ALL possible tokens to prevent loops
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('student_token');
      localStorage.removeItem('student_user');
      localStorage.removeItem('faculty_token');
      localStorage.removeItem('faculty_user');

      // Only redirect if NOT already on a login/landing page to avoid infinite loops
      const publicPaths = ['/', '/admin/login', '/student/welcome', '/faculty/login'];
      if (!publicPaths.includes(window.location.pathname)) {
        window.location.href = '/?error=session_expired';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
