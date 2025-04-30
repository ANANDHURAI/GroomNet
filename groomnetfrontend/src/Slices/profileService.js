import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000',
});


API.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


API.interceptors.response.use(
  response => response,
  error => {
    // Handle token expiration
    if (error.response && error.response.status === 401) {
      console.log('Authentication error. You might need to login again.');
    }
    return Promise.reject(error);
  }
);


export const getProfile = async () => {
  try {
    const response = await API.get('/profile/');
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

export const updateProfile = async (formData) => {
  try {
    const response = await API.patch('/profile/update/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export default {
  getProfile,
  updateProfile,
};