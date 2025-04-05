
// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import proposalReducer from './slices/proposalSlice'; // ✅ import the proposal reducer

export const store = configureStore({
  reducer: {
    auth: authReducer,
    proposals: proposalReducer, // ✅ register it here with correct key
  },
});
