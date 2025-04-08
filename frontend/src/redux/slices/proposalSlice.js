import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import proposalService from "../../services/proposalService";

// Thunks
export const createProposal = createAsyncThunk(
  "proposals/create",
  async (proposalData, thunkAPI) => {
    try {
      return await proposalService.createProposal(proposalData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Create failed");
    }
  }
);

export const fetchProposals = createAsyncThunk(
  "proposals/fetchAll",
  async (_, thunkAPI) => {
    try {
      return await proposalService.getProposals();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  }
);

export const updateProposal = createAsyncThunk(
  "proposals/update",
  async ({ id, data }, thunkAPI) => {
    try {
      return await proposalService.updateProposal(id, data); // returns updated proposal directly
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Update failed");
    }
  }
);

export const deleteProposal = createAsyncThunk(
  "proposals/delete",
  async (id, thunkAPI) => {
    try {
      await proposalService.deleteProposal(id);
      return { proposalId: id, message: "Proposal deleted successfully" };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Delete failed");
    }
  }
);

// Slice
const proposalSlice = createSlice({
  name: "proposals",
  initialState: {
    proposals: [],
    currentProposal: null,
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
    setCurrentProposal: (state, action) => {
      state.currentProposal = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
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

      // Fetch All
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
      })

      // Update
      .addCase(updateProposal.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProposal.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Proposal updated successfully";
        const updated = action.payload;
        state.proposals = state.proposals.map((p) =>
          p._id === updated._id ? updated : p
        );
      })
      .addCase(updateProposal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteProposal.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProposal.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.proposals = state.proposals.filter(
          (p) => p._id !== action.payload.proposalId
        );
      })
      .addCase(deleteProposal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProposalState, setCurrentProposal } = proposalSlice.actions;
export default proposalSlice.reducer;
