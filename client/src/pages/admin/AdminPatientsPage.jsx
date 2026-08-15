import React from 'react';
import { UserCheck } from 'lucide-react';
import { receptionistMockData } from '../../data/receptionistMockData';

export default function AdminPatientsPage() {
  const { patients } = receptionistMockData;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs justify-between items-center flex">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hospital Patient Master Records</h1>
          <p className="text-xs text-slate-500 mt-0.5">Administrative view of all registered hospital patients and consultation history</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">Patient ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Mobile</th>
                <th className="p-4">Email</th>
                <th className="p-4">Last Visit</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {patients.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-mono font-bold text-purple-700">{p.id}</td>
                  <td className="p-4 font-bold text-slate-900">{p.name}</td>
                  <td className="p-4 text-slate-700">{p.mobile}</td>
                  <td className="p-4 text-slate-600">{p.email}</td>
                  <td className="p-4 text-slate-600">{p.lastVisit}</td>
                  <td className="p-4 font-bold text-emerald-700">{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
