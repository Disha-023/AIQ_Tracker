import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  ArrowLeft,
  Eye,
  EyeOff,
  AlertCircle,
  Building2,
  Lock,
  UserCheck,
  Stethoscope,
  Users,
  Activity,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function StaffLoginPage() {
  const navigate = useNavigate();
  const { loginStaff } = useAuth();

  const [identifier, setIdentifier] = useState('REC001');
  const [password, setPassword] = useState('reception123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!identifier.trim()) {
      setError('Please enter your Staff ID or official email.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = loginStaff(identifier, password);

      if (!result.success) {
        setError(result.message || 'Invalid staff credentials.');
        setIsSubmitting(false);
        return;
      }

      setError('');

      const userRole = result.user.role;
      if (userRole === 'receptionist') {
        navigate('/reception/dashboard');
      } else if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('An error occurred during staff authentication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyDemo = (demoId, demoPass) => {
    setIdentifier(demoId);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-5xl w-full bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* LEFT COLUMN: STAFF TERMINAL BRANDING (DESKTOP) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

          {/* Brand Header */}
          <div className="relative z-10 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-inner group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight block leading-tight text-white">
                  Kole Hospital
                </span>
                <span className="text-[11px] text-cyan-300 font-semibold uppercase tracking-wider block">
                  Staff Operations Terminal
                </span>
              </div>
            </Link>

            <div className="pt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-200 text-xs font-semibold">
                <Lock className="w-3.5 h-3.5 text-cyan-300" />
                Authorized Clinical Gateway
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 leading-snug tracking-tight">
                Front Desk & <br />
                <span className="text-cyan-300">OPD Queue Operations</span>
              </h1>
              <p className="text-xs sm:text-sm text-cyan-100/80 mt-2 leading-relaxed">
                Centralized dispatch terminal for reception desks, walk-in patient triage, and doctor consultation routing.
              </p>
            </div>
          </div>

          {/* Workstation Capabilities */}
          <div className="relative z-10 space-y-3.5 my-8">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 mt-0.5">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Live OPD Queue Dispatcher</h4>
                <p className="text-[11px] text-cyan-100/70 mt-0.5">One-click token call, status progress, and consultation room allocation.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 mt-0.5">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Instant Walk-In Patient Intake</h4>
                <p className="text-[11px] text-cyan-100/70 mt-0.5">Issue digital tokens and print slips for walk-ins in under 20 seconds.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 mt-0.5">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Doctor Consultation Tracking</h4>
                <p className="text-[11px] text-cyan-100/70 mt-0.5">Monitor physician availability and active room patient counts in real time.</p>
              </div>
            </div>
          </div>

          {/* Bottom Security Badge */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-cyan-200/80">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Internal Network Only
            </span>
            <span>Station ID: REC-01 &bull; Kole Hospital</span>
          </div>
        </div>

        {/* RIGHT COLUMN: REFINED STAFF AUTH FORM */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between">
          <div>
            {/* Top Bar with Patient Portal Link */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-100">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-700 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Home
              </Link>

              <div className="flex items-center gap-2">
                <Link
                  to="/admin-login"
                  className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-all flex items-center gap-1.5"
                >
                  <Lock className="w-3 h-3 text-slate-500" />
                  Admin Console &rarr;
                </Link>
              </div>
            </div>

            {/* Form Title */}
            <div className="mt-6 mb-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200/80 text-cyan-800 text-xs font-bold mb-2">
                <Building2 className="w-3.5 h-3.5 text-cyan-600" />
                Front Desk Authentication
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Staff Desk Sign In
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Enter your official hospital employee identifier and station password.
              </p>
            </div>

            {/* Quick Demo Credentials Bar */}
            <div className="mb-6 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="text-xs text-slate-700">
                <span className="font-bold text-slate-900">Demo Staff:</span>{' '}
                <span className="font-mono text-teal-700 font-semibold">REC001</span> &bull; <span className="font-mono text-teal-700 font-semibold">reception123</span>
              </div>
              <button
                type="button"
                onClick={() => handleApplyDemo('REC001', 'reception123')}
                className="self-start sm:self-center px-3 py-1 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold shadow-2xs transition-all cursor-pointer whitespace-nowrap"
              >
                Auto-Fill Demo
              </button>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2.5 shadow-2xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Official Staff Email / Employee ID
                </label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => { setIdentifier(e.target.value); if (error) setError(''); }}
                  placeholder="e.g. REC001 or receptionist@aiqtracker.com"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 focus:bg-white transition-all font-mono"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Station Password
                  </label>
                  <Link to="/forgot-password" className="text-xs font-semibold text-teal-700 hover:text-teal-900 transition-colors">
                    Reset Password
                  </Link>
                </div>
                
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (error) setError(''); }}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 focus:bg-white pr-11 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded-lg text-teal-600 focus:ring-teal-500 w-4 h-4 border-slate-300 accent-teal-600 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-slate-600">Remember session on this workstation</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-sm rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                <ShieldCheck className="w-4 h-4" />
                {isSubmitting ? 'Authenticating Staff...' : 'Sign In to Staff Desk'}
              </button>
            </form>
          </div>

          {/* Bottom Footnote */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-500">
              Are you a patient?{' '}
              <Link to="/login" className="font-bold text-teal-700 hover:text-teal-900 transition-colors">
                Open Patient Portal &rarr;
              </Link>
            </span>
            <span className="text-slate-400 text-[11px]">Authorized Hospital Desk Access</span>
          </div>
        </div>

      </div>
    </div>
  );
}
