// RequireAdminRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const RequireAdminRoute = ({ children }) => {
  const { user, isLoggedIn } = useSelector((state) => state.auth);

  if (!isLoggedIn || user?.utilisateur?.role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RequireAdminRoute;
