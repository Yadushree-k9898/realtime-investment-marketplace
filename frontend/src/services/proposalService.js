// src/services/proposalService.js
import axios from '@/lib/axios'; // your axios instance with baseURL and interceptors if any

export const createProposalService = async (proposalData) => {
  const res = await axios.post('/api/proposals', proposalData);
  return res.data;
};
