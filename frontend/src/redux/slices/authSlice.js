import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

const userFromStorage = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : null;

if (userFromStorage?.token) {
  API.defaults.headers.common['Authorization'] = `Bearer ${userFromStorage.token}`;
}

const initialState = {
  user: userFromStorage,
  isAuthenticated: !!userFromStorage,
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk('auth/registerUser', async (formData, { rejectWithValue }) => {
  try {
    const res = await API.post('/auth/register', formData);
    const fullUser = { ...res.data.user, token: res.data.token };
    localStorage.setItem('user', JSON.stringify(fullUser));
    API.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    return fullUser;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

export const loginUser = createAsyncThunk('auth/loginUser', async (formData, { rejectWithValue }) => {
  try {
    const res = await API.post('/auth/login', formData);
    const fullUser = { ...res.data.user, token: res.data.token };
    localStorage.setItem('user', JSON.stringify(fullUser));
    API.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    return fullUser;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('user');
      delete API.defaults.headers.common['Authorization'];
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => { state.loading = true; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => { state.loading = true; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
