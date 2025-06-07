import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import LoadingCircle from '../reuseable/LoadingCircle';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();

  // Show loading state while authentication is being resolved
  if (isLoading) {
    return (
  <LoadingCircle/>
    );
  }

  // Redirect to login if user is not authenticated
  if (!user || !user.userData) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has one of the allowed roles
  const userRole = user.userData.role;
  if (!allowedRoles || !Array.isArray(allowedRoles) || !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render children if authenticated and role matches
  return children;
};

export default PrivateRoute;