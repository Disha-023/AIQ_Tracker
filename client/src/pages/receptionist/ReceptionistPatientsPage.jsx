import React, { useState } from 'react';
import { Search, UserCheck, Phone, Mail, Calendar } from 'lucide-react';
import { receptionistMockData } from '../../data/receptionistMockData';

export default function ReceptionistPatientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { patients } = receptionistMockData;

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.mobile.includes(searchTerm) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patient Search & Records</h1>
          <p className="text-xs text-slate-500 mt-0.5">Search master patient records by Name, Mobile Number, or Patient ID</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Name, Mobile, or ID..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 text-xs text-slate-500 font-semibold">
          Showing {filteredPatients.length} patient record{filteredPatients.length === 1 ? '' : 's'}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">Patient ID</th>
                <th className="p-4">Full Name</th>
                <th className="p-4">Mobile & Email</th>
                <th className="p-4">Last Visit</th>
                <th className="p-4">Upcoming Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {filteredPatients.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-mono text-blue-700 font-bold">{p.id}</td>
                  <td className="p-4 text-slate-900 font-bold">{p.name}</td>
                  <td className="p-4 text-slate-600">
                    <div className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> {p.mobile}</div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400"><Mail className="w-3 h-3 text-slate-400" /> {p.email}</div>
                  </td>
                  <td className="p-4 text-slate-700">{p.lastVisit}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                      {p.upcomingAppointment}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold rounded-lg cursor-pointer">
                      View Profile
                    </button>
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
