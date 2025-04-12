// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import API from '@/services/api';

// // Thunk: Fetch all investments
// export const fetchAllInvestments = createAsyncThunk(
//   'admin/fetchAllInvestments',
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await API.get('/admin/investments');
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || err.message);
//     }
//   }
// );

// // Thunk: Delete an investment by ID
// export const deleteInvestment = createAsyncThunk(
//   'admin/deleteInvestment',
//   async (id, { rejectWithValue }) => {
//     try {
//       await API.delete(`/admin/investments/${id}`);
//       return id;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || err.message);
//     }
//   }
// );

// // Thunk: Delete a user by ID
// export const deleteUserByAdmin = createAsyncThunk(
//   'admin/deleteUserByAdmin',
//   async (id, { rejectWithValue }) => {
//     try {
//       await API.delete(`/admin/users/${id}`);
//       return id;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || err.message);
//     }
//   }
// );

// const adminSlice = createSlice({
//   name: 'admin',
//   initialState: {
//     investments: [],
//     users: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // Fetch Investments
//       .addCase(fetchAllInvestments.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAllInvestments.fulfilled, (state, action) => {
//         state.loading = false;
//         state.investments = action.payload;
//       })
//       .addCase(fetchAllInvestments.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Delete Investment
//       .addCase(deleteInvestment.fulfilled, (state, action) => {
//         state.investments = state.investments.filter(inv => inv._id !== action.payload);
//       })
//       .addCase(deleteInvestment.rejected, (state, action) => {
//         state.error = action.payload;
//       })

//       // Delete User
//       .addCase(deleteUserByAdmin.fulfilled, (state, action) => {
//         state.users = state.users.filter(user => user._id !== action.payload);
//       })
//       .addCase(deleteUserByAdmin.rejected, (state, action) => {
//         state.error = action.payload;
//       });
//   },
// });

// export default adminSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '@/services/api';

// Fetch platform stats
 const fetchPlatformStats = createAsyncThunk(
  'admin/fetchPlatformStats',
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get('/admin/stats');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Fetch all investments
 const fetchAllInvestments = createAsyncThunk(
  'admin/fetchAllInvestments',
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get('/admin/investments');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Fetch all users
 const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get('/admin/users');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Fetch all proposals
 const fetchAllProposals = createAsyncThunk(
  'admin/fetchAllProposals',
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get('/admin/proposals');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Fetch user detail
 const fetchUserDetail = createAsyncThunk(
  'admin/fetchUserDetail',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await API.get(`/admin/users/${userId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Delete investment by ID
 const deleteInvestment = createAsyncThunk(
  'admin/deleteInvestment',
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/admin/investments/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Delete user by ID
 const deleteUserByAdmin = createAsyncThunk(
  'admin/deleteUserByAdmin',
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/admin/users/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Delete proposal by ID
 const deleteProposalById = createAsyncThunk(
  'admin/deleteProposalById',
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/admin/proposals/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    investments: [],
    users: [],
    proposals: [],
    stats: null,
    selectedUser: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Platform Stats
      .addCase(fetchPlatformStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlatformStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchPlatformStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Investments
      .addCase(fetchAllInvestments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllInvestments.fulfilled, (state, action) => {
        state.loading = false;
        state.investments = action.payload;
      })
      .addCase(fetchAllInvestments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteInvestment.fulfilled, (state, action) => {
        state.investments = state.investments.filter(inv => inv._id !== action.payload);
      })
      .addCase(deleteInvestment.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteUserByAdmin.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user._id !== action.payload);
      })
      .addCase(deleteUserByAdmin.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Proposals
      .addCase(fetchAllProposals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProposals.fulfilled, (state, action) => {
        state.loading = false;
        state.proposals = action.payload;
      })
      .addCase(fetchAllProposals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProposalById.fulfilled, (state, action) => {
        state.proposals = state.proposals.filter(p => p._id !== action.payload);
      })
      .addCase(deleteProposalById.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;

export {
  fetchPlatformStats,
  fetchAllInvestments,
  fetchAllUsers,
  fetchAllProposals,
  fetchUserDetail,
  deleteInvestment,
  deleteUserByAdmin,
  deleteProposalById,
};
