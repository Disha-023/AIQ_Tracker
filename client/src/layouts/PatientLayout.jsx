import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  LayoutDashboard,
  Calendar,
  Clock,
  Activity as QueueIcon,
  Bell,
  History,
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { patientMockData } from '../data/patientMockData';

export default function PatientLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const patientName = user?.name || patientMockData.patient.name;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
    { label: 'Book Appointment', path: '/patient/appointment', icon: Calendar },
    { label: 'Join Walk-in Queue', path: '/patient/walk-in', icon: Clock },
    { label: 'Live Queue', path: '/patient/queue', icon: QueueIcon },
    { label: 'Notifications', path: '/patient/notifications', icon: Bell, badge: '3' },
    { label: 'Visit History', path: '/patient/history', icon: History },
    { label: 'Profile', path: '/patient/profile', icon: User }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans">
      
      {/* DESKTOP LEFT SIDEBAR (BRIGHT HEALTHCARE THEME) */}
      <aside className="hidden lg:flex flex-col w-64 bg-white text-slate-700 border-r border-slate-200/90 sticky top-0 h-screen shrink-0 shadow-2xs">
        
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white shadow-xs">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-extrabold text-slate-900 tracking-tight block leading-none">
              AIQ Tracker
            </span>
            <span className="text-[11px] text-teal-600 font-bold tracking-wide uppercase">
              Patient Portal
            </span>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 p-3.5 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-teal-600 text-white shadow-xs shadow-teal-600/20'
                    : 'text-slate-600 hover:bg-teal-50/60 hover:text-teal-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400 group-hover:text-teal-600'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      active ? 'bg-white/20 text-white' : 'bg-teal-100 text-teal-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Logout */}
        <div className="p-3.5 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            <span>Logout Account</span>
          </button>
        </div>
      </aside>

      {/* MOBILE DRAWER OVERLAY */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative flex flex-col w-72 max-w-xs bg-white text-slate-800 shadow-xl z-50 border-r border-slate-200">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-xs">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-base font-bold text-slate-900 leading-tight block">AIQ Tracker</span>
                  <span className="text-[10px] font-bold text-teal-600 tracking-wider uppercase">Patient Portal</span>
                </div>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-3.5 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      active
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-teal-50 hover:text-teal-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-teal-100 text-teal-800">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* PATIENT HEADER */}
        <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40 px-4 sm:px-6 lg:px-8 py-3.5 shadow-2xs">
          <div className="flex items-center justify-between gap-4">
            
            {/* Mobile Hamburger Button + Greeting */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileDrawerOpen(true)}
                className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-1.5 leading-tight">
                  Good Morning, {patientName} <span className="inline-block animate-bounce">👋</span>
                </h1>
                <p className="text-xs text-slate-500 hidden sm:block">
                  Here's your hospital visit overview.
                </p>
              </div>
            </div>

            {/* Header Right Side: Notification Icon & Profile Avatar */}
            <div className="flex items-center gap-3">
              <Link
                to="/patient/notifications"
                className="relative p-2 text-slate-600 hover:text-teal-700 hover:bg-teal-50/60 rounded-xl transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-ping" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
              </Link>

              <Link
                to="/patient/profile"
                className="flex items-center gap-2 pl-2 pr-3 py-1 bg-slate-50 hover:bg-teal-50/70 rounded-full border border-slate-200/80 hover:border-teal-200 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
                  {patientName.charAt(0)}
                </div>
                <span className="text-xs font-semibold text-slate-700 hidden sm:inline">
                  {patientName.split(' ')[0]}
                </span>
              </Link>
            </div>

          </div>
        </header>

        {/* PAGE BODY */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
