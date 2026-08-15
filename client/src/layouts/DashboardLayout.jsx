import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, ArrowLeft, Shield, UserCheck, Users, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleInfo = () => {
    if (location.pathname.startsWith('/patient')) {
      return { title: 'Patient Portal', badge: 'Patient', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: UserCheck };
    }
    if (location.pathname.startsWith('/reception')) {
      return { title: 'Reception Desk', badge: 'Receptionist', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Users };
    }
    if (location.pathname.startsWith('/admin')) {
      return { title: 'Admin Control Center', badge: 'Admin', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Shield };
    }
    return { title: 'Dashboard', badge: 'User', color: 'bg-slate-100 text-slate-800 border-slate-200', icon: Activity };
  };

  const role = getRoleInfo();
  const IconComponent = role.icon;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top bar for Dashboards */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo & Current Role */}
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="text-lg font-bold text-slate-900 tracking-tight hidden sm:inline">
                  AIQ Tracker
                </span>
              </Link>

              <span className="text-slate-300">|</span>

              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${role.color}`}>
                  <IconComponent className="w-3.5 h-3.5" />
                  {role.badge}
                </span>
                <span className="text-sm font-semibold text-slate-700 hidden md:inline">{role.title}</span>
              </div>
            </div>

            {/* Logged In User Info & Navigation Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-xs font-medium bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                <User className="w-3.5 h-3.5 text-teal-600" />
                <span className="text-slate-700 font-semibold">{user?.name || 'Logged User'}</span>
              </div>

              <Link
                to="/"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Home
              </Link>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        <Outlet />
      </main>

      {/* Clean Dashboard Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        AIQ Tracker Hospital Management System &bull; Phase 1 Authentication
      </footer>
    </div>
  );
}
