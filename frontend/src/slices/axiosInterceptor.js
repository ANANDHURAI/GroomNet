
import axios from "axios";
import { store } from "../reduxstore/store";
import { logout } from "./authSlice";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

function getCsrfToken() {
  const name = 'csrftoken';
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

apiClient.interceptors.request.use(
  (config) => {
   
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    

    if (config.method !== 'get') {
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
      }
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (!error.response || error.response.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }
    
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return apiClient(originalRequest);
        })
        .catch(err => {
          return Promise.reject(err);
        });
    }
    
    originalRequest._retry = true;
    isRefreshing = true;
    
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (!refreshToken) {
        store.dispatch(logout());
        return Promise.reject(error);
      }
      
      const response = await axios.post(
        'http://localhost:8000/token/refresh/',
        { refresh: refreshToken },
        { 
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      
      if (response.status === 200) {
        const { access } = response.data;
        
        localStorage.setItem('access_token', access);
        
     
        originalRequest.headers['Authorization'] = `Bearer ${access}`;
        
       
        processQueue(null, access);
        
        return apiClient(originalRequest);
      }
    } catch (refreshError) {
      processQueue(refreshError, null);
      
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      store.dispatch(logout());
      
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;