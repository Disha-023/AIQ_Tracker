import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShieldAlert, Key, LogOut, CheckCircle2, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { adminMockData } from '../../data/adminMockData';

export default function AdminProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const adminInfo = {
    name: user?.name || adminMockData.admin.name,
    staffId: user?.id || adminMockData.admin.staffId,
    email: user?.email || adminMockData.admin.email,
    mobile: user?.mobile || adminMockData.admin.mobile,
    role: user?.role || adminMockData.admin.role,
    department: adminMockData.admin.department,
    hospital: adminMockData.admin.hospital,
    lastLogin: adminMockData.admin.lastLogin
  };

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: adminInfo.name,
    email: adminInfo.email,
    mobile: adminInfo.mobile
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/staff/login');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setMessage('Profile details updated successfully.');
    setTimeout(() => setMessage(''), 3000);
    setEditMode(false);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    setMessage('Password changed successfully.');
    setTimeout(() => setMessage(''), 3000);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
            {adminInfo.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{adminInfo.name}</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{adminInfo.role} &bull; {adminInfo.hospital}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="self-start sm:self-center px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl border border-red-200 inline-flex items-center gap-2 cursor-pointer transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout Admin Session
        </button>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* ADMIN DETAILS CARD */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
        <div className="flex justify-between items-center pb-3 border-b border-slate-200">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-purple-600" />
            Administrative Account Profile
          </h3>
          <button
            onClick={() => setEditMode(!editMode)}
            className="text-xs font-bold text-purple-700 hover:underline cursor-pointer"
          >
            {editMode ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>

        {editMode ? (
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save Profile Changes
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 font-semibold block">Admin / Staff ID</span>
              <span className="font-extrabold text-purple-700 text-sm font-mono">{adminInfo.staffId}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 font-semibold block">Official Email</span>
              <span className="font-bold text-slate-900 text-sm">{adminInfo.email}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 font-semibold block">Assigned Role</span>
              <span className="font-bold text-indigo-700 text-sm">{adminInfo.role}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 font-semibold block">Last Active Session</span>
              <span className="font-bold text-slate-700 text-sm">{adminInfo.lastLogin}</span>
            </div>
          </div>
        )}
      </div>

      {/* CHANGE PASSWORD CARD */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200 text-sm font-bold text-slate-900">
          <Key className="w-5 h-5 text-purple-600" />
          Change Admin Password
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4 text-xs max-w-md">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Current Password</label>
            <input
              type="password"
              required
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">New Password</label>
            <input
              type="password"
              required
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Update Password
          </button>
        </form>
      </div>

    </div>
  );
}
