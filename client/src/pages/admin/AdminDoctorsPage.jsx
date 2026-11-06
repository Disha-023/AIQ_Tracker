import React, { useState } from 'react';
import { Stethoscope, Search, Plus, Eye, Edit, Power, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { doctorService } from '../../services/doctorService';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [editDoctor, setEditDoctor] = useState(null);
  const [actionMessage, setActionMessage] = useState('');

  const fetchDoctors = async () => {
    try {
      const data = await doctorService.getAll();
      setDoctors(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load doctors list.');
    } finally {
      setLoading(false);
    }
  };

  useAutoRefresh(fetchDoctors, 15000);

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (doc.room && doc.room.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDept = filterDept === 'All' || doc.department_name === filterDept || doc.department === filterDept;
    return matchesSearch && matchesDept;
  });

  const toggleDoctorStatus = async (docId) => {
    try {
      const doctor = doctors.find(d => d.id === docId);
      if (!doctor) return;
      const newStatus = doctor.status === 'Active' ? 'Inactive' : 'Active';
      await doctorService.update(docId, { status: newStatus });
      setActionMessage(`Doctor ${doctor.name} status updated to ${newStatus}`);
      setTimeout(() => setActionMessage(''), 3000);
      fetchDoctors();
    } catch (err) {
      setActionMessage(`Error: ${err.message}`);
      setTimeout(() => setActionMessage(''), 3000);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editDoctor) return;

    try {
      const mappedStatus = editDoctor.availability === 'Unavailable' ? 'Inactive' : 'Active';
      await doctorService.update(editDoctor.id, {
        name: editDoctor.name,
        specialization: editDoctor.specialization,
        status: mappedStatus
      });
      setActionMessage(`Doctor ${editDoctor.name} profile updated successfully.`);
      setTimeout(() => setActionMessage(''), 3000);
      setEditDoctor(null);
      fetchDoctors();
    } catch (err) {
      setActionMessage(`Error: ${err.message}`);
      setTimeout(() => setActionMessage(''), 3000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-bold mb-2">
            <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
            <span>Physician Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Doctor Roster & OPD Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage OPD doctor assignments, consultation rooms, availability, and active rosters.</p>
        </div>
        <span className="self-start sm:self-center px-4 py-2 rounded-2xl bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200 flex items-center gap-1.5">
          <Stethoscope className="w-4 h-4 text-teal-600" />
          Total Doctors: {doctors.length}
        </span>
      </div>

      {/* Action Banner Message */}
      {actionMessage && (
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search doctor name, room..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white font-medium transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold text-slate-700 transition-all"
          >
            <option value="All">All Departments</option>
            <option value="General Medicine">General Medicine</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Dermatology">Dermatology</option>
          </select>
        </div>
      </div>

      {/* Doctors Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900">
          <span className="text-sm font-bold text-slate-900">Doctor Registry & OPD Assignments</span>
          <span className="text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100 font-bold">
            Showing {filteredDoctors.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="p-4 pl-6">Doctor Name</th>
                <th className="p-4">Specialization</th>
                <th className="p-4">Department</th>
                <th className="p-4">OPD Room</th>
                <th className="p-4">Experience</th>
                <th className="p-4">Availability</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading && doctors.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400 font-semibold">
                    Loading doctors roster...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-red-500 font-semibold">
                    {error}
                  </td>
                </tr>
              ) : filteredDoctors.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-10 text-center text-slate-400">
                    <Stethoscope className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No matching doctors found in roster</p>
                  </td>
                </tr>
              ) : (
                filteredDoctors.map((doc) => (
                  <tr key={doc.id} className="hover:bg-teal-50/30 transition-colors">
                    <td className="p-4 pl-6 font-bold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 font-bold text-xs flex items-center justify-center border border-teal-100">
                          {doc.name.charAt(4) || 'D'}
                        </div>
                        <span>{doc.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-700">{doc.specialization}</td>
                    <td className="p-4 text-slate-700">{doc.department}</td>
                    <td className="p-4 font-semibold text-teal-700">{doc.room}</td>
                    <td className="p-4 text-slate-500">{doc.experience}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        doc.availability === 'Available'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : doc.availability === 'On Break'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {doc.availability}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        doc.status === 'Active'
                          ? 'bg-teal-50 text-teal-800 border-teal-200'
                          : 'bg-red-50 text-red-800 border-red-200'
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-1.5">
                      <button
                        onClick={() => setSelectedDoctor(doc)}
                        className="p-2 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditDoctor(doc)}
                        className="p-2 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-colors cursor-pointer"
                        title="Edit Doctor"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleDoctorStatus(doc.id)}
                        className={`p-2 rounded-xl transition-colors cursor-pointer ${
                          doc.status === 'Active'
                            ? 'text-red-500 hover:bg-red-50'
                            : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={doc.status === 'Active' ? 'Deactivate Doctor' : 'Activate Doctor'}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW DOCTOR MODAL */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-4 border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3.5">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-teal-600" />
                Doctor Details
              </h3>
              <button onClick={() => setSelectedDoctor(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-2.5 text-xs bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
              <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500">Doctor Name:</span><span className="font-bold text-slate-900">{selectedDoctor.name}</span></div>
              <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500">Specialization:</span><span className="font-bold text-slate-900">{selectedDoctor.specialization}</span></div>
              <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500">Department:</span><span className="font-bold text-slate-900">{selectedDoctor.department}</span></div>
              <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500">Assigned OPD Room:</span><span className="font-bold text-teal-700">{selectedDoctor.room}</span></div>
              <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500">Experience:</span><span className="font-bold text-slate-900">{selectedDoctor.experience}</span></div>
              <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500">Availability:</span><span className="font-bold text-emerald-600">{selectedDoctor.availability}</span></div>
              <div className="flex justify-between py-1"><span className="text-slate-500">Status:</span><span className="font-bold text-teal-700">{selectedDoctor.status}</span></div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedDoctor(null)}
                className="w-full py-3 bg-slate-900 text-white font-bold text-xs rounded-2xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT DOCTOR MODAL */}
      {editDoctor && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-4 border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3.5">
              <h3 className="font-bold text-slate-900 text-base">Edit Doctor Information</h3>
              <button onClick={() => setEditDoctor(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5 uppercase tracking-wider text-[11px]">Doctor Name</label>
                <input
                  type="text"
                  required
                  value={editDoctor.name}
                  onChange={(e) => setEditDoctor({ ...editDoctor, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5 uppercase tracking-wider text-[11px]">Specialization</label>
                <input
                  type="text"
                  required
                  value={editDoctor.specialization}
                  onChange={(e) => setEditDoctor({ ...editDoctor, specialization: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5 uppercase tracking-wider text-[11px]">OPD Room</label>
                <input
                  type="text"
                  required
                  value={editDoctor.room}
                  onChange={(e) => setEditDoctor({ ...editDoctor, room: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5 uppercase tracking-wider text-[11px]">Availability</label>
                <select
                  value={editDoctor.availability}
                  onChange={(e) => setEditDoctor({ ...editDoctor, availability: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold text-slate-800"
                >
                  <option value="Available">Available</option>
                  <option value="On Break">On Break</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-2.5 justify-end">
                <button
                  type="button"
                  onClick={() => setEditDoctor(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl shadow-md transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
