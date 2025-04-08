// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    try {
      const user = localStorage.getItem('user');
      const token = user ? JSON.parse(user).token : null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.warn('Failed to attach token:', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
