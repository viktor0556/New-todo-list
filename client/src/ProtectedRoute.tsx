import React from 'react';
import { Navigate, Route } from 'react-router-dom';

interface ProtectedRouteProps {
  element: React.ReactElement;
  path: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, path }) => {
  const token = localStorage.getItem('token');
  return token ? <Route path={path} element={element} /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
