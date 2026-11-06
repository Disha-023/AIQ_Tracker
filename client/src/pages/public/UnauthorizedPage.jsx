import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LayoutDashboard, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getDefaultRoleRoute } from '../../services/authorizationService';

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handleReturnToDashboard = () => {
    if (isAuthenticated && user?.role) {
      navigate(getDefaultRoleRoute(user.role));
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow text-center space-y-6">
        
        {/* Warning Icon Header */}
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto shadow-2xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        {/* Access Denied Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200/80 shadow-2xs">
          <Lock className="w-3.5 h-3.5 text-rose-600" />
          403 — Restricted Area
        </div>

        {/* Title & Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Access Restricted</h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
            Your current account role does not have authorization to view this medical console. Please return to your designated portal.
          </p>
        </div>

        {/* Return to Dashboard Button */}
        <div className="pt-2">
          <button
            onClick={handleReturnToDashboard}
            className="w-full py-3 px-6 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:ring-offset-1"
          >
            <LayoutDashboard className="w-4 h-4 text-white" />
            Return to Designated Portal
          </button>
        </div>

        {/* Back Link */}
        <div className="pt-4 border-t border-slate-100">
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
  );
}
