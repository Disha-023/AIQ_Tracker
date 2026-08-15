import React from 'react';
import { Calendar } from 'lucide-react';
import { receptionistMockData } from '../../data/receptionistMockData';

export default function AdminAppointmentsPage() {
  const { todayAppointments } = receptionistMockData;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hospital Appointment Overview</h1>
          <p className="text-xs text-slate-500 mt-0.5">Administrative monitor for all scheduled and walk-in OPD appointments</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">Time & Token</th>
                <th className="p-4">Patient Name</th>
                <th className="p-4">Doctor</th>
                <th className="p-4">Booking Type</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {todayAppointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-slate-900 block">{apt.time}</span>
                    <span className="font-extrabold text-purple-700">{apt.token}</span>
                  </td>
                  <td className="p-4 font-bold text-slate-900">{apt.patientName}</td>
                  <td className="p-4 text-slate-700">{apt.doctor}</td>
                  <td className="p-4 text-slate-600">{apt.type}</td>
                  <td className="p-4 font-bold text-amber-700">{apt.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
