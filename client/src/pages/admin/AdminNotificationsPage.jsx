import React from 'react';
import { Bell } from 'lucide-react';
import { adminMockData } from '../../data/adminMockData';

export default function AdminNotificationsPage() {
  const { notifications } = adminMockData;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Audit & Admin Alerts</h1>
          <p className="text-xs text-slate-500 mt-0.5">System security logs and administrative operational notifications</p>
        </div>
        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-full border border-purple-200">
          2 New Logs
        </span>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div key={n.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-slate-900 text-sm">{n.title}</h3>
                <span className="text-[11px] text-slate-400 font-medium">{n.time}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
