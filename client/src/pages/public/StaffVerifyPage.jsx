import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, AlertCircle, ArrowLeft, KeyRound, RefreshCw, CheckCircle2 } from 'lucide-react';
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

  // Countdown timer for Resend Code
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

    // Auto-focus next input box
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
    setResendMessage('A new verification code has been dispatched to your registered staff contact.');
    setTimeout(() => setResendMessage(''), 4000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullOtp = otp.join('');

    if (fullOtp.length < 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    // Step 2: Verify 6-Digit OTP with AuthContext
    const result = verifyStaffOtp(fullOtp);

    if (!result.success) {
      setError(result.message || 'Invalid staff credentials.');
      return;
    }

    setError('');

    // Role-based redirection after successful MFA verification
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
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        
        {/* Header Logo & Title */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-teal-400 mx-auto mb-3 shadow-xs">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Verify Your Identity</h2>
          <p className="text-sm text-slate-500 mt-1">
            We sent a verification code to your registered staff contact.
          </p>
          {pendingStaffMfa && (
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200">
              Staff: {pendingStaffMfa.name} ({pendingStaffMfa.email})
            </span>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Resend Notification Banner */}
        {resendMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{resendMessage}</span>
          </div>
        )}

        {/* 6-DIGIT OTP VERIFICATION FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="flex justify-center gap-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-11 h-12 text-center text-xl font-bold bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900"
              />
            ))}
          </div>

          {/* Prototype Helper Badge */}
          <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-center">
            <p className="text-[11px] font-medium text-slate-600">
              Demo Staff OTP Code: <strong className="text-slate-900 font-mono font-bold">123456</strong>
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            Verify
          </button>
        </form>

        {/* Resend Code Section with Countdown */}
        <div className="mt-6 pt-6 border-t border-slate-200 text-center space-y-3">
          <div className="text-xs text-slate-500">
            Didn't receive the code?{' '}
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                className="font-bold text-slate-900 hover:underline cursor-pointer inline-flex items-center gap-1"
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
              Back to Staff Login
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
