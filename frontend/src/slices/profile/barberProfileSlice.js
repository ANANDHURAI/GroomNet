import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from './authApiClient'; 

export const fetchBarberProfile = createAsyncThunk(
  'barberProfile/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/profile/barber/profile/');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch profile'
      );
    }
  }
);

export const updateBarberProfile = createAsyncThunk(
  'barberProfile/update',
  async (formData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': formData instanceof FormData ? 'multipart/form-data' : 'application/json',
        },
      };
      
      const response = await apiClient.patch('/profile/barber/profile/', formData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to update profile'
      );
    }
  }
);

const barberProfileSlice = createSlice({
  name: 'barberProfile',
  initialState: {
    profile: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBarberProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBarberProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(fetchBarberProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateBarberProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBarberProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(updateBarberProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearErrors } = barberProfileSlice.actions;
export default barberProfileSlice.reducer;