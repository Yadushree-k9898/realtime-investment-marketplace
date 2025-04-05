import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

// Load user from localStorage if available
const userFromStorage = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : null;

// ✅ Set token globally on reload
if (userFromStorage?.token) {
  API.defaults.headers.common['Authorization'] = `Bearer ${userFromStorage.token}`;
}

const initialState = {
  user: userFromStorage,
  isAuthenticated: !!userFromStorage,
  loading: false,
  error: null,
};

// REGISTER
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await API.post('/auth/register', formData);
      const fullUser = { ...res.data.user, token: res.data.token };
      localStorage.setItem('user', JSON.stringify(fullUser));
      API.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      return fullUser;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

// LOGIN
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await API.post('/auth/login', formData);
      const fullUser = { ...res.data.user, token: res.data.token };
      localStorage.setItem('user', JSON.stringify(fullUser));
      API.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      return fullUser;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
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
      delete API.defaults.headers.common['Authorization'];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        API.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        API.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
