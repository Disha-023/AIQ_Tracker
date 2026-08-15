import React from 'react';
import { Activity } from 'lucide-react';

export default function AdminQueuePage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <h1 className="text-2xl font-bold text-slate-900">Hospital Queue Monitoring Dashboard</h1>
        <p className="text-xs text-slate-500 mt-0.5">Real-time OPD queue status across all hospital departments and rooms</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 uppercase font-semibold block">OPD Room 202 (General)</span>
          <div className="text-xl font-bold text-slate-900 mt-2">Serving #24 &bull; 18 Waiting</div>
          <span className="text-[11px] text-emerald-600 font-bold block mt-1">Queue Flow: Normal</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 uppercase font-semibold block">OPD Room 104 (Cardiology)</span>
          <div className="text-xl font-bold text-slate-900 mt-2">Serving #12 &bull; 6 Waiting</div>
          <span className="text-[11px] text-emerald-600 font-bold block mt-1">Queue Flow: Optimal</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 uppercase font-semibold block">OPD Room 305 (Pediatrics)</span>
          <div className="text-xl font-bold text-slate-900 mt-2">Serving #08 &bull; 4 Waiting</div>
          <span className="text-[11px] text-amber-600 font-bold block mt-1">Doctor On Break</span>
        </div>
      </div>
    </div>
  );
}
