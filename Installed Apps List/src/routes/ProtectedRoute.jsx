import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

export default function PrivateRoute({
  isAllowed,
  redirectPath = '/login',
  children
}) {
  if (!isAllowed) return <Navigate to={redirectPath} replace />;

  return children ? children : <Outlet />;
}
