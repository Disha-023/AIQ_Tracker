import React from 'react';
import { Stethoscope } from 'lucide-react';
import { adminMockData } from '../../data/adminMockData';

export default function AdminDoctorsPage() {
  const { doctors } = adminMockData;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">OPD Doctor Roster Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage doctor availability, OPD room allocations, and daily consultation schedules</p>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold border border-blue-200">
          {doctors.length} Doctors Active
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">Doctor ID</th>
                <th className="p-4">Doctor Name</th>
                <th className="p-4">Specialization</th>
                <th className="p-4">Assigned Room</th>
                <th className="p-4">Patients Served Today</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {doctors.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-mono font-bold text-purple-700">{d.id}</td>
                  <td className="p-4 font-bold text-slate-900">{d.name}</td>
                  <td className="p-4 text-slate-700">{d.specialization}</td>
                  <td className="p-4 text-slate-600">{d.room}</td>
                  <td className="p-4 font-bold text-blue-700">{d.patientsToday} Patients</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      d.status.includes('Active')
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border-amber-200'
                    }`}>
                      {d.status}
                    </span>
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
