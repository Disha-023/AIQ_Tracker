import React from 'react';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">AIQ Tracker</span>
            </div>
            <p className="text-slate-300 font-medium text-sm">
              Smart Appointment & Queue Management
            </p>
            <p className="text-teal-400 font-semibold text-xs tracking-wide uppercase">
              "Know your waiting time. Know when to leave."
            </p>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Empowering hospital patients, reception desks, and administration with real-time queue visibility and intelligent departure recommendations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 tracking-wider uppercase">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-teal-400 transition-colors">Home</Link>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-teal-400 transition-colors">How It Works</a>
              </li>
              <li>
                <a href="/#features" className="hover:text-teal-400 transition-colors">Features</a>
              </li>
              <li>
                <Link to="/login" className="hover:text-teal-400 transition-colors">Login</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-teal-400 transition-colors">Register</Link>
              </li>
            </ul>
          </div>

          {/* User Portals */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 tracking-wider uppercase">Hospital Portals</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/patient/dashboard" className="hover:text-teal-400 transition-colors">Patient Portal</Link>
              </li>
              <li>
                <Link to="/reception/dashboard" className="hover:text-teal-400 transition-colors">Reception Desk</Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-teal-400 transition-colors">Admin Control</Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} AIQ Tracker. All rights reserved. Professional Healthcare System.
          </div>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>&bull;</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span>&bull;</span>
            <span className="hover:text-slate-400 cursor-pointer">Contact Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
