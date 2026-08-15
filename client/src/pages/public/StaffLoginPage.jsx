import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Eye, EyeOff, AlertCircle, Building2, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function StaffLoginPage() {
  const navigate = useNavigate();
  const { initiateStaffLogin } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!identifier.trim()) {
      setError('Invalid staff credentials.');
      return;
    }
    if (!password.trim()) {
      setError('Invalid staff credentials.');
      return;
    }

    // Step 1: Verify staff credentials & initiate MFA
    const result = initiateStaffLogin(identifier, password);

    if (!result.success) {
      setError(result.message || 'Invalid staff credentials.');
      return;
    }

    setError('');

    // Credentials verified -> Proceed to Step 2: MFA Verification (/staff/verify)
    navigate('/staff/verify');
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        
        {/* Header Logo & Staff Title */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-teal-400 mx-auto mb-3 shadow-xs">
            <Building2 className="w-6 h-6" />
          </div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200 mb-2">
            <Lock className="w-3 h-3 text-slate-500" />
            Authorized Personnel Only
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Hospital Staff Login</h2>
          <p className="text-sm text-slate-500 mt-1">Sign in with your Staff ID or assigned hospital email</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Staff Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Staff ID / Official Email
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => { setIdentifier(e.target.value); if (error) setError(''); }}
              placeholder="e.g. REC001, ADM001, or receptionist@aiqtracker.com"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
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
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white pr-10"
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
                className="rounded text-slate-900 focus:ring-slate-900 w-4 h-4 border-slate-300"
              />
              <span className="text-xs font-medium text-slate-600">Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            Continue
          </button>
        </form>

        {/* Navigation Shortcuts */}
        <div className="mt-6 pt-6 border-t border-slate-200 space-y-3 text-center">
          <p className="text-sm text-slate-600">
            Looking for Patient Portal?{' '}
            <Link to="/login" className="font-semibold text-teal-700 hover:underline">
              Patient Login
            </Link>
          </p>

          <div>
            <Link
              to="/staff"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Staff Portal Hub
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
