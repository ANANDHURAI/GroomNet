import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  error: null,
  successMessage: null,
};

const authForgotSlice = createSlice({
  name: 'authForgot',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.successMessage = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setSuccessMessage: (state, action) => {
      state.successMessage = action.payload;
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    resetState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.successMessage = null;
    }
  },
});

export const {
  startLoading,
  stopLoading,
  setError,
  clearError,
  setSuccessMessage,
  clearSuccessMessage,
  resetState
} = authForgotSlice.actions;

export default authForgotSlice.reducer;