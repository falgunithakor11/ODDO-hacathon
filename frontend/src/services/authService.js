// services/authService.js
import API from './api';

export const authService = {
  // Admin Signup
  adminSignup: (userData) => API.post('/auth/admin-signup', userData),
  
  // Login
  login: (credentials) => API.post('/auth/login', credentials),
  
  // Get current user
  getMe: () => API.get('/auth/me'),
  
  // Logout (client-side only)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
  }
};

export default authService;