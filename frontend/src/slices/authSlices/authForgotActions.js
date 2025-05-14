import {
  startLoading,
  stopLoading,
  setError,
  setSuccessMessage,
} from './authForgotSlice';
import axios from 'axios';


export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch(startLoading());
    const response = await axios.post(
      'http://localhost:8000/forgot-password/', 
      { email },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    dispatch(setSuccessMessage(response.data.message));
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || 
                         error.response?.data?.detail || 
                         'Failed to send OTP. Please try again.';
    dispatch(setError(errorMessage));
    throw error;
  } finally {
    dispatch(stopLoading());
  }
};

// Action to reset password with OTP verification
export const resetPassword = (email, otp, newPassword) => async (dispatch) => {
  try {
    dispatch(startLoading());
    const response = await axios.post(
      'http://localhost:8000/reset-password/', 
      {
        email,
        otp,
        new_password: newPassword,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    dispatch(setSuccessMessage(response.data.message));
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || 
                         error.response?.data?.detail || 
                         'Failed to reset password. Please try again.';
    dispatch(setError(errorMessage));
    throw error;
  } finally {
    dispatch(stopLoading());
  }
};