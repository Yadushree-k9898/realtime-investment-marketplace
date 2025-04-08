import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import proposalService from "../../services/proposalService";

export const createProposal = createAsyncThunk(
  "proposals/create",
  async (proposalData, thunkAPI) => {
    try {
      return await proposalService.createProposal(proposalData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchProposals = createAsyncThunk(
  "proposals/fetchAll",
  async (_, thunkAPI) => {
    try {
      return await proposalService.getProposals();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

const proposalSlice = createSlice({
  name: "proposals",
  initialState: {
    proposals: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearProposalState: (state) => {
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProposal.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProposal.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.proposals.push(action.payload.proposal);
      })
      .addCase(createProposal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProposals.pending, (state) => {
        state.loading = true;
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

export const { clearProposalState } = proposalSlice.actions;
export default proposalSlice.reducer;
