import React, { useState, useEffect } from 'react';
import { Bell, Sparkles, CheckCircle2, Info, Clock } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { useAuth } from '../../context/AuthContext';

export default function PatientNotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.id) return;
      try {
        const data = await notificationService.getAll({ patientId: user.id });
        setNotifications(data);
      } catch (err) {
        setError(err.message || 'Failed to load notifications.');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [user]);

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/90 shadow-xs max-w-4xl mx-auto space-y-6 font-sans">
      <div className="flex items-center gap-3.5 border-b border-slate-100 pb-5">
        <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center shadow-2xs">
          <Bell className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Notification Center</h1>
          <p className="text-xs text-slate-500 mt-0.5">Real-time alerts, queue status updates, and appointment reminders</p>
        </div>
      </div>

      <div className="space-y-3">
        {loading && notifications.length === 0 ? (
          <div className="text-center py-10 text-slate-400 font-medium bg-slate-50/70 border border-slate-200/70 rounded-2xl text-xs">
            Loading notifications...
          </div>
        ) : error ? (
          <div className="text-center py-10 text-rose-600 font-semibold bg-rose-50 border border-rose-200 rounded-2xl text-xs">
            {error}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-10 text-slate-400 font-medium bg-slate-50/70 border border-slate-200/70 rounded-2xl text-xs">
            No active notifications at this time.
          </div>
        ) : (
          notifications.map((notif) => (
            <div key={notif.id} className="p-4 rounded-2xl bg-slate-50/80 hover:bg-teal-50/30 border border-slate-200/70 transition-all flex items-start justify-between gap-3 shadow-2xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{notif.title}</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-4">{notif.message}</p>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold bg-white px-2.5 py-1 rounded-lg border border-slate-200 shrink-0 shadow-2xs">
                {notif.time}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/70 text-center space-y-2">
        <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto border border-teal-200/70 shadow-2xs">
          <Sparkles className="w-4 h-4" />
        </div>
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">SMS & In-App Hospital Alerts</h4>
        <p className="text-[11.5px] text-slate-500 max-w-md mx-auto leading-relaxed">
          Critical queue movements and doctor delays are automatically dispatched to your registered phone number via SMS and in-app notifications.
        </p>
      </div>
    </div>
  );
}
