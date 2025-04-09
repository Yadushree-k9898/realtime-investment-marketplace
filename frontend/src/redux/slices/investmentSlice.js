// redux/slices/investmentSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dashboardService from '@/services/dashboardService';

export const getInvestorStats = createAsyncThunk(
  'investments/getInvestorStats',
  async (_, thunkAPI) => {
    try {
      return await dashboardService.fetchInvestorStats();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getFundingTrends = createAsyncThunk(
  'investments/getFundingTrends',
  async (_, thunkAPI) => {
    try {
      return await dashboardService.fetchFundingTrends();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getInvestmentROI = createAsyncThunk(
  'investments/getInvestmentROI',
  async (_, thunkAPI) => {
    try {
      return await dashboardService.fetchInvestmentROI();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getTotalInvestments = createAsyncThunk(
  'investments/getTotalInvestments',
  async (_, thunkAPI) => {
    try {
      return await dashboardService.fetchTotalAnalysis();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const investmentSlice = createSlice({
  name: 'investments',
  initialState: {
    stats: null,
    trends: null,
    roiData: null,
    totalAnalysis: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getInvestorStats.pending, state => {
        state.loading = true;
      })
      .addCase(getInvestorStats.fulfilled, (state, action) => {
        state.stats = action.payload;
        state.loading = false;
      })
      .addCase(getInvestorStats.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(getFundingTrends.pending, state => {
        state.loading = true;
      })
      .addCase(getFundingTrends.fulfilled, (state, action) => {
        state.trends = action.payload;
        state.loading = false;
      })
      .addCase(getFundingTrends.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(getInvestmentROI.pending, state => {
        state.loading = true;
      })
      .addCase(getInvestmentROI.fulfilled, (state, action) => {
        state.roiData = action.payload;
        state.loading = false;
      })
      .addCase(getInvestmentROI.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(getTotalInvestments.pending, state => {
        state.loading = true;
      })
      .addCase(getTotalInvestments.fulfilled, (state, action) => {
        state.totalAnalysis = action.payload;
        state.loading = false;
      })
      .addCase(getTotalInvestments.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default investmentSlice.reducer;
