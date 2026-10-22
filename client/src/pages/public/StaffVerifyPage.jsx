import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, AlertCircle, ArrowLeft, KeyRound, RefreshCw, CheckCircle2, Lock, Building2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function StaffVerifyPage() {
  const navigate = useNavigate();
  const { pendingStaffMfa, verifyStaffOtp } = useAuth();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const inputRefs = useRef([]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleInputChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (error) setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setCountdown(30);
    setCanResend(false);
    setResendMessage('A new security token has been dispatched to your registered personnel contact.');
    setTimeout(() => setResendMessage(''), 4000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullOtp = otp.join('');

    if (fullOtp.length < 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    const result = verifyStaffOtp(fullOtp);

    if (!result.success) {
      setError(result.message || 'Invalid staff verification code.');
      return;
    }

    setError('');

    const userRole = result.user.role;
    if (userRole === 'receptionist') {
      navigate('/reception/dashboard');
    } else if (userRole === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/patient/dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-xl space-y-6">
        
        {/* Header Logo & Title */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white mx-auto shadow-md">
            <KeyRound className="w-7 h-7" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200/80 shadow-2xs">
            <Lock className="w-3.5 h-3.5 text-teal-600" />
            Two-Factor Personnel Verification
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Verify Identity</h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Enter the 6-digit security authorization code dispatched to your registered medical contact.
          </p>

          {pendingStaffMfa && (
            <div className="pt-1">
              <span className="inline-block px-3.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200">
                Staff: {pendingStaffMfa.name} &bull; <span className="font-mono">{pendingStaffMfa.email}</span>
              </span>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2.5 shadow-2xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Resend Notification Banner */}
        {resendMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{resendMessage}</span>
          </div>
        )}

        {/* 6-DIGIT OTP VERIFICATION FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2.5 sm:gap-3">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-12 h-14 text-center text-xl font-extrabold bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 focus:bg-white text-slate-900 transition-all font-mono"
              />
            ))}
          </div>

          {/* Prototype Helper Badge */}
          <div className="p-3 rounded-2xl bg-teal-50/70 border border-teal-200/70 text-center">
            <p className="text-xs font-medium text-teal-950">
              Demo Security Code: <strong className="text-teal-700 font-mono font-bold text-sm tracking-widest">123456</strong>
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-sm rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-white" />
            Verify Staff Credentials
          </button>
        </form>

        {/* Resend Code Section with Countdown */}
        <div className="pt-5 border-t border-slate-100 text-center space-y-3">
          <div className="text-xs text-slate-500">
            Didn't receive the authorization token?{' '}
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                className="font-bold text-teal-700 hover:underline cursor-pointer inline-flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3 text-teal-600" />
                Resend Code
              </button>
            ) : (
              <span className="font-semibold text-slate-400">
                Resend code in 00:{countdown < 10 ? `0${countdown}` : countdown}
              </span>
            )}
          </div>

          <div>
            <Link
              to="/staff/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Staff Login
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
