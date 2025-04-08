import api from "./api";

const createProposal = async (data) => {
  const res = await api.post("/proposals", data);
  return res.data;
};

const getProposals = async () => {
  const res = await api.get("/proposals");
  return res.data;
};

const proposalService = {
  createProposal,
  getProposals,
};

export default proposalService;
