import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../authApiClient';

const updateBarberProfile = createAsyncThunk(
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

export default updateBarberProfile;
