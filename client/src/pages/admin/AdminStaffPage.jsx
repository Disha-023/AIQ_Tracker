import React, { useState } from 'react';
import { Users, Search, Plus, Eye, Edit, Power, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { adminMockData } from '../../data/adminMockData';

export default function AdminStaffPage() {
  const [staffList, setStaffList] = useState(adminMockData.staffMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [editStaff, setEditStaff] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  const [newStaffForm, setNewStaffForm] = useState({
    name: '',
    employeeId: `EMP-${Math.floor(900 + Math.random() * 99)}`,
    email: '',
    department: 'OPD Front Desk',
    role: 'Receptionist'
  });

  const filteredStaff = staffList.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStaffStatus = (id) => {
    setStaffList(prev =>
      prev.map(s => {
        if (s.id === id) {
          const newStatus = s.status === 'Active' ? 'Inactive' : 'Active';
          setActionMessage(`Staff account ${s.name} updated to ${newStatus}`);
          setTimeout(() => setActionMessage(''), 3000);
          return { ...s, status: newStatus };
        }
        return s;
      })
    );
  };

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!newStaffForm.name.trim() || !newStaffForm.email.trim()) return;

    const created = {
      id: `REC-00${staffList.length + 1}`,
      name: newStaffForm.name,
      employeeId: newStaffForm.employeeId,
      email: newStaffForm.email,
      department: newStaffForm.department,
      role: newStaffForm.role,
      status: 'Active',
      lastLogin: 'Just registered'
    };

    setStaffList([...staffList, created]);
    setActionMessage(`Authorized staff account created for ${created.name} (${created.role}).`);
    setTimeout(() => setActionMessage(''), 4000);
    setShowAddModal(false);
    setNewStaffForm({
      name: '',
      employeeId: `EMP-${Math.floor(900 + Math.random() * 99)}`,
      email: '',
      department: 'OPD Front Desk',
      role: 'Receptionist'
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editStaff) return;

    setStaffList(prev =>
      prev.map(s => s.id === editStaff.id ? editStaff : s)
    );
    setActionMessage(`Staff account ${editStaff.name} updated successfully.`);
    setTimeout(() => setActionMessage(''), 3000);
    setEditStaff(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hospital Staff & Receptionist Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">Provision authorized hospital staff credentials and manage desk access permissions.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="self-start sm:self-center px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-2 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Authorized Staff Account
        </button>
      </div>

      {/* Action Banner Message */}
      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search staff name, ID, or email..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white"
          />
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 text-xs font-bold text-slate-900">
          Authorized Staff Roster ({filteredStaff.length})
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Employee ID</th>
                <th className="p-4">Official Email</th>
                <th className="p-4">Department</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Login</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                      {staff.name.charAt(0)}
                    </div>
                    {staff.name}
                  </td>
                  <td className="p-4 font-mono text-purple-700 font-bold">{staff.employeeId}</td>
                  <td className="p-4 text-slate-700">{staff.email}</td>
                  <td className="p-4 text-slate-700">{staff.department}</td>
                  <td className="p-4 font-semibold text-slate-900">{staff.role}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      staff.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : 'bg-red-100 text-red-800 border-red-200'
                    }`}>
                      {staff.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500">{staff.lastLogin}</td>
                  <td className="p-4 text-right space-x-1.5">
                    <button
                      onClick={() => setSelectedStaff(staff)}
                      className="p-1.5 text-slate-600 hover:text-purple-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditStaff(staff)}
                      className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Edit Staff Account"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleStaffStatus(staff.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        staff.status === 'Active'
                          ? 'text-red-600 hover:bg-red-50'
                          : 'text-emerald-600 hover:bg-emerald-50'
                      }`}
                      title={staff.status === 'Active' ? 'Deactivate Account' : 'Activate Account'}
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

      {/* ADD STAFF MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-600" />
                Add Authorized Staff Account
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newStaffForm.name}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, name: e.target.value })}
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Official Email *</label>
                <input
                  type="email"
                  required
                  value={newStaffForm.email}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, email: e.target.value })}
                  placeholder="ramesh@aiqtracker.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Department</label>
                  <input
                    type="text"
                    value={newStaffForm.department}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Staff Role</label>
                  <select
                    value={newStaffForm.role}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, role: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="Receptionist">Receptionist</option>
                    <option value="Front Desk Nurse">Front Desk Nurse</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl"
                >
                  Create Staff Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW STAFF MODAL */}
      {selectedStaff && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Staff Account Details</h3>
              <button onClick={() => setSelectedStaff(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between"><span className="text-slate-500">Name:</span><span className="font-bold text-slate-900">{selectedStaff.name}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Employee ID:</span><span className="font-bold text-purple-700">{selectedStaff.employeeId}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Official Email:</span><span className="font-bold text-slate-900">{selectedStaff.email}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Department:</span><span className="font-bold text-slate-900">{selectedStaff.department}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Role:</span><span className="font-bold text-indigo-700">{selectedStaff.role}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Status:</span><span className="font-bold text-emerald-600">{selectedStaff.status}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Last Login:</span><span className="font-bold text-slate-700">{selectedStaff.lastLogin}</span></div>
            </div>

            <div className="pt-3 border-t border-slate-200">
              <button
                onClick={() => setSelectedStaff(null)}
                className="w-full py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT STAFF MODAL */}
      {editStaff && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Edit Staff Account</h3>
              <button onClick={() => setEditStaff(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editStaff.name}
                  onChange={(e) => setEditStaff({ ...editStaff, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  value={editStaff.email}
                  onChange={(e) => setEditStaff({ ...editStaff, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Department</label>
                <input
                  type="text"
                  required
                  value={editStaff.department}
                  onChange={(e) => setEditStaff({ ...editStaff, department: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setEditStaff(null)}
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
