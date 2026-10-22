import React, { useState } from 'react';
import { UserCheck, Search, Eye, Filter, X } from 'lucide-react';
import { patientService } from '../../services/patientService';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';

export default function AdminPatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedPatient, setSelectedPatient] = useState(null);

  const fetchPatients = async () => {
    try {
      const data = await patientService.getAll();
      setPatients(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load patients directory.');
    } finally {
      setLoading(false);
    }
  };

  useAutoRefresh(fetchPatients, 15000);

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.mobile && p.mobile.includes(searchTerm)) ||
                          (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-bold mb-2">
            <UserCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Master Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Hospital Patient Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">Master patient registry records, consultation status, and contact information.</p>
        </div>
        <span className="self-start sm:self-center px-4 py-2 rounded-2xl bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200 flex items-center gap-1.5">
          <UserCheck className="w-4 h-4 text-teal-600" />
          Total Patients: {patients.length}
        </span>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search patient name, ID, phone..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white font-medium transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold text-slate-700 transition-all"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="In OPD Queue">In OPD Queue</option>
            <option value="Confirmed">Confirmed</option>
          </select>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900">
          <span className="text-sm font-bold text-slate-900">Registered Patient Records</span>
          <span className="text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100 font-bold">
            Showing {filteredPatients.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="p-4 pl-6">Patient ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Age</th>
                <th className="p-4">Gender</th>
                <th className="p-4">Mobile</th>
                <th className="p-4">Email</th>
                <th className="p-4">Last Visit</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading && patients.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-slate-400 font-semibold">
                    Loading patient directory records...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-red-500 font-semibold">
                    {error}
                  </td>
                </tr>
              ) : filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-10 text-center text-slate-400">
                    <UserCheck className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No registered patients found</p>
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-teal-50/30 transition-colors">
                    <td className="p-4 pl-6 font-mono font-bold text-teal-700">{patient.id}</td>
                    <td className="p-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 font-bold text-xs flex items-center justify-center border border-teal-100">
                          {patient.name.charAt(0)}
                        </div>
                        <span>{patient.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">{patient.age} yrs</td>
                    <td className="p-4 text-slate-600">{patient.gender}</td>
                    <td className="p-4 text-slate-700 font-medium">{patient.mobile}</td>
                    <td className="p-4 text-slate-500">{patient.email}</td>
                    <td className="p-4 text-slate-500">{patient.lastVisit || 'First Visit'}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        patient.status === 'In OPD Queue'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : patient.status === 'Confirmed'
                          ? 'bg-teal-50 text-teal-800 border-teal-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => setSelectedPatient(patient)}
                        className="p-2 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-colors cursor-pointer"
                        title="View Patient Record"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW PATIENT MODAL */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-4 border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3.5">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-teal-600" />
                Patient Profile Record
              </h3>
              <button onClick={() => setSelectedPatient(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-2.5 text-xs bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
              <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500">Patient ID:</span><span className="font-bold text-teal-700 font-mono">{selectedPatient.id}</span></div>
              <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500">Full Name:</span><span className="font-bold text-slate-900">{selectedPatient.name}</span></div>
              <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500">Age / Gender:</span><span className="font-bold text-slate-900">{selectedPatient.age} yrs / {selectedPatient.gender}</span></div>
              <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500">Mobile Number:</span><span className="font-bold text-slate-900">{selectedPatient.mobile}</span></div>
              <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500">Email Address:</span><span className="font-bold text-slate-900">{selectedPatient.email}</span></div>
              <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500">Last Hospital Visit:</span><span className="font-bold text-slate-700">{selectedPatient.lastVisit || 'First Visit'}</span></div>
              <div className="flex justify-between py-1"><span className="text-slate-500">Current Status:</span><span className="font-bold text-emerald-600">{selectedPatient.status}</span></div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedPatient(null)}
                className="w-full py-3 bg-slate-900 text-white font-bold text-xs rounded-2xl hover:bg-slate-800 transition-colors cursor-pointer"
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
