import API from "./api";

const getUserById = (userId, token) =>
  API.get(`/admin/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

const getUserProposals = (userId, token) =>
  API.get(`/proposals?founder=${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

const deleteUserById = (userId, token) =>
  API.delete(`/admin/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export default {
  getUserById,
  getUserProposals,
  deleteUserById,
};
