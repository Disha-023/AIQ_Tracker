import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, ShieldCheck, ArrowLeft, Lock, Users, ShieldAlert, ArrowRight, Info } from 'lucide-react';

export default function StaffPortalPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-xl w-full bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-teal-400 mx-auto shadow-md">
            <Building2 className="w-7 h-7" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            Authorized Hospital Personnel Only
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Hospital Staff Portal</h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Secure entry point for Receptionists and Hospital Administrators to manage OPD hospital operations.
          </p>
        </div>

        {/* Notice Badge */}
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            Staff accounts are authorized credentials provisioned exclusively by <strong>Hospital Administration</strong>. Public self-registration for staff accounts is disabled.
          </span>
        </div>

        {/* Portal Information Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-blue-900 text-sm">
              <Users className="w-4 h-4 text-blue-700" />
              OPD Front Desk Receptionist
            </div>
            <p className="text-blue-800 leading-relaxed">
              Manage patient walk-ins, issue queue tokens, check in scheduled appointments, and control OPD room dispatches.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-purple-900 text-sm">
              <ShieldAlert className="w-4 h-4 text-purple-700" />
              Hospital Administrator
            </div>
            <p className="text-purple-800 leading-relaxed">
              Executive management of staff accounts, doctor room assignments, hospital analytics, and system configurations.
            </p>
          </div>

        </div>

        {/* Primary Action Button */}
        <div className="pt-2">
          <button
            onClick={() => navigate('/staff/login')}
            className="w-full py-3.5 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            Continue to Staff Login
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Footer Navigation */}
        <div className="pt-6 border-t border-slate-200 space-y-3 text-center">
          <p className="text-sm text-slate-600">
            Looking for Patient Portal?{' '}
            <Link to="/login" className="font-semibold text-teal-700 hover:underline">
              Patient Login
            </Link>
          </p>

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
