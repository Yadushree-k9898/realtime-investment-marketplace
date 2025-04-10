import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

const authHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
};

const handleError = (error) => {
  if (error.response) {
    return error.response.data.message || 'Something went wrong';
  } else {
    return 'Network Error';
  }
};

const fetchInvestorStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/investments/stats`, {
      headers: authHeader(),
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

const fetchFundingTrends = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/investments/trends`, {
      headers: authHeader(),
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

const fetchTotalAnalysis = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/investments/total`, {
      headers: authHeader(),
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

const investInProposal = async (proposalId, investmentData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/investments/${proposalId}`,
      investmentData,
      {
        headers: authHeader(),
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

const setDefaultReturns = async () => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/investments/set-default-returns`,
      null,
      {
        headers: authHeader(),
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

const searchInvestments = async (filters) => {
  try {
    const query = new URLSearchParams(filters).toString();
    const response = await axios.get(`${API_BASE_URL}/investments/search?${query}`, {
      headers: authHeader(),
      withCredentials: true,
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
