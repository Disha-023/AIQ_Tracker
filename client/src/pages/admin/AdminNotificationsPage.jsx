import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Info, ShieldAlert, CheckCircle2, RefreshCw, Filter } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('all');

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getAll();
      setNotifications(data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  useAutoRefresh(fetchNotifications, 15000);

  const filteredNotifications = notifications.filter(n => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/60 text-teal-800 text-xs font-semibold mb-2">
            <Bell className="w-3.5 h-3.5 text-teal-600" />
            Audit & Incident Log
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">System Notifications</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Real-time operational alerts, queue warnings, and security audit logs.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 text-teal-600 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Auto-refreshing 15s</span>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-teal-600 text-white text-xs font-bold shadow-xs flex items-center gap-2">
            <span>{notifications.length} Active Records</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-medium px-1 flex items-center gap-1.5 shrink-0">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>
        {[
          { id: 'all', label: 'All Alerts' },
          { id: 'warning', label: 'Warnings' },
          { id: 'security', label: 'Security' },
          { id: 'info', label: 'Operational' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
              filterType === tab.id
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {loading && notifications.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-semibold bg-white border border-slate-200/90 rounded-3xl shadow-xs">
            <RefreshCw className="w-6 h-6 text-teal-600 animate-spin mx-auto mb-2" />
            Loading system alerts from database...
          </div>
        ) : error ? (
          <div className="text-center py-8 text-rose-600 font-semibold bg-rose-50 border border-rose-200 rounded-3xl shadow-xs">
            {error}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-medium bg-white border border-slate-200/90 rounded-3xl shadow-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            No system notifications match the selected filter.
          </div>
        ) : (
          filteredNotifications.map((n) => {
            const isWarning = n.type === 'warning';
            const isSecurity = n.type === 'security';

            return (
              <div
                key={n.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs hover:border-teal-200 transition-all flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${
                    isWarning
                      ? 'bg-amber-50 text-amber-600 border border-amber-200/70'
                      : isSecurity
                      ? 'bg-rose-50 text-rose-600 border border-rose-200/70'
                      : 'bg-teal-50 text-teal-600 border border-teal-200/70'
                  }`}>
                    {isWarning ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : isSecurity ? (
                      <ShieldAlert className="w-5 h-5" />
                    ) : (
                      <Info className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="font-bold text-slate-900 text-sm">{n.title}</h4>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        isWarning
                          ? 'bg-amber-100/70 text-amber-800'
                          : isSecurity
                          ? 'bg-rose-100/70 text-rose-800'
                          : 'bg-teal-100/70 text-teal-800'
                      }`}>
                        {n.type || 'info'}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{n.message}</p>
                    <span className="text-[11px] font-semibold text-slate-400 mt-2 block">{n.time}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
