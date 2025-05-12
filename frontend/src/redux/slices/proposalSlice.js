// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import proposalService from "@/services/proposalService";

// // Thunks
// export const createProposal = createAsyncThunk(
//   "proposals/create",
//   async (proposalData, thunkAPI) => {
//     try {
//       return await proposalService.createProposal(proposalData);
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response?.data?.message || "Create failed");
//     }
//   }
// );

// export const fetchProposals = createAsyncThunk(
//   "proposals/fetchAll",
//   async (_, thunkAPI) => {
//     try {
//       return await proposalService.getProposals();
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response?.data?.message || "Fetch failed");
//     }
//   }
// );

// // ✅ ADD THIS NEW THUNK
//  const fetchProposalById = createAsyncThunk(
//   "proposals/fetchById",
//   async (id, thunkAPI) => {
//     try {
//       return await proposalService.getProposalById(id);
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response?.data?.message || "Fetch failed");
//     }
//   }
// );

// export const updateProposal = createAsyncThunk(
//   "proposals/update",
//   async ({ id, data }, thunkAPI) => {
//     try {
//       return await proposalService.updateProposal(id, data);
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response?.data?.message || "Update failed");
//     }
//   }
// );

// export const deleteProposal = createAsyncThunk(
//   "proposals/delete",
//   async (id, thunkAPI) => {
//     try {
//       await proposalService.deleteProposal(id);
//       return { proposalId: id, message: "Proposal deleted successfully" };
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response?.data?.message || "Delete failed");
//     }
//   }
// );


// const proposalSlice = createSlice({
//   name: "proposals",
//   initialState: {
//     proposals: [],
//     currentProposal: null,
//     loading: false,
//     error: null,
//     successMessage: null,
//   },
//   reducers: {
//     clearProposalState: (state) => {
//       state.loading = false;
//       state.error = null;
//       state.successMessage = null;
//     },
//     setCurrentProposal: (state, action) => {
//       state.currentProposal = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(createProposal.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createProposal.fulfilled, (state, action) => {
//         state.loading = false;
//         state.successMessage = action.payload.message;
//         state.proposals.push(action.payload.proposal);
//       })
//       .addCase(createProposal.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       .addCase(fetchProposals.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchProposals.fulfilled, (state, action) => {
//         state.loading = false;
//         state.proposals = action.payload;
//       })
//       .addCase(fetchProposals.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ✅ ADD CASE HANDLERS FOR fetchProposalById
//       .addCase(fetchProposalById.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.currentProposal = null;
//       })
//       .addCase(fetchProposalById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.currentProposal = action.payload;
//       })
//       .addCase(fetchProposalById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       .addCase(updateProposal.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateProposal.fulfilled, (state, action) => {
//         state.loading = false;
//         state.successMessage = "Proposal updated successfully";
//         const updated = action.payload;
//         state.proposals = state.proposals.map((p) =>
//           p._id === updated._id ? updated : p
//         );
//       })
//       .addCase(updateProposal.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       .addCase(deleteProposal.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(deleteProposal.fulfilled, (state, action) => {
//         state.loading = false;
//         state.successMessage = action.payload.message;
//         state.proposals = state.proposals.filter(
//           (p) => p._id !== action.payload.proposalId
//         );
//       })
//       .addCase(deleteProposal.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });
// export const { clearProposalState, setCurrentProposal } = proposalSlice.actions;
// export { fetchProposalById };

// export default proposalSlice.reducer;



import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import proposalService from "@/services/proposalService";

// Thunks
 const createProposal = createAsyncThunk(
  "proposals/create",
  async (proposalData, thunkAPI) => {
    try {
      return await proposalService.createProposal(proposalData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Create failed");
    }
  }
);
 const fetchProposals = createAsyncThunk(
  "proposals/fetchAll",
  async (_, thunkAPI) => {
    try {
      return await proposalService.getProposals();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  }
);

 const fetchProposalById = createAsyncThunk(
  "proposals/fetchById",
  async (id, thunkAPI) => {
    try {
      return await proposalService.getProposalById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  }
);

 const updateProposal = createAsyncThunk(
  "proposals/update",
  async ({ id, data }, thunkAPI) => {
    try {
      return await proposalService.updateProposal(id, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Update failed");
    }
  }
);

 const deleteProposal = createAsyncThunk(
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

// ✅ New Thunk for Founder's Proposal Investors
 const fetchFounderInvestors = createAsyncThunk(
  "proposals/fetchFounderInvestors",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await proposalService.getProposalInvestorsForFounder(token);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch founder investors"
      );
    }
  }
);

// Slice
const proposalSlice = createSlice({
  name: "proposals",
  initialState: {
    proposals: [],
    currentProposal: null,
    founderInvestors: [],
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
        state.error = null;
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
        state.error = null;
      })
      .addCase(fetchProposals.fulfilled, (state, action) => {
        state.loading = false;
        state.proposals = action.payload;
      })
      .addCase(fetchProposals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch By Id
      .addCase(fetchProposalById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentProposal = null;
      })
      .addCase(fetchProposalById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProposal = action.payload;
      })
      .addCase(fetchProposalById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateProposal.pending, (state) => {
        state.loading = true;
        state.error = null;
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
        state.error = null;
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
      })

      // ✅ Handle Founder Investors
      .addCase(fetchFounderInvestors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFounderInvestors.fulfilled, (state, action) => {
        state.loading = false;
        state.founderInvestors = action.payload;
      })
      .addCase(fetchFounderInvestors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Exports
export const { clearProposalState, setCurrentProposal } = proposalSlice.actions;
export {
  fetchProposalById,
  fetchFounderInvestors,
  createProposal,
  fetchProposals,
  updateProposal,
  deleteProposal,
};
export default proposalSlice.reducer;
