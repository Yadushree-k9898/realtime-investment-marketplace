// import API from "./api";

// const getUserById = (userId, token) =>
//   API.get(`/admin/users/${userId}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });

// const getUserProposals = (userId, token) =>
//   API.get(`/proposals?founder=${userId}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });

// const deleteUserById = (userId, token) =>
//   API.delete(`/admin/users/${userId}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });

// export default {
//   getUserById,
//   getUserProposals,
//   deleteUserById,
// };


import API from "./api";

// Get a specific user by ID
const getUserById = (userId, token) =>
  API.get(`/admin/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Get all users
const getAllUsers = (token) =>
  API.get('/admin/users', {
    headers: { Authorization: `Bearer ${token}` },
  });

// Get all proposals
const getAllProposals = (token) =>
  API.get('/admin/proposals', {
    headers: { Authorization: `Bearer ${token}` },
  });

// Get all proposals by a specific user (founder)
const getUserProposals = (userId, token) =>
  API.get(`/proposals?founder=${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Delete a specific user by ID
const deleteUserById = (userId, token) =>
  API.delete(`/admin/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

/* ========== Analytics APIs ========== */

// Get overall platform statistics (counts, totals)
const getPlatformStats = (token) =>
  API.get('/admin/analytics/stats', {
    headers: { Authorization: `Bearer ${token}` },
  });

// Get user growth data over time
const getUserGrowth = (token) =>
  API.get('/admin/analytics/user-growth', {
    headers: { Authorization: `Bearer ${token}` },
  });

// Get proposal submission trends
const getProposalTrends = (token) =>
  API.get('/admin/analytics/proposal-trends', {
    headers: { Authorization: `Bearer ${token}` },
  });

// Get investment volume trends
const getInvestmentTrends = (token) =>
  API.get('/admin/analytics/investment-trends', {
    headers: { Authorization: `Bearer ${token}` },
  });

export default {
  getUserById,
  getAllUsers,
  getAllProposals,
  getUserProposals,
  deleteUserById,
  getPlatformStats,
  getUserGrowth,
  getProposalTrends,
  getInvestmentTrends,
};
