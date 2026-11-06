import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, Activity, ArrowLeft, CheckCircle2, ShieldCheck, Lock, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 | 2 | 3 | 4 (success)
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // Step 1: Submit email / phone
  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your email address or mobile number.');
      return;
    }
    setError('');
    setStep(2);
  };

  // Step 2: Submit OTP
  const handleStep2Submit = (e) => {
    e.preventDefault();
    if (!otp.trim() || otp.trim().length < 4) {
      setError('Please enter a valid 6-digit verification code.');
      return;
    }
    setError('');
    setStep(3);
  };

  // Step 3: Reset password
  const handleStep3Submit = (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setStep(4); // Success state
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
        
        {/* Header Icon & Title */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white mx-auto mb-3 shadow-xs">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Account Recovery</h2>
          <p className="text-xs text-slate-500 mt-1">Reset your AIQ Tracker hospital password</p>
        </div>

        {/* 3-Step Visual Progress Stepper */}
        {step < 4 && (
          <div className="flex items-center justify-between mb-7 px-4">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step >= 1 ? 'bg-teal-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-400'
              }`}>
                1
              </div>
              <span className="text-[10.5px] font-bold text-slate-500 mt-1">Contact</span>
            </div>
            
            <div className={`flex-1 h-0.5 mx-2 transition-colors ${step >= 2 ? 'bg-teal-500' : 'bg-slate-200'}`} />

            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step >= 2 ? 'bg-teal-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-400'
              }`}>
                2
              </div>
              <span className="text-[10.5px] font-bold text-slate-500 mt-1">Verify</span>
            </div>

            <div className={`flex-1 h-0.5 mx-2 transition-colors ${step >= 3 ? 'bg-teal-500' : 'bg-slate-200'}`} />

            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step >= 3 ? 'bg-teal-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-400'
              }`}>
                3
              </div>
              <span className="text-[10.5px] font-bold text-slate-500 mt-1">New Pass</span>
            </div>
          </div>
        )}

        {/* Validation Error Alert */}
        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 shadow-2xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Enter email/mobile */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email / Mobile Number
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. user@hospital.com or 9876543210"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
              />
              <p className="text-[11px] text-slate-500 mt-1.5">
                Enter your registered account identifier to receive an OTP verification code.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:ring-offset-1"
            >
              Send Verification Code &rarr;
            </button>
          </form>
        )}

        {/* STEP 2: Enter OTP */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Verification Code (OTP)
                </label>
                <span className="text-[10px] text-teal-800 font-mono font-bold bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                  Mock Code: 123456
                </span>
              </div>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP (e.g. 123456)"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold tracking-widest text-center text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
              />
              <p className="text-[11px] text-slate-500 mt-1.5">
                We sent a 6-digit code to <strong className="text-slate-800">{identifier}</strong>.
              </p>
            </div>

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:ring-offset-1"
              >
                <ShieldCheck className="w-4 h-4" />
                Verify OTP
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Enter New Password */}
        {step === 3 && (
          <form onSubmit={handleStep3Submit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 chars)"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:ring-offset-1"
            >
              <Lock className="w-4 h-4" />
              Update Account Password
            </button>
          </form>
        )}

        {/* STEP 4: Success Completion Screen */}
        {step === 4 && (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-2xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Password Reset Successfully</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Your security credentials have been updated. You can now log in to your account with your new password.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Sign In to Account &rarr;
            </button>
          </div>
        )}

        {/* Navigation Links */}
        <div className="mt-6 pt-5 border-t border-slate-100 space-y-3 text-center">
          <div className="flex justify-center items-center gap-3 text-xs">
            <Link to="/login" className="font-bold text-teal-700 hover:underline">
              Patient Login
            </Link>
            <span className="text-slate-300">•</span>
            <Link to="/register" className="font-bold text-teal-700 hover:underline">
              Register Account
            </Link>
          </div>

          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Hospital Home
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
