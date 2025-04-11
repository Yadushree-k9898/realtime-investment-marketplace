
// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import proposalReducer from './slices/proposalSlice';
import adminReducer from './slices/adminSlice'; // ✅ import your admin slice

export const store = configureStore({
  reducer: {
    auth: authReducer,
    proposals: proposalReducer,
    admin: adminReducer, // ✅ add the admin slice here
  },
});
