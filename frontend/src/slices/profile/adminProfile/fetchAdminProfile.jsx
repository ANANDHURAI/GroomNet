import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

const fetchAdminProfile = createAsyncThunk(
  'adminProfile/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/profile/admin/profile/');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch profile'
      );
    }
  }
);

export default fetchAdminProfile;