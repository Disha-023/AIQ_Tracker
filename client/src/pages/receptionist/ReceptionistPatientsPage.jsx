import React, { useState } from 'react';
import { Search, UserCheck, Phone, Mail, Calendar } from 'lucide-react';
import { patientService } from '../../services/patientService';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';

export default function ReceptionistPatientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.mobile && p.mobile.includes(searchTerm)) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-bold mb-2">
            <UserCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Master Patient Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Patient Search & Records</h1>
          <p className="text-xs text-slate-500 mt-0.5">Search master patient records by Name, Mobile Number, or Patient ID</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Name, Mobile, or ID..."
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all font-medium"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
          <span>Showing {filteredPatients.length} patient record{filteredPatients.length === 1 ? '' : 's'}</span>
          <span className="text-teal-700 font-bold bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">Live Database</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="p-4 pl-6">Patient ID</th>
                <th className="p-4">Full Name</th>
                <th className="p-4">Mobile & Email</th>
                <th className="p-4">Last Visit</th>
                <th className="p-4">Upcoming Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading && patients.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400 font-semibold">
                    Loading patient directory records...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-red-500 font-semibold">
                    {error}
                  </td>
                </tr>
              ) : filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-slate-400">
                    <Search className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No registered patients found</p>
                    <p className="text-xs text-slate-400 mt-0.5">Try searching with a different name or ID</p>
                  </td>
                </tr>
              ) : (
                filteredPatients.map((p) => (
                  <tr key={p.id} className="hover:bg-teal-50/30 transition-colors">
                    <td className="p-4 pl-6 font-mono text-teal-700 font-bold">{p.id}</td>
                    <td className="p-4 text-slate-900 font-bold">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 font-bold flex items-center justify-center text-xs border border-teal-100">
                          {p.name ? p.name[0].toUpperCase() : 'P'}
                        </div>
                        <span>{p.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">
                      <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-teal-600" /> {p.mobile}</div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> {p.email}</div>
                    </td>
                    <td className="p-4 text-slate-700 font-medium">{p.lastVisit || 'First Visit'}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                        {p.upcomingAppointment || 'None Scheduled'}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <button className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold rounded-xl cursor-pointer text-xs transition-colors shadow-2xs">
                        View Profile
                      </button>
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
