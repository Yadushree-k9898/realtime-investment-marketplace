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

const proposalService = {
  createProposal,
  getProposals,
  updateProposal,
  deleteProposal,
  getProposalById, // ✅ Add this
};

export default proposalService;


