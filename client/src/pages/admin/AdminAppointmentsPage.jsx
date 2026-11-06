import React, { useState } from 'react';
import { Calendar, Search, Filter, Eye, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import { appointmentService } from '../../services/appointmentService';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchAppointments = async () => {
    try {
      const data = await appointmentService.getAll();
      setAppointments(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load appointments list.');
    } finally {
      setLoading(false);
    }
  };

  useAutoRefresh(fetchAppointments, 15000);

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = (apt.patient && apt.patient.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (apt.doctor && apt.doctor.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (apt.id && apt.id.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Status filter mapping
    if (statusFilter === 'All') return matchesSearch;
    const matchesStatus = apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-bold mb-2">
            <Calendar className="w-3.5 h-3.5 text-teal-600" />
            <span>Master Scheduling</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Hospital Appointment Oversight</h1>
          <p className="text-xs text-slate-500 mt-0.5">Centralized oversight of all patient appointments across departments.</p>
        </div>
        <span className="self-start sm:self-center px-4 py-2 rounded-2xl bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-teal-600" />
          Total Appointments: {appointments.length}
        </span>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 text-xs font-semibold">
          {['All', 'Today', 'Upcoming', 'Completed', 'Cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab === 'Today' ? 'In Progress' : tab)}
              className={`px-4 py-2.5 rounded-2xl transition-all cursor-pointer shrink-0 font-bold ${
                (statusFilter === tab || (tab === 'Today' && statusFilter === 'In Progress'))
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Patient, Doctor, APT ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white font-medium transition-all"
          />
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900">
          <span className="text-sm font-bold text-slate-900">Hospital Appointment Records</span>
          <span className="text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100 font-bold">
            Showing {filteredAppointments.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="p-4 pl-6">APT ID</th>
                <th className="p-4">Patient Name</th>
                <th className="p-4">Assigned Doctor</th>
                <th className="p-4">Department</th>
                <th className="p-4">Date</th>
                <th className="p-4">Time Slot</th>
                <th className="p-4 pr-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading && appointments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400 font-semibold">
                    Loading appointments list...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-red-500 font-semibold">
                    {error}
                  </td>
                </tr>
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-10 text-center text-slate-400">
                    <Calendar className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No matching appointments found</p>
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-teal-50/30 transition-colors">
                    <td className="p-4 pl-6 font-mono font-bold text-teal-700">{apt.id}</td>
                    <td className="p-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 font-bold text-xs flex items-center justify-center border border-teal-100">
                          {apt.patient ? apt.patient.charAt(0) : 'P'}
                        </div>
                        <span>{apt.patient}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-700 font-medium">{apt.doctor}</td>
                    <td className="p-4 text-slate-700">{apt.department}</td>
                    <td className="p-4 text-slate-500">{apt.date}</td>
                    <td className="p-4 font-bold text-slate-800">{apt.time}</td>
                    <td className="p-4 pr-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        apt.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : apt.status === 'In Progress'
                          ? 'bg-teal-50 text-teal-800 border-teal-200'
                          : apt.status === 'Waiting'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : apt.status === 'Cancelled'
                          ? 'bg-red-50 text-red-800 border-red-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {apt.status}
                      </span>
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
