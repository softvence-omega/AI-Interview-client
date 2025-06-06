import React from 'react'
import { useAuth } from '../context/AuthProvider';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();
    const UserRole = user.userData.role
    console.log("from private route", user);
  
    // Check if user is authenticated and has one of the allowed roles
    if (!user) {
      // Redirect to login if not authenticated
      return <Navigate to="/login" replace />;
    }
  
    if (!allowedRoles.includes(UserRole)) {
      // Redirect to unauthorized page if role doesn't match any allowed roles
      return <Navigate to="/unauthorized" replace />;
    }
  
    // Render children if authenticated and role matches
    return children;
  };
  
  export default PrivateRoute;
