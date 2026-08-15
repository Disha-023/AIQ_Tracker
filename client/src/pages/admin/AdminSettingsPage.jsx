import React from 'react';
import { Settings } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <h1 className="text-2xl font-bold text-slate-900">Hospital System Configuration</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage global AIQ Tracker system parameters, OPD timings, and role policies</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs">
        <div className="flex justify-between items-center pb-3 border-b border-slate-200">
          <div>
            <h3 className="font-bold text-slate-900">OPD Working Hours</h3>
            <p className="text-slate-500">Default daily queue consultation window</p>
          </div>
          <span className="font-semibold text-purple-700">08:00 AM - 08:00 PM</span>
        </div>

        <div className="flex justify-between items-center pb-3 border-b border-slate-200">
          <div>
            <h3 className="font-bold text-slate-900">AI Waiting Time Refresh Interval</h3>
            <p className="text-slate-500">Live queue calculation update frequency</p>
          </div>
          <span className="font-semibold text-purple-700">Every 30 Seconds</span>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-900">Staff Authentication Policy</h3>
            <p className="text-slate-500">Enforce account-driven role determination</p>
          </div>
          <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full border border-emerald-200">
            Enabled
          </span>
        </div>
      </div>
    </div>
  );
}
