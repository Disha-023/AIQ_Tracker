import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, HeartPulse, Building2, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white text-slate-600 py-12 border-t border-slate-200/90 shadow-2xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white shadow-xs">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-slate-900 tracking-tight block leading-none">
                  AIQ Tracker
                </span>
                <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
                  Kole Hospital System
                </span>
              </div>
            </div>
            <p className="text-slate-800 font-semibold text-sm">
              Smart Hospital Appointment & Live Queue Navigation Platform
            </p>
            <p className="text-teal-700 font-bold text-xs tracking-wide">
              "Know your waiting time. Know when to leave."
            </p>
            <p className="text-xs text-slate-500 max-w-md leading-relaxed">
              Designed for hospital patients, front-desk receptionists, and clinical administrators to provide real-time queue visibility, traffic-aware navigation, and structured arrival planning.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                Sangli, Maharashtra
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200/70">
                <HeartPulse className="w-3.5 h-3.5 text-teal-600" />
                Outpatient Department System
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-slate-900 text-xs font-bold mb-4 tracking-wider uppercase text-[11px]">Quick Navigation</h4>
            <ul className="space-y-2.5 text-xs font-medium text-slate-600">
              <li>
                <Link to="/" className="hover:text-teal-700 transition-colors">Hospital Portal Home</Link>
              </li>
              <li>
                <a href="/#journey" className="hover:text-teal-700 transition-colors">Patient Journey</a>
              </li>
              <li>
                <a href="/#features" className="hover:text-teal-700 transition-colors">System Features</a>
              </li>
              <li>
                <Link to="/login" className="hover:text-teal-700 transition-colors">Patient Sign In</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-teal-700 transition-colors">New Patient Registration</Link>
              </li>
            </ul>
          </div>

          {/* Hospital Portals */}
          <div>
            <h4 className="text-slate-900 text-xs font-bold mb-4 tracking-wider uppercase text-[11px]">Hospital Portals</h4>
            <ul className="space-y-2.5 text-xs font-medium text-slate-600">
              <li>
                <Link to="/login" className="hover:text-teal-700 transition-colors">Patient Portal</Link>
              </li>
              <li>
                <Link to="/staff-login" className="hover:text-teal-700 transition-colors">Front Desk Receptionist</Link>
              </li>
              <li>
                <Link to="/admin-login" className="hover:text-teal-700 transition-colors">Hospital Administration</Link>
              </li>
              <li>
                <Link to="/staff" className="hover:text-teal-700 transition-colors">Staff Gateway Hub</Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} AIQ Tracker &bull; Kole Hospital OPD Queue Management System.
          </div>
          <div className="flex gap-4 text-slate-500 font-medium">
            <span className="hover:text-teal-700">Patient Privacy Policy</span>
            <span>&bull;</span>
            <span className="hover:text-teal-700">Terms of Service</span>
            <span>&bull;</span>
            <span className="hover:text-teal-700">Hospital Desk Help</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
