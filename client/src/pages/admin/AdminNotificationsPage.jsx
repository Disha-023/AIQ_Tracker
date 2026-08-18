import React, { useState } from 'react';
import { Bell, AlertTriangle, Info, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { adminMockData } from '../../data/adminMockData';

export default function AdminNotificationsPage() {
  const [notifications] = useState(adminMockData.notifications);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Administrative System Notifications</h1>
          <p className="text-xs text-slate-500 mt-0.5">Real-time operational alerts, queue warnings, and security audit logs.</p>
        </div>
        <span className="self-start sm:self-center px-3.5 py-1.5 rounded-full bg-purple-50 text-purple-800 text-xs font-bold border border-purple-200 flex items-center gap-1.5">
          <Bell className="w-4 h-4 text-purple-600" />
          Active Alerts: {notifications.length}
        </span>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((n) => (
          <div key={n.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                n.type === 'warning'
                  ? 'bg-amber-100 text-amber-700'
                  : n.type === 'security'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {n.type === 'warning' ? (
                  <AlertTriangle className="w-5 h-5" />
                ) : n.type === 'security' ? (
                  <ShieldAlert className="w-5 h-5" />
                ) : (
                  <Info className="w-5 h-5" />
                )}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{n.title}</h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                <span className="text-[10px] font-semibold text-slate-400 mt-2 block">{n.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
