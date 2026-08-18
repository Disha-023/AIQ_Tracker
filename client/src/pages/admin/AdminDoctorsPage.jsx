import React, { useState } from 'react';
import { Stethoscope, Search, Plus, Eye, Edit, Power, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { adminMockData } from '../../data/adminMockData';

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState(adminMockData.doctors);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [editDoctor, setEditDoctor] = useState(null);
  const [actionMessage, setActionMessage] = useState('');

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.room.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === 'All' || doc.department === filterDept;
    return matchesSearch && matchesDept;
  });

  const toggleDoctorStatus = (docId) => {
    setDoctors(prev =>
      prev.map(d => {
        if (d.id === docId) {
          const newStatus = d.status === 'Active' ? 'Inactive' : 'Active';
          const newAvail = newStatus === 'Inactive' ? 'Unavailable' : 'Available';
          setActionMessage(`Doctor ${d.name} status updated to ${newStatus}`);
          setTimeout(() => setActionMessage(''), 3000);
          return { ...d, status: newStatus, availability: newAvail };
        }
        return d;
      })
    );
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editDoctor) return;

    setDoctors(prev =>
      prev.map(d => d.id === editDoctor.id ? editDoctor : d)
    );
    setActionMessage(`Doctor ${editDoctor.name} profile updated successfully.`);
    setTimeout(() => setActionMessage(''), 3000);
    setEditDoctor(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Doctor Roster & OPD Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage OPD doctor assignments, consultation rooms, availability, and active rosters.</p>
        </div>
        <span className="self-start sm:self-center px-3.5 py-1.5 rounded-full bg-purple-50 text-purple-800 text-xs font-bold border border-purple-200 flex items-center gap-1.5">
          <Stethoscope className="w-4 h-4 text-purple-600" />
          Total Doctors: {doctors.length}
        </span>
      </div>

      {/* Action Banner Message */}
      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search doctor name, room..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-600 font-semibold text-slate-700"
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
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 text-xs font-bold text-slate-900">
          Doctor Registry & OPD Assignments ({filteredDoctors.length})
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">Doctor Name</th>
                <th className="p-4">Specialization</th>
                <th className="p-4">Department</th>
                <th className="p-4">OPD Room</th>
                <th className="p-4">Experience</th>
                <th className="p-4">Availability</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {filteredDoctors.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center">
                      {doc.name.charAt(4) || 'D'}
                    </div>
                    {doc.name}
                  </td>
                  <td className="p-4 text-slate-700">{doc.specialization}</td>
                  <td className="p-4 text-slate-700">{doc.department}</td>
                  <td className="p-4 font-semibold text-purple-700">{doc.room}</td>
                  <td className="p-4 text-slate-600">{doc.experience}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      doc.availability === 'Available'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : doc.availability === 'On Break'
                        ? 'bg-amber-100 text-amber-800 border-amber-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {doc.availability}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      doc.status === 'Active'
                        ? 'bg-blue-100 text-blue-800 border-blue-200'
                        : 'bg-red-100 text-red-800 border-red-200'
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-1.5">
                    <button
                      onClick={() => setSelectedDoctor(doc)}
                      className="p-1.5 text-slate-600 hover:text-purple-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditDoctor(doc)}
                      className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Edit Doctor"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleDoctorStatus(doc.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        doc.status === 'Active'
                          ? 'text-red-600 hover:bg-red-50'
                          : 'text-emerald-600 hover:bg-emerald-50'
                      }`}
                      title={doc.status === 'Active' ? 'Deactivate Doctor' : 'Activate Doctor'}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW DOCTOR MODAL */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-purple-600" />
                Doctor Details
              </h3>
              <button onClick={() => setSelectedDoctor(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between"><span className="text-slate-500">Doctor Name:</span><span className="font-bold text-slate-900">{selectedDoctor.name}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Specialization:</span><span className="font-bold text-slate-900">{selectedDoctor.specialization}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Department:</span><span className="font-bold text-slate-900">{selectedDoctor.department}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Assigned OPD Room:</span><span className="font-bold text-purple-700">{selectedDoctor.room}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Experience:</span><span className="font-bold text-slate-900">{selectedDoctor.experience}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Availability:</span><span className="font-bold text-emerald-600">{selectedDoctor.availability}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Status:</span><span className="font-bold text-blue-600">{selectedDoctor.status}</span></div>
            </div>

            <div className="pt-3 border-t border-slate-200">
              <button
                onClick={() => setSelectedDoctor(null)}
                className="w-full py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT DOCTOR MODAL */}
      {editDoctor && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Edit Doctor Information</h3>
              <button onClick={() => setEditDoctor(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Doctor Name</label>
                <input
                  type="text"
                  required
                  value={editDoctor.name}
                  onChange={(e) => setEditDoctor({ ...editDoctor, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Specialization</label>
                <input
                  type="text"
                  required
                  value={editDoctor.specialization}
                  onChange={(e) => setEditDoctor({ ...editDoctor, specialization: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">OPD Room</label>
                <input
                  type="text"
                  required
                  value={editDoctor.room}
                  onChange={(e) => setEditDoctor({ ...editDoctor, room: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Availability</label>
                <select
                  value={editDoctor.availability}
                  onChange={(e) => setEditDoctor({ ...editDoctor, availability: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  <option value="Available">Available</option>
                  <option value="On Break">On Break</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setEditDoctor(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl"
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
