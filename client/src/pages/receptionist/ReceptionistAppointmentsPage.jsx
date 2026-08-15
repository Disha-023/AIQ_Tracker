import React, { useState } from 'react';
import { Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { receptionistMockData } from '../../data/receptionistMockData';

export default function ReceptionistAppointmentsPage() {
  const [appointments, setAppointments] = useState(receptionistMockData.todayAppointments);

  const handleStatusChange = (id, newStatus) => {
    setAppointments(prev =>
      prev.map(apt => (apt.id === id ? { ...apt, status: newStatus } : apt))
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Today's Appointments Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage patient check-ins, arrivals, and appointment status at the front desk</p>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold border border-blue-200">
          {appointments.length} Total Today
        </span>
      </div>

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
              {appointments.map((apt) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
