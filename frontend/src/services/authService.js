// import axios from "axios";

// const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

// // Login
// export const loginUser = async (email, password) => {
//   const res = await axios.post(`${API}/auth/login`, { email, password });
//   return res.data; // contains token and user
// };

// // Register
// export const registerUser = async (formData) => {
//   const res = await axios.post(`${API}/auth/register`, formData);
//   return res.data;
// };

// // Get user from token
// export const getUserFromToken = async (token) => {
//   const res = await axios.get(`${API}/auth/me`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   return res.data; // contains user
// };


import axios from "axios";

const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

// Auth APIs

// Login
export const loginUser = async (email, password) => {
  const res = await axios.post(`${API}/auth/login`, { email, password });
  return res.data; // { token, user }
};

// Register
export const registerUser = async (formData) => {
  const res = await axios.post(`${API}/auth/register`, formData);
  return res.data;
};

// Get user using token (for auth on load)
export const getUserFromToken = async (token) => {
  const res = await axios.get(`${API}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data; // { user }
};

// ========================
// User Profile APIs
// ========================

// Get logged-in user profile
export const getUserProfile = async (token) => {
  const res = await axios.get(`${API}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data; // { user }
};

// Update user profile
export const updateUserProfile = async (data, token) => {
  const res = await axios.put(`${API}/auth/profile`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data; // { updatedUser }
};
