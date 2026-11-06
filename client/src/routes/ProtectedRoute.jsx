import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hasRolePermission, getDefaultRoleRoute } from '../services/authorizationService';

export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, role } = useAuth();

  // 1. Verify authentication
  if (!isAuthenticated) {
    if (allowedRoles?.includes('admin')) {
      return <Navigate to="/admin/login" replace />;
    }
    if (allowedRoles?.includes('receptionist')) {
      return <Navigate to="/staff/login" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  // 2. Strict Role-Based Access Control (RBAC) evaluation
  // Role is read strictly from AuthContext state (never from URL parameters or frontend selectors)
  if (!hasRolePermission(role, allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
