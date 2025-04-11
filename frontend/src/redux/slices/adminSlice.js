import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '@/services/api';

// Thunk: Fetch all investments
export const fetchAllInvestments = createAsyncThunk(
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

// Thunk: Delete an investment by ID
export const deleteInvestment = createAsyncThunk(
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

// Thunk: Delete a user by ID
export const deleteUserByAdmin = createAsyncThunk(
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

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    investments: [],
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Investments
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

      // Delete Investment
      .addCase(deleteInvestment.fulfilled, (state, action) => {
        state.investments = state.investments.filter(inv => inv._id !== action.payload);
      })
      .addCase(deleteInvestment.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete User
      .addCase(deleteUserByAdmin.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user._id !== action.payload);
      })
      .addCase(deleteUserByAdmin.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;
