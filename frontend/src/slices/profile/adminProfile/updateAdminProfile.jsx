import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

const updateAdminProfile = createAsyncThunk(
  'adminProfile/update',
  async (formData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': formData instanceof FormData ? 'multipart/form-data' : 'application/json',
        },
      };

      // Log data for debugging in development
      if (process.env.NODE_ENV === 'development' && formData instanceof FormData) {
        console.log('Updating profile with FormData:');
        for (let pair of formData.entries()) {
          console.log(`${pair[0]}: ${typeof pair[1] === 'object' ? 'File' : pair[1]}`);
        }
      }

      // Updated the API endpoint to match your backend URL structure
      const response = await apiClient.patch('/profile/admin/profile/', formData, config);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.detail || 'Failed to update profile';
      return rejectWithValue(errorMessage);
    }
  }
);

export default updateAdminProfile;