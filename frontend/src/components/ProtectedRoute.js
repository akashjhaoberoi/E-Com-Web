import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProtectedRoute = ({ children }) => {
  const { token } = useCart();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
