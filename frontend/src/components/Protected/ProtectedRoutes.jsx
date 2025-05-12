
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ProtectedRoute = () => {
  const { islogged } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!islogged) {
   
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};


export const AdminRoute = () => {
  const { islogged, isAdmin } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!islogged) {
 
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {

    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};