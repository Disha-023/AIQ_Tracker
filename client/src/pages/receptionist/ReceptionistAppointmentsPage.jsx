import React, { useState } from 'react';
import { Calendar, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import { appointmentService } from '../../services/appointmentService';
import { queueService } from '../../services/queueService';
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

  const handleCheckIn = async (apt) => {
    setError('');
    setActionMessage('');
    try {
      const entry = await queueService.join({
        patientId: apt.patientId,
        doctorId: apt.doctorId,
        appointmentId: apt.id,
        type: 'appointment'
      });
      setActionMessage(`Patient ${apt.patientName} checked in successfully. Active Token ${entry.token} issued in live queue.`);
      setTimeout(() => setActionMessage(''), 4000);
      fetchAppointments();
    } catch (err) {
      setError(err.message || 'Failed to check in appointment into live queue.');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleCancel = async (apt) => {
    setError('');
    setActionMessage('');
    try {
      await appointmentService.update(apt.id, { status: 'Cancelled' });
      // If there is an active waiting queue entry for this appointment, cancel it as well
      const activeQueues = await queueService.getAll();
      const linkedEntry = activeQueues.find(
        (q) => q.appointment_id === apt.id && (q.status === 'WAITING' || q.status === 'Waiting')
      );
      if (linkedEntry) {
        await queueService.update(linkedEntry.id, { status: 'CANCELLED' });
      }
      setActionMessage(`Appointment for ${apt.patientName} was marked Cancelled.`);
      setTimeout(() => setActionMessage(''), 3000);
      fetchAppointments();
    } catch (err) {
      setError(err.message || 'Failed to cancel appointment.');
      setTimeout(() => setError(''), 5000);
    }
  };

  const todayStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const todaysAppointments = appointments.filter(apt => apt.date === todayStr);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-bold mb-2">
            <Calendar className="w-3.5 h-3.5 text-teal-600" />
            <span>OPD Scheduling</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Today's Appointments Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage patient check-ins, arrivals, and appointment status at the front desk</p>
        </div>
        <span className="self-start sm:self-center px-4 py-2 bg-teal-50 text-teal-800 rounded-2xl text-xs font-bold border border-teal-200">
          {todaysAppointments.length} Total Scheduled Today
        </span>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {actionMessage && (
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="p-4 pl-6">Time & Token</th>
                <th className="p-4">Patient Details</th>
                <th className="p-4">Assigned Doctor</th>
                <th className="p-4">Booking Type</th>
                <th className="p-4">Current Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading && appointments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400 font-semibold">
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
                  <td colSpan="6" className="p-10 text-center text-slate-400">
                    <Calendar className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No appointments scheduled for today</p>
                    <p className="text-xs text-slate-400 mt-0.5">Scheduled appointments will appear here automatically</p>
                  </td>
                </tr>
              ) : (
                todaysAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-teal-50/30 transition-colors">
                    <td className="p-4 pl-6">
                      <span className="font-bold text-slate-900 block">{apt.time}</span>
                      <span className="font-extrabold text-teal-700">{apt.token}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 font-bold flex items-center justify-center text-xs border border-teal-100">
                          {apt.patientName ? apt.patientName[0].toUpperCase() : 'P'}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{apt.patientName}</span>
                          <span className="text-[10px] text-slate-400">{apt.mobile} &bull; {apt.patientId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-700 font-medium">{apt.doctor}</td>
                    <td className="p-4 text-slate-600 font-medium">
                      <span className="capitalize px-2 py-0.5 bg-slate-100 rounded text-[11px] text-slate-600 font-semibold">
                        {apt.type || 'Appointment'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        apt.status === 'Checked-in'
                          ? 'bg-teal-50 text-teal-800 border-teal-200'
                          : apt.status === 'Cancelled'
                          ? 'bg-red-50 text-red-800 border-red-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      {apt.status !== 'Checked-in' && apt.status !== 'Cancelled' && (
                        <button
                          onClick={() => handleCheckIn(apt)}
                          className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs cursor-pointer shadow-xs transition-colors"
                        >
                          Check-in
                        </button>
                      )}
                      {apt.status !== 'Cancelled' && (
                        <button
                          onClick={() => handleCancel(apt)}
                          className="px-3.5 py-1.5 bg-white hover:bg-red-50 text-red-600 border border-red-200 font-semibold rounded-xl text-xs cursor-pointer transition-colors"
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
