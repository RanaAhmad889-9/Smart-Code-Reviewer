import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { AnalysisState } from '@/types';

const initialState: AnalysisState = {
  result: null,
  isLoading: false,
  error: null,
};

export const analyzeCode = createAsyncThunk(
  'analysis/analyze',
  async ({ code, language }: { code: string; language: string }, { rejectWithValue }) => {
    try {
      const res = await api.post('/analyses/analyze', { code, language });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Analysis failed');
    }
  }
);

const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    clearResult(state) {
      state.result = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(analyzeCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(analyzeCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.result = action.payload;
      })
      .addCase(analyzeCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearResult } = analysisSlice.actions;
export default analysisSlice.reducer;
