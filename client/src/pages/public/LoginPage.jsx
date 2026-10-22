import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LogIn,
  Activity,
  ArrowLeft,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldCheck,
  Building2,
  Navigation,
  Clock,
  Sparkles,
  CheckCircle2,
  PhoneCall,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('patient@example.com');
  const [password, setPassword] = useState('patient123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!identifier.trim()) {
      setError('Please enter your email address or mobile number.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(identifier, password);

      if (!result.success) {
        setError(result.message || 'Invalid email/mobile number or password.');
        setIsSubmitting(false);
        return;
      }

      setError('');

      const userRole = result.user.role;
      if (userRole === 'patient') navigate('/patient/dashboard');
      else if (userRole === 'receptionist') navigate('/reception/dashboard');
      else if (userRole === 'admin') navigate('/admin/dashboard');
      else navigate('/');
    } catch (err) {
      setError('An unexpected error occurred during login. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyDemo = (demoEmail, demoPass) => {
    setIdentifier(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-5xl w-full bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* LEFT COLUMN: BRANDING & CLINICAL HIGHLIGHTS (DESKTOP) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-teal-800 via-teal-900 to-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background radial glow */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative z-10 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 shadow-inner group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight block leading-tight text-white">
                  AIQ Tracker
                </span>
                <span className="text-[11px] text-teal-300 font-semibold uppercase tracking-wider block">
                  Kole Hospital Suite
                </span>
              </div>
            </Link>

            <div className="pt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-200 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                Next-Gen Patient Care
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 leading-snug tracking-tight">
                Smarter Hospital Visits. <br />
                <span className="text-teal-300">Zero Waiting Anxiety.</span>
              </h1>
              <p className="text-xs sm:text-sm text-teal-100/80 mt-2 leading-relaxed">
                Connect directly with your doctor's queue, get dynamic AI-predicted consultation times, and know exactly when to depart from home.
              </p>
            </div>
          </div>

          {/* Feature Pillars */}
          <div className="relative z-10 space-y-3.5 my-8">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0 mt-0.5">
                <Navigation className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">TomTom Live Traffic Navigation</h4>
                <p className="text-[11px] text-teal-100/70 mt-0.5">Real-time driving ETA calculated from your doorstep to Kole Hospital.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Real-Time OPD Token Radar</h4>
                <p className="text-[11px] text-teal-100/70 mt-0.5">Live queue position updates so you arrive right when the doctor is ready.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0 mt-0.5">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Frictionless Online Appointments</h4>
                <p className="text-[11px] text-teal-100/70 mt-0.5">Choose preferred specialists and time slots in seconds.</p>
              </div>
            </div>
          </div>

          {/* Bottom Trust Stat */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-teal-200/80">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> HIPAA-grade Privacy
            </span>
            <span>Kole Hospital &bull; 24/7 OPD</span>
          </div>
        </div>

        {/* RIGHT COLUMN: REFINED PATIENT AUTH FORM */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between">
          <div>
            {/* Top Bar with Role Switcher & Back Link */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-100">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-700 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Home
              </Link>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">Not a patient?</span>
                <Link
                  to="/staff"
                  className="px-3 py-1 rounded-full bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 text-xs font-semibold border border-slate-200 transition-all flex items-center gap-1.5"
                >
                  <Building2 className="w-3 h-3 text-teal-600" />
                  Staff Portal
                </Link>
              </div>
            </div>

            {/* Form Title */}
            <div className="mt-6 mb-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold mb-2">
                <LogIn className="w-3.5 h-3.5 text-teal-600" />
                Patient Sign In
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome Back
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Enter your credentials to view your live queue position and hospital appointments.
              </p>
            </div>

            {/* Demo Quick-Fill Pill Bar */}
            <div className="mb-6 p-3 rounded-2xl bg-teal-50/60 border border-teal-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="text-xs text-teal-900 font-medium">
                <span className="font-bold text-teal-950">Demo Credentials:</span>{' '}
                <span className="font-mono text-teal-700 font-semibold">patient@example.com</span>
              </div>
              <button
                type="button"
                onClick={() => handleApplyDemo('patient@example.com', 'patient123')}
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
                  Email Address or Mobile Number
                </label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => { setIdentifier(e.target.value); if (error) setError(''); }}
                  placeholder="e.g. patient@example.com or 9876543210"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-xs font-semibold text-teal-700 hover:text-teal-900 transition-colors">
                    Forgot password?
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
                  <span className="text-xs font-medium text-slate-600">Keep me signed in on this device</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-sm rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                <LogIn className="w-4 h-4" />
                {isSubmitting ? 'Authenticating Patient...' : 'Sign In to Patient Portal'}
              </button>
            </form>
          </div>

          {/* Bottom Footnote */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-500">
              Don't have an account yet?{' '}
              <Link to="/register" className="font-bold text-teal-700 hover:text-teal-900 transition-colors">
                Create Patient Account &rarr;
              </Link>
            </span>
            <span className="text-slate-400 text-[11px]">Kole Hospital &bull; Sangli</span>
          </div>
        </div>

      </div>
    </div>
  );
}
