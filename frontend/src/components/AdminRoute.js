import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const AdminRoute = ({ children }) => {
  const { token, user } = useCart();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
