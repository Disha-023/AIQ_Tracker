import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, LogIn, UserPlus, LogOut, Menu, X, User, Building2, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (user?.role === 'receptionist') return '/reception/dashboard';
    if (user?.role === 'admin') return '/admin/dashboard';
    return '/patient/dashboard';
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 transition-all font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          
          {/* Logo & Brand Treatment */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-slate-950 tracking-tight block leading-none">
                AIQ Tracker
              </span>
              <span className="text-[11px] text-teal-700 font-semibold tracking-wide">
                Smart Hospital Queue
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-semibold transition-colors ${
                isActive('/') ? 'text-teal-700' : 'text-slate-600 hover:text-teal-700'
              }`}
            >
              Home
            </Link>
            <a
              href="/#journey"
              className="text-sm font-semibold text-slate-600 hover:text-teal-700 transition-colors"
            >
              Patient Journey
            </a>
            <a
              href="/#features"
              className="text-sm font-semibold text-slate-600 hover:text-teal-700 transition-colors"
            >
              System Features
            </a>
            <Link
              to="/staff"
              className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/staff') ? 'text-teal-700' : 'text-slate-600 hover:text-teal-700'
              }`}
            >
              <Building2 className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
              Staff Portal
            </Link>
          </nav>

          {/* Desktop Right Side Auth State */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-teal-50/80 border border-teal-200/80 text-xs font-bold text-teal-900 hover:bg-teal-100/70 transition-all shadow-2xs"
                >
                  <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-[11px] font-bold">
                    {user?.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <span>{user?.name || 'My Dashboard'}</span>
                  <span className="capitalize px-2 py-0.5 rounded-full bg-teal-600 text-white text-[10px] tracking-wide font-bold">
                    {user?.role}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50/60 rounded-xl transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:text-teal-800 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <LogIn className="w-4 h-4 text-slate-500" />
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-xl shadow-xs hover:shadow-sm transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl focus:outline-none transition-colors cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-5 pt-3 pb-5 space-y-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                isActive('/') ? 'bg-teal-50 text-teal-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>
            <a
              href="/#journey"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Patient Journey
            </a>
            <a
              href="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              System Features
            </a>
            <Link
              to="/staff"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-between ${
                isActive('/staff') ? 'bg-teal-50 text-teal-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>Staff & Admin Portal</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
          </nav>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 text-xs font-bold text-teal-900 bg-teal-50 border border-teal-200 rounded-xl"
                >
                  Open Dashboard ({user?.role})
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-center px-4 py-2.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 text-xs font-bold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50"
                >
                  Patient Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 text-xs font-bold text-white bg-teal-600 rounded-xl hover:bg-teal-700 shadow-xs"
                >
                  Register Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
