import axios from 'axios';

const API_URL = '/api/investments';

const handleError = (error) => {
  if (error.response) {
    return error.response.data.message || 'Something went wrong';
  } else {
    return 'Network Error';
  }
};

// ✅ Updated to match how token is stored in localStorage
const authHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
};

// ✅ All API calls use the updated authHeader
const fetchInvestorStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/stats`, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

const fetchFundingTrends = async () => {
  try {
    const response = await axios.get(`${API_URL}/trends`, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

const fetchTotalAnalysis = async () => {
  try {
    const response = await axios.get(`${API_URL}/total`, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

const investInProposal = async (proposalId, investmentData) => {
  try {
    const response = await axios.post(
      `${API_URL}/${proposalId}`,
      investmentData,
      { headers: authHeader() }
    );
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

const setDefaultReturns = async () => {
  try {
    const response = await axios.put(`${API_URL}/set-default-returns`, null, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

const searchInvestments = async (filters) => {
  try {
    const query = new URLSearchParams(filters).toString();
    const response = await axios.get(`${API_URL}/search?${query}`, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export default {
  fetchInvestorStats,
  fetchFundingTrends,
  fetchTotalAnalysis,
  investInProposal,
  setDefaultReturns,
  searchInvestments,
};
