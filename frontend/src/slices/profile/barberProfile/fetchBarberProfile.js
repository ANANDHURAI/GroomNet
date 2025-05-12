import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../authApiClient';

const fetchBarberProfile = createAsyncThunk(
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

export default fetchBarberProfile;
