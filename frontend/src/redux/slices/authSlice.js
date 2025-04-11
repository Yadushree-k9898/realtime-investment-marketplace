import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '@/services/api';

const userFromStorage = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : null;

const initialState = {
  user: userFromStorage,
  isAuthenticated: !!userFromStorage,
  loading: false,
  error: null,
};

// REGISTER USER
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await API.post('/auth/register', formData);
      const fullUser = { ...res.data.user, token: res.data.token };
      localStorage.setItem('user', JSON.stringify(fullUser));
      return fullUser;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

// LOGIN USER
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await API.post('/auth/login', formData);
      const fullUser = { ...res.data.user, token: res.data.token };
      localStorage.setItem('user', JSON.stringify(fullUser));
      return fullUser;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// ADMIN DELETE USER
export const deleteUserByAdmin = createAsyncThunk(
  'admin/deleteUserByAdmin',
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      await API.delete(`/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'User deletion failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('user');
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADMIN DELETE USER
      .addCase(deleteUserByAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUserByAdmin.fulfilled, (state) => {
        state.loading = false;
        // You may handle local user list update here if needed
      })
      .addCase(deleteUserByAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
