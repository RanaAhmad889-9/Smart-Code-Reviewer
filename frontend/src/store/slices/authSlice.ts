import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { AuthState } from '@/types';

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Login failed');
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (
    { email, username, password }: { email: string; username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post('/auth/signup', { email, username, password });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Signup failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    },
    loadFromStorage(state) {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user) {
          state.token = token;
          state.user = JSON.parse(user);
        }
      }
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', action.payload.token);
          localStorage.setItem('user', JSON.stringify(action.payload.user));
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.isLoading = false;
        // After signup, user needs to log in
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, loadFromStorage, clearError } = authSlice.actions;
export default authSlice.reducer;
