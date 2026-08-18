import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { loginAdmin } = useAuth();

  const [identifier, setIdentifier] = useState('ADM001');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim() || !password) {
      setError('Please provide your admin email/ID and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = loginAdmin(identifier, password);
      if (result.success) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError(result.message || 'Invalid administrator credentials.');
      }
    } catch (err) {
      setError('An unexpected error occurred during admin login.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        
        {/* Back Link */}
        <div className="flex justify-center mb-2">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Return to AIQ Tracker Home
          </Link>
        </div>

        {/* Shield Icon Branding */}
        <div className="mx-auto w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-lg ring-4 ring-purple-500/20">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Hospital Administration Portal
        </h1>
        <p className="text-xs text-slate-400 font-medium">
          Authorized administrators only.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 shadow-2xl rounded-2xl sm:px-8 space-y-6">
          
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Admin Official Email / ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin@aiqtracker.com or ADM001"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 font-bold text-xs rounded-xl shadow-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Authenticating Admin...' : 'Log In to Administration Portal'}
            </button>
          </form>

          {/* SECURITY NOTICE */}
          <div className="pt-4 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 font-medium inline-flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
              Restricted Access &bull; System Audit Logging Active
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
