import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeAuth } from './slices/utils/authInit';
import Login from './pages/authpages/LoginPage';
import AdminLogin from './pages/authpages/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import Home from './pages/common/Home';
import RegisterPage from './pages/authpages/RegisterPage';
import OtpVerifyPage from './pages/authpages/Otpverifypage';
import BarberHome from './pages/barber/BarberHome';
import BarberProfilePage from './pages/profiles/BarberProfilePage';
import CustomerProfilePage from './pages/profiles/CustomerProfilePage';
import AdminProfilePage from './pages/profiles/AdminProfilePage';
import ForgotPassword from './pages/authpages/ForgotPassword';
import ResetPassword from './pages/authpages/ResetPassword';
import CustomerList from './pages/admin/CustomerList';


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    initializeAuth(dispatch);
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/aadmin/login" element={<AdminLogin />} />
        <Route path="/otp" element={<OtpVerifyPage />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset" element={<ResetPassword />} />
        
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/home" replace />} />
    
        {/* Main Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/barber/home" element={<BarberHome />} />
        
        {/* Profile Routes */}
        <Route path="/profile/customer" element={<CustomerProfilePage />} />
        <Route path="/profile/barber" element={<BarberProfilePage />} />
        <Route path="/profile/admin" element={<AdminProfilePage />} />
        
        {/* Catch All Route */}
        <Route path="*" element={<Navigate to="/home" replace />} />

        <Route path="/customers" element={<CustomerList />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;