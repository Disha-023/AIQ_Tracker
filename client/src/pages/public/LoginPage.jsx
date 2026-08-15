import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Activity, ArrowLeft, Eye, EyeOff, AlertCircle, ShieldCheck, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!identifier.trim()) {
      setError('Please enter your email address or mobile number.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    // Account-driven login (Role is determined automatically by the authenticated account)
    const result = login(identifier, password);

    if (!result.success) {
      setError(result.message || 'Invalid email/mobile number or password.');
      return;
    }

    setError('');

    // Role-based automatic redirection
    const userRole = result.user.role;
    if (userRole === 'patient') navigate('/patient/dashboard');
    else if (userRole === 'receptionist') navigate('/reception/dashboard');
    else if (userRole === 'admin') navigate('/admin/dashboard');
    else navigate('/');
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        
        {/* Header Logo & Title */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white mx-auto mb-3 shadow-xs">
            <Activity className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Patient Login</h2>
          <p className="text-sm text-slate-500 mt-1">Login to continue to your patient portal</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Patient Login Form (No Role Selector) */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Email / Mobile Number
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => { setIdentifier(e.target.value); if (error) setError(''); }}
              placeholder="e.g. patient@example.com or 9876543210"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs font-semibold text-teal-700 hover:underline">
                Forgot Password?
              </Link>
            </div>
            
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => { setPassword(e.target.value); if (error) setError(''); }}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 border-slate-300"
              />
              <span className="text-xs font-medium text-slate-600">Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            Login
          </button>
        </form>

        {/* Security Message */}
        <div className="mt-4 pt-3 text-center border-t border-slate-100">
          <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            Your account type is automatically determined after secure authentication.
          </p>
        </div>

        {/* Patient Registration & Staff Portal Links */}
        <div className="mt-6 pt-6 border-t border-slate-200 space-y-4 text-center">
          <p className="text-sm text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-teal-700 hover:underline">
              Create Patient Account
            </Link>
          </p>

          {/* Hospital Staff Portal Link */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1.5">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-800">
              <Building2 className="w-4 h-4 text-teal-600" />
              Hospital Staff?
            </div>
            <p className="text-[11px] text-slate-500">
              Authorized hospital personnel can access the Staff Portal.
            </p>
            <Link
              to="/staff"
              className="inline-block mt-1 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold text-xs rounded-lg transition-colors"
            >
              Staff Portal &rarr;
            </Link>
          </div>

          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Home
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
