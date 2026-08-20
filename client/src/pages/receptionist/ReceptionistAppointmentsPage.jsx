import React, { useState } from 'react';
import { Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { appointmentService } from '../../services/appointmentService';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';

export default function ReceptionistAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const fetchAppointments = async () => {
    try {
      const data = await appointmentService.getAll();
      setAppointments(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useAutoRefresh(fetchAppointments, 15000);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await appointmentService.update(id, { status: newStatus });
      setActionMessage(`Appointment status updated to ${newStatus}`);
      setTimeout(() => setActionMessage(''), 3000);
      fetchAppointments();
    } catch (err) {
      setActionMessage(`Error: ${err.message}`);
      setTimeout(() => setActionMessage(''), 3000);
    }
  };

  const todayStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const todaysAppointments = appointments.filter(apt => apt.date === todayStr);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Today's Appointments Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage patient check-ins, arrivals, and appointment status at the front desk</p>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold border border-blue-200">
          {todaysAppointments.length} Total Today
        </span>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
          {actionMessage}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">Time & Token</th>
                <th className="p-4">Patient Details</th>
                <th className="p-4">Assigned Doctor</th>
                <th className="p-4">Booking Type</th>
                <th className="p-4">Current Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {loading && appointments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500 font-semibold">
                    Loading today's appointments...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-red-500 font-semibold">
                    {error}
                  </td>
                </tr>
              ) : todaysAppointments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500 font-semibold">
                    No appointments scheduled for today.
                  </td>
                </tr>
              ) : (
                todaysAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-slate-900 block">{apt.time}</span>
                      <span className="font-extrabold text-blue-700">{apt.token}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-slate-900 block">{apt.patientName}</span>
                      <span className="text-[10px] text-slate-500">{apt.mobile} &bull; {apt.patientId}</span>
                    </td>
                    <td className="p-4 text-slate-700">{apt.doctor}</td>
                    <td className="p-4 text-slate-600">{apt.type}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        apt.status === 'Checked-in'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : apt.status === 'Cancelled'
                          ? 'bg-red-100 text-red-800 border-red-200'
                          : 'bg-amber-100 text-amber-800 border-amber-200'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {apt.status !== 'Checked-in' && apt.status !== 'Cancelled' && (
                        <button
                          onClick={() => handleStatusChange(apt.id, 'Checked-in')}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs cursor-pointer shadow-xs"
                        >
                          Check-in
                        </button>
                      )}
                      {apt.status !== 'Cancelled' && (
                        <button
                          onClick={() => handleStatusChange(apt.id, 'Cancelled')}
                          className="px-3 py-1 bg-white hover:bg-red-50 text-red-600 border border-red-200 font-semibold rounded-lg text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
