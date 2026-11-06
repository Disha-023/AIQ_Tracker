import React, { useState } from 'react';
import { Bell, AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';

export default function ReceptionistNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getAll();
      setNotifications(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load system notifications.');
    } finally {
      setLoading(false);
    }
  };

  useAutoRefresh(fetchNotifications, 15000);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-bold mb-2">
            <Bell className="w-3.5 h-3.5 text-teal-600" />
            <span>Operational Alerts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Hospital Alerts & Dispatches</h1>
          <p className="text-xs text-slate-500 mt-0.5">Real-time alerts regarding OPD queue lengths, wait delays, and cancellations</p>
        </div>
        <span className="self-start sm:self-center px-4 py-2 bg-teal-50 text-teal-800 text-xs font-bold rounded-2xl border border-teal-200">
          {notifications.length} System Alerts
        </span>
      </div>

      <div className="space-y-3.5">
        {loading && notifications.length === 0 ? (
          <div className="text-center py-10 text-slate-400 font-semibold bg-white border border-slate-200/90 rounded-3xl shadow-xs text-xs">
            Loading alerts...
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500 font-semibold bg-white border border-slate-200/90 rounded-3xl shadow-xs text-xs">
            {error}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-semibold bg-white border border-slate-200/90 rounded-3xl shadow-xs text-xs">
            <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-600">No system alerts logged in database</p>
            <p className="text-xs text-slate-400 mt-0.5">All hospital queues are operating normally</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs hover:border-teal-500/40 hover:shadow-md transition-all flex items-start gap-4">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                n.type === 'warning'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : n.type === 'security'
                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                  : 'bg-teal-50 text-teal-700 border-teal-200'
              }`}>
                {n.type === 'warning' ? (
                  <AlertTriangle className="w-5 h-5" />
                ) : n.type === 'security' ? (
                  <ShieldAlert className="w-5 h-5" />
                ) : (
                  <Bell className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-slate-900 text-sm">{n.title}</h3>
                  <span className="text-[11px] text-slate-400 font-medium">{n.time}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">{n.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
