import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

const fetchAdminProfile = createAsyncThunk(
  'adminProfile/fetch',
  async (_, { rejectWithValue }) => {
    try {
      
      const response = await apiClient.get('/profile/admin/profile/');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.detail || 'Failed to fetch profile';
      return rejectWithValue(errorMessage);
    }
  }
);

export default fetchAdminProfile;