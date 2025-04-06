import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

// CREATE PROPOSAL
export const createProposal = createAsyncThunk(
  'proposals/create',
  async (formData, thunkAPI) => {
    try {
      const res = await api.post('/proposals', formData);
      return res.data.proposal;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Error creating proposal';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// FETCH PROPOSALS
export const fetchProposals = createAsyncThunk(
  'proposals/fetch',
  async (filters = {}, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const user = state.auth?.user;

      if (!user || !user._id) {
        return thunkAPI.rejectWithValue('User not logged in');
      }

      const finalFilters = {
        createdBy: filters.createdBy || user._id,
        ...filters,
      };

      const res = await api.get('/proposals', { params: finalFilters });
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Error fetching proposals';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// SLICE
const proposalSlice = createSlice({
  name: 'proposals',
  initialState: {
    proposals: [],
    loading: false,
    error: null,
    fetched: false,
  },
  reducers: {
    clearProposals: (state) => {
      state.proposals = [];
      state.fetched = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProposal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProposal.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.proposals = [action.payload, ...state.proposals];
      })
      .addCase(createProposal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProposals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProposals.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.proposals = action.payload;
        state.fetched = true;
      })
      .addCase(fetchProposals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.fetched = false;
      });
  },
});

export const { clearProposals } = proposalSlice.actions;
export default proposalSlice.reducer;
