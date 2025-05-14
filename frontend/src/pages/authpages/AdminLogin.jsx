import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../slices/authSlices/authAdminLoginSlice';
import apiClient from '../../slices/api/apiClient';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { islogged, isAdmin } = useSelector((state) => state.authAdminLogin);

  useEffect(() => {
    
    if (islogged && isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [islogged, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with:', { email });

      const response = await apiClient.post('/aadmin/login/', {
        email,
        password
      });

      console.log("Login response status:", response.status);

      if (!response.data || !response.data.access) {
        console.error('Missing access token in response:', response.data);
        setError('Invalid server response. Please contact support.');
        return;
      }

      const { access, refresh } = response.data;

      let userData = {
        name: email,
        email: email,
        isSuperuser: false
      };

      if (response.data.user) {
        userData = {
          name: response.data.user.name || email,
          email: response.data.user.email || email,
          isSuperuser: !!response.data.user.is_superuser
        };
      }

      console.log('Login successful, user data:', userData);

      localStorage.setItem('access_token', access);
      if (refresh) {
        localStorage.setItem('refresh_token', refresh);
      }

      localStorage.setItem('user', JSON.stringify({
        ...userData,
        isAdmin: true,
        accessToken: access,
        refreshToken: refresh || ''
      }));

      dispatch(adminLogin({
        name: userData.name,
        email: userData.email,
        accessToken: access,
        refreshToken: refresh || '',
        isSuperuser: userData.isSuperuser
      }));

      console.log('Login successful, redirecting to dashboard');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Admin login error:', err);

      if (err.response) {
        console.error('Error response:', err.response.data);
        const errorMessage = err.response.data.message || 'Login failed. Please check your credentials.';
        setError(errorMessage);
      } else if (err.request) {
        console.error('No response received:', err.request);
        setError('Server is not responding. Please try again later.');
      } else {
        console.error('Error setting up request:', err.message);
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Admin Login</h2>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
