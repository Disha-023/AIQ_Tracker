import React, { useState } from 'react';
import { Users, UserPlus, CheckCircle2, ShieldCheck } from 'lucide-react';
import { adminMockData } from '../../data/adminMockData';

export default function AdminStaffPage() {
  const [staffList, setStaffList] = useState(adminMockData.staffMembers);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    department: 'OPD Front Desk',
    role: 'Receptionist'
  });

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!newStaff.name.trim() || !newStaff.email.trim()) return;

    const createdStaff = {
      id: `REC00${staffList.length + 1}`,
      name: newStaff.name,
      role: newStaff.role,
      department: newStaff.department,
      email: newStaff.email,
      status: 'Active'
    };

    setStaffList([...staffList, createdStaff]);
    setNewStaff({ name: '', email: '', department: 'OPD Front Desk', role: 'Receptionist' });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hospital Staff Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage authorized hospital staff accounts, receptionists, and roles</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          {showAddForm ? 'Close Form' : 'Create Receptionist Account'}
        </button>
      </div>

      {/* CREATE STAFF ACCOUNT FORM */}
      {showAddForm && (
        <div className="bg-white rounded-2xl p-6 border border-purple-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <ShieldCheck className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-slate-900 text-sm">Issue Authorized Staff Credentials</h3>
          </div>

          <form onSubmit={handleAddStaff} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end text-xs">
            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={newStaff.name}
                onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                placeholder="e.g. Meera Nair"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Official Staff Email *
              </label>
              <input
                type="email"
                required
                value={newStaff.email}
                onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                placeholder="meera.rec@aiqtracker.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Generate Authorized Account
            </button>
          </form>
        </div>
      )}

      {/* STAFF LIST TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 text-xs font-bold text-slate-900">
          Authorized Staff Registry ({staffList.length} Accounts)
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">Staff ID</th>
                <th className="p-4">Full Name</th>
                <th className="p-4">Assigned Role</th>
                <th className="p-4">Department</th>
                <th className="p-4">Official Email</th>
                <th className="p-4">Account Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {staffList.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-mono font-bold text-purple-700">{s.id}</td>
                  <td className="p-4 font-bold text-slate-900">{s.name}</td>
                  <td className="p-4 text-slate-700">{s.role}</td>
                  <td className="p-4 text-slate-600">{s.department}</td>
                  <td className="p-4 text-slate-600">{s.email}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {s.status}
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
