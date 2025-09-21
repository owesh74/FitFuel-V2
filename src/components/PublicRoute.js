import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show a loading indicator while auth state is being determined
  if (loading) {
    return <div>Loading...</div>;
  }

  // If the user is logged in, redirect them away from the public page
  // to their dashboard. Otherwise, show the public page.
  return user ? <Navigate to="/dashboard" /> : children;
};

export default PublicRoute;