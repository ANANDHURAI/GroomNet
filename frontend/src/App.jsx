
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login, adminLogin } from './slices/authSlice';

import Login from './pages/authpages/LoginPage';
import AdminLogin from './pages/authpages/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import Home from './pages/common/Home';
import RegisterPage from './pages/authpages/RegisterPage';
import { ProtectedRoute, AdminRoute } from './components/Protected/ProtectedRoutes';
import OtpVerifyPage from './pages/authpages/Otpverifypage';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (userData && accessToken && refreshToken) {
      try {
        const user = JSON.parse(userData);
        
        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        
        if (user.isAdmin) {
          dispatch(adminLogin({
            name: user.name,
            email: user.email,
            accessToken: user.accessToken,
            refreshToken: user.refreshToken,
            isSuperuser: user.isSuperuser
          }));
        } else {
          dispatch(login({
            name: user.name,
            email: user.email,
            userType: user.userType,
            phone: user.phone,
            accessToken: user.accessToken,
            refreshToken: user.refreshToken
          }));
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);

        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/aadmin/login" element={<AdminLogin />} />
        <Route path='/otp' element={<OtpVerifyPage/>}/>
      
        <Route path="/" element={<Navigate to="/home" replace />} />
        
       
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
        </Route>
        
        
        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;