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

      // Optional: Debug formData if it's FormData
      if (formData instanceof FormData) {
        for (let pair of formData.entries()) {
          console.log(`FormData contains: ${pair[0]}: ${pair[1]}`);
        }
      }

      const response = await apiClient.patch('/profile/admin/profile/', formData, config);
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || 'Failed to update profile'
      );
    }
  }
);

export default updateAdminProfile;