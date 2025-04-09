import api from './api';

export const fetchInvestorStats = async () => {
  const res = await api.get('/investments/investor-stats');
  return res.data;
};

export const fetchFundingTrends = async () => {
  const res = await api.get('/investments/trends');
  return res.data;
};

export const fetchInvestmentROI = async () => {
  const res = await api.get('/investments/roi');
  return res.data;
};

// export const fetchTotalAnalysis = async () => {
//   const res = await api.get('/investments/total-analysis');
//   return res.data;
// };

// export const fetchProposalsToReview = async () => {
//   const res = await api.get('/investments/proposals-to-review');
//   return res.data;
// };
