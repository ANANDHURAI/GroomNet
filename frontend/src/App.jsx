import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeAuth } from './slices/utils/authInit';
import Login from './pages/authpages/LoginPage';
import AdminLogin from './pages/authpages/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import Home from './pages/common/Home';
import RegisterPage from './pages/authpages/RegisterPage';
// import { ProtectedRoute, AdminRoute } from './components/Protected/ProtectedRoutes';
import OtpVerifyPage from './pages/authpages/Otpverifypage';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    initializeAuth(dispatch);
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/aadmin/login" element={<AdminLogin />} />
        <Route path="/otp" element={<OtpVerifyPage />} />
        
       
        <Route path="/" element={<Navigate to="/home" replace />} />
        
        {/* Protected user routes */}
    
        <Route path="/home" element={<Home />} />
        {/* Admin routes */}
        
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;