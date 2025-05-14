import axios from 'axios';

import { store } from '../../../reduxstore/store';
import { logout } from '../../authSlices/authLogoutSlice';
import { updateTokens } from '../../authSlices/authTokenUpdateSlice';

const BASE_URL = 'http://localhost:8000/admin_manage/admin/customers';

/**
 * Gets the authorization headers using the access token from localStorage
 * @returns {Object} Headers object with Authorization
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };
};

/**
 * Fetch all customers from the API
 * @returns {Promise<Array>} List of customers
 */
export const getAllCustomers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    // If we get a 401 error, the token might be expired
    if (error.response && error.response.status === 401) {
      // Let the apiClient interceptor handle token refresh
      // This will happen automatically if you're using your apiClient
      // If using direct axios calls, you may need to handle refresh manually
      
      // Try to refresh the token
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('No refresh token available');
        
        const refreshResponse = await axios.post(
          'http://localhost:8000/token/refresh/',
          { refresh: refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );
        
        if (refreshResponse.status === 200) {
          const { access } = refreshResponse.data;
          localStorage.setItem('access_token', access);
          store.dispatch(updateTokens({ accessToken: access }));
          
          // Retry the original request with the new token
          const retryResponse = await axios.get(`${BASE_URL}/`, {
            headers: {
              Authorization: `Bearer ${access}`,
              'Content-Type': 'application/json',
            }
          });
          
          return retryResponse.data;
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // If refresh fails, logout the user
        store.dispatch(logout());
        throw new Error('Session expired. Please log in again.');
      }
    }
    
    console.error('Error fetching customers:', error);
    throw error;
  }
};

/**
 * Toggle the block status of a customer
 * @param {number} userId - The ID of the customer to toggle
 * @returns {Promise<number>} The user ID that was toggled
 */
export const toggleCustomerBlock = async (userId) => {
  try {
    await axios.post(`${BASE_URL}/${userId}/block-toggle/`, {}, {
      headers: getAuthHeaders(),
    });
    return userId;
  } catch (error) {
    console.error(`Error toggling block status for user ${userId}:`, error);
    throw error;
  }
};

/**
 * Get details for a specific customer
 * @param {number} userId - The ID of the customer
 * @returns {Promise<Object>} Customer details
 */
export const getCustomerDetails = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${userId}/`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for user ${userId}:`, error);
    throw error;
  }
};