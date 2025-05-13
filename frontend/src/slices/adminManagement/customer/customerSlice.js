import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllCustomers, toggleCustomerBlock } from './customerAPI';
import { logout } from '../../authSlices/authLogoutSlice';

/**
 * Async thunk to fetch all customers
 */
export const fetchCustomers = createAsyncThunk(
  'customers/fetch', 
  async (_, { dispatch, rejectWithValue }) => {
    try {
      return await getAllCustomers();
    } catch (error) {
      // If error contains "Session expired", dispatch logout action
      if (error.message && error.message.includes('Session expired')) {
        dispatch(logout());
      }
      
      const errorMessage = error.response?.data?.detail || 
                         error.response?.data?.error || 
                         error.message || 
                         'Failed to fetch customers';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Async thunk to toggle customer block status
 */
export const toggleBlock = createAsyncThunk(
  'customers/toggleBlock', 
  async (userId, { dispatch, rejectWithValue }) => {
    try {
      return await toggleCustomerBlock(userId);
    } catch (error) {
      // If we get a 401, we might want to handle token refresh or logout
      if (error.response && error.response.status === 401) {
        dispatch(logout());
        return rejectWithValue('Session expired. Please log in again.');
      }
      
      const errorMessage = error.response?.data?.detail || 
                         error.response?.data?.error || 
                         error.message || 
                         'Failed to toggle block status';
      return rejectWithValue(errorMessage);
    }
  }
);

const customerSlice = createSlice({
  name: 'customers',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
    lastFetched: null,
  },
  reducers: {
    clearCustomerState: (state) => {
      state.list = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchCustomers lifecycle
      .addCase(fetchCustomers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = 'succeeded';
        state.lastFetched = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      
      // Handle toggleBlock lifecycle
      .addCase(toggleBlock.pending, (state, action) => {
        // Optionally mark the specific user as loading
        const userId = action.meta.arg;
        const user = state.list.find(c => c.id === userId);
        if (user) user.isUpdating = true;
      })
      .addCase(toggleBlock.fulfilled, (state, action) => {
        const userId = action.payload;
        const user = state.list.find(c => c.id === userId);
        if (user) {
          user.is_blocked = !user.is_blocked;
          user.isUpdating = false;
        }
      })
      .addCase(toggleBlock.rejected, (state, action) => {
        const userId = action.meta.arg;
        const user = state.list.find(c => c.id === userId);
        if (user) user.isUpdating = false;
        
        state.error = action.payload || action.error.message;
      });
  }
});

export const { clearCustomerState } = customerSlice.actions;
export default customerSlice.reducer;