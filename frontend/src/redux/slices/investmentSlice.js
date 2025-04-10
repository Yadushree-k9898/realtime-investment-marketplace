import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import investmentService from '@/services/investmentService'; // ✅ use correct service

export const getInvestorStats = createAsyncThunk(
  'investments/getInvestorStats',
  async (_, thunkAPI) => {
    try {
      return await investmentService.fetchInvestorStats();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getFundingTrends = createAsyncThunk(
  'investments/getFundingTrends',
  async (_, thunkAPI) => {
    try {
      return await investmentService.fetchFundingTrends();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getTotalInvestments = createAsyncThunk(
  'investments/getTotalInvestments',
  async (_, thunkAPI) => {
    try {
      return await investmentService.fetchTotalAnalysis();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Add more thunks like getInvestmentROI if needed

const investmentSlice = createSlice({
  name: 'investments',
  initialState: {
    stats: null,
    trends: null,
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
        state.error = null;
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
        state.error = null;
      })
      .addCase(getFundingTrends.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(getTotalInvestments.pending, state => {
        state.loading = true;
      })
      .addCase(getTotalInvestments.fulfilled, (state, action) => {
        state.totalAnalysis = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getTotalInvestments.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default investmentSlice.reducer;
