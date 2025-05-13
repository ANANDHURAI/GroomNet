import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

// ProtectedRoute component to wrap around routes that require authentication
const ProtectedRoute = ({ children, requiredUserType }) => {
  const auth = useSelector((state) => state.authLogin);
  const { islogged, userType } = auth || {};

  // Not logged in - redirect to login
  if (!islogged) {
    return <Navigate to="/login" replace />;
  }

  // If a specific user type is required and user doesn't match, redirect to home
  if (requiredUserType && userType !== requiredUserType) {
    // Redirect based on user type
    switch(userType) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'barber':
        return <Navigate to="/barber/home" replace />;
      default:
        return <Navigate to="/home" replace />;
    }
  }

  // User is authenticated and has the right role, render the protected component
  return children;
};

export default ProtectedRoute;