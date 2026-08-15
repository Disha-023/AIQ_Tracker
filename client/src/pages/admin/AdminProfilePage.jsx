import React from 'react';
import { ShieldAlert, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { adminMockData } from '../../data/adminMockData';

export default function AdminProfilePage() {
  const { user } = useAuth();
  const admin = {
    ...adminMockData.admin,
    name: user?.name || adminMockData.admin.name,
    email: user?.email || adminMockData.admin.email
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-200">
          <div className="w-16 h-16 rounded-2xl bg-purple-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
            {admin.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 leading-tight">{admin.name}</h1>
            <p className="text-xs text-slate-500 font-medium">Staff ID: <strong className="text-purple-700">{admin.staffId}</strong> &bull; {admin.department}</p>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 text-[11px] font-bold border border-purple-200 mt-2">
              <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
              {admin.role} (System Executive)
            </span>
          </div>
        </div>

        <div className="py-6 space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 uppercase tracking-wider">Executive Profile Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 uppercase font-semibold text-[10px] block">Full Name</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{admin.name}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 uppercase font-semibold text-[10px] block">Staff ID</span>
              <span className="font-bold text-purple-700 text-sm mt-0.5 block">{admin.staffId}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 uppercase font-semibold text-[10px] block">Official Email</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{admin.email}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 uppercase font-semibold text-[10px] block">Contact Mobile</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{admin.mobile}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 uppercase font-semibold text-[10px] block">Hospital Name</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{admin.hospital}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 uppercase font-semibold text-[10px] block">System Role</span>
              <span className="font-bold text-purple-700 text-sm mt-0.5 block">{admin.role}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[11px]">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            Administrator role holds top-level system permissions.
          </span>
        </div>
      </div>
    </div>
  );
}
