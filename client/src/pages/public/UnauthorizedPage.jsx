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
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center space-y-6">
        
        {/* Warning Icon Header */}
        <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 mx-auto shadow-xs">
          <ShieldAlert className="w-9 h-9" />
        </div>

        {/* Access Denied Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200">
          <Lock className="w-3.5 h-3.5" />
          403 — Access Denied
        </div>

        {/* Title & Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Access Restricted</h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            You don't have permission to access this section. This area is reserved exclusively for authorized user roles.
          </p>
        </div>

        {/* Return to Dashboard Button */}
        <div className="pt-2">
          <button
            onClick={handleReturnToDashboard}
            className="w-full py-3.5 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4 text-teal-400" />
            Return to Dashboard
          </button>
        </div>

        {/* Back Link */}
        <div className="pt-4 border-t border-slate-200">
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
  );
}
