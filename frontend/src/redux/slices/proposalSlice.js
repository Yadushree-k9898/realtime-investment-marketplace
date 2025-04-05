// src/redux/slices/proposalSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

// CREATE PROPOSAL
export const createProposal = createAsyncThunk(
  'proposals/create',
  async (formData, thunkAPI) => {
    try {
      const res = await api.post('/proposals', formData); // Token added via interceptor
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
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/proposals'); // Token added via interceptor
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
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createProposal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProposal.fulfilled, (state, action) => {
        state.loading = false;
        state.proposals.unshift(action.payload);
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
        state.proposals = action.payload;
      })
      .addCase(fetchProposals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default proposalSlice.reducer;
