import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  ArrowLeft,
  Lock,
  Users,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Stethoscope,
  Activity,
  CheckCircle2
} from 'lucide-react';

export default function StaffPortalPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-4xl w-full bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-8 sm:p-12 space-y-8">
        
        {/* Top Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white mx-auto shadow-md">
            <Building2 className="w-7 h-7" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200/80 shadow-2xs">
            <Lock className="w-3.5 h-3.5 text-teal-600" />
            Authorized Clinical Personnel Switchboard
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Hospital Staff & Governance Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Select your assigned hospital operational station to proceed with secure terminal authentication at Kole Hospital.
          </p>
        </div>

        {/* Security Advisory Card */}
        <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 text-xs text-teal-900 flex items-start gap-3 shadow-2xs">
          <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-bold text-teal-950">Hospital Operational Policy:</strong>{' '}
            Staff accounts are authorized credentials provisioned exclusively by <strong>Hospital Administration</strong>. Public staff sign-up is disabled to maintain patient data integrity.
          </div>
        </div>

        {/* Workstation Selector Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Reception Desk */}
          <div
            onClick={() => navigate('/staff/login')}
            className="group relative p-7 rounded-3xl bg-slate-50 hover:bg-teal-50/40 border border-slate-200/90 hover:border-teal-400 transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between space-y-5"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Live Desk Active
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                  OPD Receptionist Workstation
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Front-desk intake terminal to issue OPD walk-in tokens, manage patient check-ins, skip/call tokens, and dispatch patients to doctor rooms.
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Walk-In Patient Intake & Token Slips
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Real-Time Doctor Room Coordination
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Daily Patient Consultation Log
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-teal-700">
              <span>Open Reception Desk Station</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Card 2: Hospital Administration */}
          <div
            onClick={() => navigate('/admin/login')}
            className="group relative p-7 rounded-3xl bg-slate-50 hover:bg-emerald-50/40 border border-slate-200/90 hover:border-emerald-400 transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between space-y-5"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold border border-teal-200">
                  Tier 1 Executive
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Hospital Command Center
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Executive governance suite for department heads, doctor availability rosters, staff credentials, AI queue metrics, and system configuration.
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Hospital-Wide Queue Telemetry
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Doctor & Staff Roster Governance
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Clinical Department Load Balancing
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>Open Command Center</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

        </div>

        {/* Footer Navigation */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Hospital Home
          </Link>

          <span className="text-slate-500">
            Need patient services?{' '}
            <Link to="/login" className="font-bold text-teal-700 hover:text-teal-900 transition-colors">
              Open Patient Portal &rarr;
            </Link>
          </span>
        </div>

      </div>
    </div>
  );
}
