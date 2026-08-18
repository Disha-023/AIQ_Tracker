import React, { useState } from 'react';
import { UserCheck, Search, Eye, Filter, X } from 'lucide-react';
import { adminMockData } from '../../data/adminMockData';

export default function AdminPatientsPage() {
  const [patients] = useState(adminMockData.patients);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedPatient, setSelectedPatient] = useState(null);

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.mobile.includes(searchTerm) ||
                          p.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hospital Patient Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">Master patient registry records, consultation status, and contact information.</p>
        </div>
        <span className="self-start sm:self-center px-3.5 py-1.5 rounded-full bg-purple-50 text-purple-800 text-xs font-bold border border-purple-200 flex items-center gap-1.5">
          <UserCheck className="w-4 h-4 text-purple-600" />
          Total Patients: {patients.length}
        </span>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search patient name, ID, phone..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500 hidden sm:block" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-600 font-semibold text-slate-700"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="In OPD Queue">In OPD Queue</option>
            <option value="Confirmed">Confirmed</option>
          </select>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 text-xs font-bold text-slate-900">
          Registered Patient Records ({filteredPatients.length})
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">Patient ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Age</th>
                <th className="p-4">Gender</th>
                <th className="p-4">Mobile</th>
                <th className="p-4">Email</th>
                <th className="p-4">Last Visit</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-mono font-bold text-purple-700">{patient.id}</td>
                  <td className="p-4 font-bold text-slate-900">{patient.name}</td>
                  <td className="p-4 text-slate-700">{patient.age} yrs</td>
                  <td className="p-4 text-slate-700">{patient.gender}</td>
                  <td className="p-4 text-slate-700">{patient.mobile}</td>
                  <td className="p-4 text-slate-700">{patient.email}</td>
                  <td className="p-4 text-slate-600">{patient.lastVisit}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      patient.status === 'In OPD Queue'
                        ? 'bg-amber-100 text-amber-800 border-amber-200'
                        : patient.status === 'Confirmed'
                        ? 'bg-blue-100 text-blue-800 border-blue-200'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    }`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedPatient(patient)}
                      className="p-1.5 text-slate-600 hover:text-purple-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="View Patient Record"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW PATIENT MODAL */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-purple-600" />
                Patient Profile Record
              </h3>
              <button onClick={() => setSelectedPatient(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between"><span className="text-slate-500">Patient ID:</span><span className="font-bold text-purple-700">{selectedPatient.id}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Full Name:</span><span className="font-bold text-slate-900">{selectedPatient.name}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Age / Gender:</span><span className="font-bold text-slate-900">{selectedPatient.age} yrs / {selectedPatient.gender}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Mobile Number:</span><span className="font-bold text-slate-900">{selectedPatient.mobile}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Email Address:</span><span className="font-bold text-slate-900">{selectedPatient.email}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Last Hospital Visit:</span><span className="font-bold text-slate-700">{selectedPatient.lastVisit}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Current Status:</span><span className="font-bold text-emerald-600">{selectedPatient.status}</span></div>
            </div>

            <div className="pt-3 border-t border-slate-200">
              <button
                onClick={() => setSelectedPatient(null)}
                className="w-full py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
