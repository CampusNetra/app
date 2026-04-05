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
    
    // Check for student token first
    const studentToken = localStorage.getItem('student_token');
    if (studentToken) {
      config.headers.Authorization = `Bearer ${studentToken}`;
      return config;
    }

    // Check for faculty token
    const facultyToken = localStorage.getItem('faculty_token');
    if (facultyToken) {
      config.headers.Authorization = `Bearer ${facultyToken}`;
      return config;
    }
    
    // Fall back to admin token
    const adminToken = localStorage.getItem('token');
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
