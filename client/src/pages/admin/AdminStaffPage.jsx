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
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-bold mb-2">
            <Users className="w-3.5 h-3.5 text-teal-600" />
            <span>Staff Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Hospital Staff & Receptionists</h1>
          <p className="text-xs text-slate-500 mt-0.5">Provision authorized hospital staff credentials and manage desk access permissions.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="self-start sm:self-center px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-2xl shadow-md hover:shadow-teal-600/20 inline-flex items-center gap-2 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Authorized Staff
        </button>
      </div>

      {/* Action Banner Message */}
      {actionMessage && (
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search staff name, ID, or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white font-medium transition-all"
          />
        </div>
        <span className="text-xs font-semibold text-slate-400">
          Showing {filteredStaff.length} Staff Member{filteredStaff.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900">
          <span className="text-sm font-bold text-slate-900">Authorized Staff Roster</span>
          <span className="text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100 font-bold">
            Total {filteredStaff.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="p-4 pl-6">Name</th>
                <th className="p-4">Employee ID</th>
                <th className="p-4">Official Email</th>
                <th className="p-4">Department</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Login</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-teal-50/30 transition-colors">
                  <td className="p-4 pl-6 font-bold text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 font-bold text-xs flex items-center justify-center border border-teal-100">
                        {staff.name.charAt(0)}
                      </div>
                      <span>{staff.name}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-teal-700 font-bold">{staff.employeeId}</td>
                  <td className="p-4 text-slate-600 font-medium">{staff.email}</td>
                  <td className="p-4 text-slate-700">{staff.department}</td>
                  <td className="p-4 font-semibold text-slate-900">{staff.role}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      staff.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-red-50 text-red-800 border-red-200'
                    }`}>
                      {staff.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 font-medium">{staff.lastLogin}</td>
                  <td className="p-4 pr-6 text-right space-x-1.5">
                    <button
                      onClick={() => setSelectedStaff(staff)}
                      className="p-2 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-colors cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditStaff(staff)}
                      className="p-2 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-colors cursor-pointer"
                      title="Edit Staff Account"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleStaffStatus(staff.id)}
                      className={`p-2 rounded-xl transition-colors cursor-pointer ${
                        staff.status === 'Active'
                          ? 'text-red-500 hover:bg-red-50'
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
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-4 border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3.5">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-600" />
                Add Authorized Staff Account
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5 uppercase tracking-wider text-[11px]">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newStaffForm.name}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, name: e.target.value })}
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5 uppercase tracking-wider text-[11px]">Official Email *</label>
                <input
                  type="email"
                  required
                  value={newStaffForm.email}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, email: e.target.value })}
                  placeholder="ramesh@aiqtracker.com"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5 uppercase tracking-wider text-[11px]">Department</label>
                  <input
                    type="text"
                    value={newStaffForm.department}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, department: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5 uppercase tracking-wider text-[11px]">Staff Role</label>
                  <select
                    value={newStaffForm.role}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, role: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold text-slate-800"
                  >
                    <option value="Receptionist">Receptionist</option>
                    <option value="Front Desk Nurse">Front Desk Nurse</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-2.5 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl shadow-md transition-all cursor-pointer"
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
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-4 border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3.5">
              <h3 className="font-bold text-slate-900 text-base">Staff Account Details</h3>
              <button onClick={() => setSelectedStaff(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-2.5 text-xs bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
              <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500">Name:</span><span className="font-bold text-slate-900">{selectedStaff.name}</span></div>
              <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500">Employee ID:</span><span className="font-bold text-teal-700 font-mono">{selectedStaff.employeeId}</span></div>
              <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500">Official Email:</span><span className="font-bold text-slate-900">{selectedStaff.email}</span></div>
              <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500">Department:</span><span className="font-bold text-slate-900">{selectedStaff.department}</span></div>
              <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500">Role:</span><span className="font-bold text-teal-800">{selectedStaff.role}</span></div>
              <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-500">Status:</span><span className="font-bold text-emerald-600">{selectedStaff.status}</span></div>
              <div className="flex justify-between py-1"><span className="text-slate-500">Last Login:</span><span className="font-bold text-slate-700">{selectedStaff.lastLogin}</span></div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedStaff(null)}
                className="w-full py-3 bg-slate-900 text-white font-bold text-xs rounded-2xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT STAFF MODAL */}
      {editStaff && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-4 border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3.5">
              <h3 className="font-bold text-slate-900 text-base">Edit Staff Account</h3>
              <button onClick={() => setEditStaff(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5 uppercase tracking-wider text-[11px]">Full Name</label>
                <input
                  type="text"
                  required
                  value={editStaff.name}
                  onChange={(e) => setEditStaff({ ...editStaff, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5 uppercase tracking-wider text-[11px]">Official Email</label>
                <input
                  type="email"
                  required
                  value={editStaff.email}
                  onChange={(e) => setEditStaff({ ...editStaff, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5 uppercase tracking-wider text-[11px]">Department</label>
                <input
                  type="text"
                  required
                  value={editStaff.department}
                  onChange={(e) => setEditStaff({ ...editStaff, department: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-2.5 justify-end">
                <button
                  type="button"
                  onClick={() => setEditStaff(null)}
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
