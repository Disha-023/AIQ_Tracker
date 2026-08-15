import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hasRolePermission, getDefaultRoleRoute } from '../services/authorizationService';

export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, role } = useAuth();

  // 1. Verify authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Strict Role-Based Access Control (RBAC) evaluation
  // Role is read strictly from AuthContext state (never from URL parameters or request bodies)
  if (!hasRolePermission(role, allowedRoles)) {
    const targetRoute = getDefaultRoleRoute(role);
    return <Navigate to={targetRoute} replace />;
  }

  return <Outlet />;
}
