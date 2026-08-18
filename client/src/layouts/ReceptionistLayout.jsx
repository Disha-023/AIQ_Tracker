import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  LayoutDashboard,
  Calendar,
  Users,
  Ticket,
  Search,
  UserPlus,
  ClipboardList,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Building2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { receptionistMockData } from '../data/receptionistMockData';

export default function ReceptionistLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const staffName = user?.name || receptionistMockData.receptionist.name;

  const handleLogout = () => {
    logout();
    navigate('/staff-login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/reception/dashboard', icon: LayoutDashboard },
    { label: 'Appointments', path: '/reception/appointments', icon: Calendar },
    { label: 'OPD Queue', path: '/reception/queue', icon: Users },
    { label: 'Patient Search', path: '/reception/patients', icon: Search },
    { label: 'Patient Registration', path: '/reception/register-patient', icon: UserPlus },
    { label: "Today's Visits", path: '/reception/visits', icon: ClipboardList },
    { label: 'Notifications', path: '/reception/notifications', icon: Bell, badge: '3' },
    { label: 'Profile', path: '/reception/profile', icon: User }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      
      {/* DESKTOP RECEPTIONIST LEFT SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 sticky top-0 h-screen shrink-0">
        
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold text-white tracking-tight block leading-none">
              AIQ Tracker
            </span>
            <span className="text-[11px] text-blue-400 font-semibold tracking-wide">
              Reception Desk
            </span>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                      active ? 'bg-white text-blue-900' : 'bg-blue-900 text-blue-300'
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
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-950/50 hover:text-red-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Staff</span>
          </button>
        </div>
      </aside>

      {/* MOBILE DRAWER OVERLAY */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative flex flex-col w-72 max-w-xs bg-slate-900 text-slate-300 shadow-2xl z-50">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-base font-bold text-white">Reception Desk</span>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-blue-900 text-blue-300">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-950/50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* RECEPTIONIST TOP HEADER */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-6 lg:px-8 py-3.5 shadow-xs">
          <div className="flex items-center justify-between gap-4">
            
            {/* Mobile Menu + Greeting */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileDrawerOpen(true)}
                className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div>
                <h1 className="text-base sm:text-xl font-bold text-slate-900 flex items-center gap-1.5 leading-tight">
                  Good Morning, {staffName} 👋
                </h1>
                <p className="text-xs text-slate-500 hidden sm:block">
                  Here's today's hospital operations overview.
                </p>
              </div>
            </div>

            {/* Header Right Side */}
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                OPD Front Desk &bull; REC001
              </span>

              <Link
                to="/reception/notifications"
                className="relative p-2 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-xl transition-colors"
                title="Operational Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
              </Link>

              <Link
                to="/reception/profile"
                className="flex items-center gap-2 pl-2 pr-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full border border-slate-200 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  {staffName.charAt(0)}
                </div>
                <span className="text-xs font-semibold text-slate-700 hidden sm:inline">
                  {staffName.split(' ')[0]}
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
