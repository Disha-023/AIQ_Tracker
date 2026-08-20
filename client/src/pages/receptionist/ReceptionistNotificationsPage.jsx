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
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Operational Hospital Alerts</h1>
          <p className="text-xs text-slate-500 mt-0.5">Real-time alerts regarding OPD queue lengths, wait delays, and cancellations</p>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full border border-blue-200">
          {notifications.length} System Alerts
        </span>
      </div>

      <div className="space-y-3">
        {loading && notifications.length === 0 ? (
          <div className="text-center py-8 text-slate-500 font-semibold bg-white border border-slate-200 rounded-2xl shadow-xs text-xs">
            Loading alerts...
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500 font-semibold bg-white border border-slate-200 rounded-2xl shadow-xs text-xs">
            {error}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8 text-slate-500 font-semibold bg-white border border-slate-200 rounded-2xl shadow-xs text-xs">
            No system alerts logged in database.
          </div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
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
                  <Bell className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-slate-900 text-sm">{n.title}</h3>
                  <span className="text-[11px] text-slate-400 font-medium">{n.time}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
