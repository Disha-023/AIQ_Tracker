import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShieldAlert, Key, LogOut, CheckCircle2, Save, Mail, Phone, Building2, Calendar, ShieldCheck, Lock } from 'lucide-react';
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
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-sm">
            {adminInfo.name.charAt(0)}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200/60 text-teal-800 text-[11px] font-bold mb-1">
              <ShieldCheck className="w-3 h-3 text-teal-600" />
              {adminInfo.role || 'Super Admin'}
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{adminInfo.name}</h1>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              {adminInfo.hospital} &bull; ID: <span className="font-mono text-slate-700 font-bold">{adminInfo.staffId}</span>
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="self-start sm:self-center px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-2xl border border-rose-200/80 inline-flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
        >
          <LogOut className="w-4 h-4" />
          Logout Admin Session
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center gap-2.5 shadow-2xs ${
          message.includes('not match')
            ? 'bg-rose-50 border-rose-200 text-rose-800'
            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* ADMIN DETAILS CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/60 flex items-center justify-center shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Administrative Account Profile</h3>
              <p className="text-xs text-slate-500">Contact details and administrative role configuration.</p>
            </div>
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
          >
            {editMode ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>

        {editMode ? (
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 font-medium text-slate-800 transition-all"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Official Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 font-medium text-slate-800 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-xs rounded-2xl shadow-xs inline-flex items-center gap-2 cursor-pointer transition-all"
            >
              <Save className="w-4 h-4" />
              Save Profile Changes
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-1">
              <span className="text-slate-400 font-semibold block text-xs">Admin / Staff Identifier</span>
              <span className="font-extrabold text-teal-700 text-sm font-mono">{adminInfo.staffId}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-1">
              <span className="text-slate-400 font-semibold block text-xs">Official Email</span>
              <span className="font-bold text-slate-900 text-sm">{adminInfo.email}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-1">
              <span className="text-slate-400 font-semibold block text-xs">Assigned Administrative Role</span>
              <span className="font-bold text-slate-900 text-sm">{adminInfo.role}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-1">
              <span className="text-slate-400 font-semibold block text-xs">Last Active Session</span>
              <span className="font-bold text-slate-700 text-sm">{adminInfo.lastLogin}</span>
            </div>
          </div>
        )}
      </div>

      {/* CHANGE PASSWORD CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/60 flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Change Administrative Password</h3>
            <p className="text-xs text-slate-500">Ensure security by updating administrator credentials periodically.</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4 text-xs sm:text-sm max-w-md">
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Current Password</label>
            <input
              type="password"
              required
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 font-medium text-slate-800 transition-all"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">New Password</label>
            <input
              type="password"
              required
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 font-medium text-slate-800 transition-all"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Confirm New Password</label>
            <input
              type="password"
              required
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 font-medium text-slate-800 transition-all"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-xs transition-colors cursor-pointer"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
