import api from "./api";

// Create a new proposal
const createProposal = async (data) => {
  const res = await api.post("/proposals", data);
  return res.data;
};

// Get all proposals
const getProposals = async () => {
  const res = await api.get("/proposals");
  return res.data;
};

// Update a proposal by ID
const updateProposal = async (id, data) => {
  const res = await api.put(`/proposals/${id}`, data);
  return res.data;
};

// Delete a proposal by ID
const deleteProposal = async (id) => {
  const res = await api.delete(`/proposals/${id}`);
  return res.data;
};

// Get a single proposal by ID
const getProposalById = async (id) => {
  const res = await api.get(`/proposals/${id}`);
  return res.data;
};
// Get investors who invested in this founder's proposals
 const getProposalInvestorsForFounder = async (token) => {
  const response = await fetch('/api/proposals/founder/investors', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch investors');
  }

  return response.json();
};

const proposalService = {
  createProposal,
  getProposals,
  updateProposal,
  deleteProposal,
  getProposalById,
  getProposalInvestorsForFounder // ✅ Add this
};

export default proposalService;


