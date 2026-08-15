/**
 * AIQ Tracker Authorization & RBAC Service Layer
 * Prepared for future Express.js / PostgreSQL backend token verification
 */

export const ROLES = {
  PATIENT: 'patient',
  RECEPTIONIST: 'receptionist',
  ADMIN: 'admin'
};

export const ROLE_ROUTES = {
  [ROLES.PATIENT]: '/patient/dashboard',
  [ROLES.RECEPTIONIST]: '/reception/dashboard',
  [ROLES.ADMIN]: '/admin/dashboard'
};

/**
 * Strictly evaluates if a user's role satisfies route requirements
 */
export const hasRolePermission = (userRole, allowedRoles = []) => {
  if (!userRole) return false;
  if (!allowedRoles || allowedRoles.length === 0) return true;
  return allowedRoles.includes(userRole);
};

/**
 * Returns canonical home path for a user role
 */
export const getDefaultRoleRoute = (userRole) => {
  return ROLE_ROUTES[userRole] || '/';
};

/**
 * Formats Bearer Authorization header for future API calls
 */
export const getAuthHeaders = (token) => {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const authorizationService = {
  ROLES,
  ROLE_ROUTES,
  hasRolePermission,
  getDefaultRoleRoute,
  getAuthHeaders
};

export default authorizationService;
