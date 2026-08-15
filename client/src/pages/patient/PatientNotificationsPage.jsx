import React from 'react';
import { Bell, Sparkles } from 'lucide-react';
import { patientMockData } from '../../data/patientMockData';

export default function PatientNotificationsPage() {
  const { notifications } = patientMockData;

  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
          <Bell className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-sm text-slate-500">Real-time alerts, queue updates, and appointment reminders</p>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <div key={notif.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">{notif.title}</h4>
              <p className="text-xs text-slate-600 mt-1">{notif.message}</p>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold bg-white px-2.5 py-1 rounded border border-slate-200 shrink-0">
              {notif.time}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 text-center space-y-3">
        <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto border border-teal-200">
          <Sparkles className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-bold text-slate-800">Push & SMS Notification Center</h4>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Full push notifications, SMS integrations, and preference controls will be expanded in upcoming phases.
        </p>
      </div>
    </div>
  );
}
