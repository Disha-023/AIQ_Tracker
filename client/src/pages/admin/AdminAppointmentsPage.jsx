import React, { useState } from 'react';
import { Calendar, Search, Filter, Eye, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import { adminMockData } from '../../data/adminMockData';

export default function AdminAppointmentsPage() {
  const [appointments] = useState(adminMockData.appointments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          apt.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          apt.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hospital Appointment Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">Centralized oversight of all patient appointments across departments.</p>
        </div>
        <span className="self-start sm:self-center px-3.5 py-1.5 rounded-full bg-purple-50 text-purple-800 text-xs font-bold border border-purple-200 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-purple-600" />
          Total Appointments: {appointments.length}
        </span>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 text-xs font-semibold">
          {['All', 'Today', 'Upcoming', 'Completed', 'Cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab === 'Today' ? 'In Progress' : tab)}
              className={`px-3.5 py-2 rounded-xl transition-colors cursor-pointer shrink-0 ${
                (statusFilter === tab || (tab === 'Today' && statusFilter === 'In Progress'))
                  ? 'bg-purple-600 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Patient, Doctor, APT ID..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white"
          />
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 text-xs font-bold text-slate-900">
          Hospital Appointment Records ({filteredAppointments.length})
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">APT ID</th>
                <th className="p-4">Patient Name</th>
                <th className="p-4">Assigned Doctor</th>
                <th className="p-4">Department</th>
                <th className="p-4">Date</th>
                <th className="p-4">Time Slot</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {filteredAppointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-mono font-bold text-purple-700">{apt.id}</td>
                  <td className="p-4 font-bold text-slate-900">{apt.patient}</td>
                  <td className="p-4 text-slate-700">{apt.doctor}</td>
                  <td className="p-4 text-slate-700">{apt.department}</td>
                  <td className="p-4 text-slate-600">{apt.date}</td>
                  <td className="p-4 font-semibold text-slate-800">{apt.time}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      apt.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : apt.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800 border-blue-200'
                        : apt.status === 'Waiting'
                        ? 'bg-amber-100 text-amber-800 border-amber-200'
                        : apt.status === 'Cancelled'
                        ? 'bg-red-100 text-red-800 border-red-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {apt.status}
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
