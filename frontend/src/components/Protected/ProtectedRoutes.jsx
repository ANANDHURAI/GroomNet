// src/components/Protected/ProtectedRoutes.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Protected route for regular users
export const ProtectedRoute = () => {
  const { islogged } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!islogged) {
    // Redirect to login if not logged in, but remember where they were going
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

// Protected route specifically for admin users
export const AdminRoute = () => {
  const { islogged, isAdmin } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!islogged) {
    // Redirect to admin login if not logged in
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    // Redirect to home if logged in but not admin
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};