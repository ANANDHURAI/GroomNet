// authService.js
import { useDispatch } from 'react-redux';
import { login, register as registerAction, setError } from './UserSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function useAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (email, password, userType) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/login/', { 
        email, 
        password,
        user_type: userType // Send user type to backend for verification (optional)
      });
      const data = response.data;
      
      // Store tokens and user data in localStorage
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      localStorage.setItem('userData', JSON.stringify(data.user));

      dispatch(login({
        name: data.user.name,
        email: data.user.email,
        userType: data.user.user_type,
        accessToken: data.access,
        refreshToken: data.refresh,
      }));

      navigate('/home');
      return { success: true, message: 'Login successful!' };
    } catch (error) {
      dispatch(setError(true));
      return { success: false, message: error.response?.data?.error || 'Login Failed' };
    }
  };

  const handleRegister = async (userData) => {
    try {
      // Map user types to their corresponding registration endpoints
      const endpoints = {
        barber: 'http://127.0.0.1:8000/register/barber/',
        admin: 'http://127.0.0.1:8000/register/admin/',
        customer: 'http://127.0.0.1:8000/register/user/', // Maps customer to user endpoint
      };
  
      const endpoint = endpoints[userData.user_type];
      if (!endpoint) {
        throw new Error('Invalid user type!');
      }
  
      // Make a copy of userData to modify
      const payload = {
        ...userData,
        confirm_password: userData.confirmPassword || userData.password, // Fix for confirmPassword field name
      };
  
      // Remove confirmPassword if it exists (as it's not expected by the backend)
      if (payload.confirmPassword) {
        delete payload.confirmPassword;
      }
  
      const response = await axios.post(endpoint, payload);
  
      // Dispatch register action
      dispatch(registerAction({
        name: response.data.name || userData.name,
        email: response.data.email || userData.email,
        phone: response.data.phone || userData.phone || '',
        userType: response.data.user_type || userData.user_type,
      }));
  
      // Navigate to login page specific to user type
      navigate(`/login/${userData.user_type}`);
  
      return { success: true, message: 'Registration successful! Please login.' };
    } catch (error) {
      console.error('Registration error:', error.response || error.message);
      const errorMessage = error.response?.data?.error || 
                           error.response?.data?.detail || 
                           (typeof error.response?.data === 'object' ? JSON.stringify(error.response.data) : 'Registration failed.');
      
      dispatch(setError(true));
      return { success: false, message: errorMessage };
    }
  };

  return { handleLogin, handleRegister };
}