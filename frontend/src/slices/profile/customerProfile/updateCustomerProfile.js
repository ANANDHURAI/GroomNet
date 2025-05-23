import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

const updateCustomerProfile = createAsyncThunk(
  'customerProfile/update',
  async (formData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': formData instanceof FormData ? 'multipart/form-data' : 'application/json',
        },
      };

      if (formData instanceof FormData) {
        for (let pair of formData.entries()) {
          console.log(`FormData contains: ${pair[0]}: ${pair[1]}`);
        }
      }

      const response = await apiClient.patch('/profile/customer/profile/', formData, config);
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || 'Failed to update profile'
      );
    }
  }
);

export default updateCustomerProfile;
