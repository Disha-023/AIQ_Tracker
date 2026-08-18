import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Context & Security
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import PatientLayout from '../layouts/PatientLayout';
import ReceptionistLayout from '../layouts/ReceptionistLayout';
import AdminLayout from '../layouts/AdminLayout';

// Public Pages
import LandingPage from '../pages/public/LandingPage';
import LoginPage from '../pages/public/LoginPage';
import StaffPortalPage from '../pages/public/StaffPortalPage';
import StaffLoginPage from '../pages/public/StaffLoginPage';
import AdminLoginPage from '../pages/public/AdminLoginPage';
import StaffVerifyPage from '../pages/public/StaffVerifyPage';
import RegisterPage from '../pages/public/RegisterPage';
import ForgotPasswordPage from '../pages/public/ForgotPasswordPage';
import UnauthorizedPage from '../pages/public/UnauthorizedPage';

// Patient Pages
import PatientDashboard from '../pages/patient/PatientDashboard';
import PatientAppointmentPage from '../pages/patient/PatientAppointmentPage';
import PatientWalkInPage from '../pages/patient/PatientWalkInPage';
import PatientQueuePage from '../pages/patient/PatientQueuePage';
import PatientNotificationsPage from '../pages/patient/PatientNotificationsPage';
import PatientHistoryPage from '../pages/patient/PatientHistoryPage';
import PatientProfilePage from '../pages/patient/PatientProfilePage';

// Receptionist Pages
import ReceptionistDashboard from '../pages/receptionist/ReceptionistDashboard';
import ReceptionistAppointmentsPage from '../pages/receptionist/ReceptionistAppointmentsPage';
import ReceptionistQueuePage from '../pages/receptionist/ReceptionistQueuePage';
import ReceptionistPatientsPage from '../pages/receptionist/ReceptionistPatientsPage';
import ReceptionistRegisterPatientPage from '../pages/receptionist/ReceptionistRegisterPatientPage';
import ReceptionistVisitsPage from '../pages/receptionist/ReceptionistVisitsPage';
import ReceptionistNotificationsPage from '../pages/receptionist/ReceptionistNotificationsPage';
import ReceptionistProfilePage from '../pages/receptionist/ReceptionistProfilePage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminStaffPage from '../pages/admin/AdminStaffPage';
import AdminDoctorsPage from '../pages/admin/AdminDoctorsPage';
import AdminPatientsPage from '../pages/admin/AdminPatientsPage';
import AdminAppointmentsPage from '../pages/admin/AdminAppointmentsPage';
import AdminDepartmentsPage from '../pages/admin/AdminDepartmentsPage';
import AdminQueuePage from '../pages/admin/AdminQueuePage';
import AdminReportsPage from '../pages/admin/AdminReportsPage';
import AdminNotificationsPage from '../pages/admin/AdminNotificationsPage';
//import AdminAuditLogsPage from '../pages/admin/AdminAuditLogsPage';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage';
import AdminProfilePage from '../pages/admin/AdminProfilePage';

export default function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/staff" element={<StaffPortalPage />} />
            <Route path="/staff/login" element={<StaffLoginPage />} />
            <Route path="/staff-login" element={<StaffLoginPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/staff/verify" element={<StaffVerifyPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
          </Route>

          {/* Protected Patient Routes (Wrapped in PatientLayout) */}
          <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
            <Route element={<PatientLayout />}>
              <Route path="/patient/dashboard" element={<PatientDashboard />} />
              <Route path="/patient/appointment" element={<PatientAppointmentPage />} />
              <Route path="/patient/walk-in" element={<PatientWalkInPage />} />
              <Route path="/patient/queue" element={<PatientQueuePage />} />
              <Route path="/patient/notifications" element={<PatientNotificationsPage />} />
              <Route path="/patient/history" element={<PatientHistoryPage />} />
              <Route path="/patient/profile" element={<PatientProfilePage />} />
            </Route>
          </Route>

          {/* Protected Receptionist Routes (Wrapped in ReceptionistLayout) */}
          <Route element={<ProtectedRoute allowedRoles={['receptionist']} />}>
            <Route element={<ReceptionistLayout />}>
              <Route path="/reception/dashboard" element={<ReceptionistDashboard />} />
              <Route path="/reception/appointments" element={<ReceptionistAppointmentsPage />} />
              <Route path="/reception/queue" element={<ReceptionistQueuePage />} />
              <Route path="/reception/tokens" element={<Navigate to="/reception/queue" replace />} />
              <Route path="/reception/token-management" element={<Navigate to="/reception/queue" replace />} />
              <Route path="/reception/patients" element={<ReceptionistPatientsPage />} />
              <Route path="/reception/register-patient" element={<ReceptionistRegisterPatientPage />} />
              <Route path="/reception/visits" element={<ReceptionistVisitsPage />} />
              <Route path="/reception/notifications" element={<ReceptionistNotificationsPage />} />
              <Route path="/reception/profile" element={<ReceptionistProfilePage />} />
            </Route>
          </Route>

          {/* Protected Admin Routes (Wrapped in AdminLayout) */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/doctors" element={<AdminDoctorsPage />} />
              <Route path="/admin/staff" element={<AdminStaffPage />} />
              <Route path="/admin/patients" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/appointments" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/departments" element={<AdminDepartmentsPage />} />
              <Route path="/admin/queue" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/reports" element={<AdminReportsPage />} />
              <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
              <Route path="/admin/audit-logs" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/settings" element={<AdminSettingsPage />} />
              <Route path="/admin/profile" element={<AdminProfilePage />} />
            </Route>
          </Route>

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
