import React from 'react';
import { BarChart3 } from 'lucide-react';

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <h1 className="text-2xl font-bold text-slate-900">Hospital Performance & Analytics Reports</h1>
        <p className="text-xs text-slate-500 mt-0.5">Statistical insights into patient waiting times, queue reduction, and doctor utilization</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <h3 className="font-bold text-slate-900 text-sm">Average Waiting Time Trend</h3>
          <p className="text-slate-500">Average patient waiting time reduced from 35 mins to 14 mins using AI predictions.</p>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="w-[85%] bg-purple-600 h-full" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <h3 className="font-bold text-slate-900 text-sm">Peak Hours OPD Load</h3>
          <p className="text-slate-500">Highest patient arrival volume recorded between 10:00 AM and 12:30 PM.</p>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="w-[65%] bg-blue-600 h-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
