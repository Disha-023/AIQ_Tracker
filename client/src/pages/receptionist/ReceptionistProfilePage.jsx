import React from 'react';
import { User, ShieldCheck, Building2, Mail, Phone, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { receptionistMockData } from '../../data/receptionistMockData';

export default function ReceptionistProfilePage() {
  const { user } = useAuth();
  const staff = {
    ...receptionistMockData.receptionist,
    name: user?.name || receptionistMockData.receptionist.name,
    email: user?.email || receptionistMockData.receptionist.email
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-200">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
            {staff.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 leading-tight">{staff.name}</h1>
            <p className="text-xs text-slate-500 font-medium">Staff ID: <strong className="text-blue-700">{staff.staffId}</strong> &bull; {staff.department}</p>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[11px] font-bold border border-blue-200 mt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              {staff.role} (Authorized Staff)
            </span>
          </div>
        </div>

        <div className="py-6 space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 uppercase tracking-wider">Official Staff Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 uppercase font-semibold text-[10px] block">Full Name</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{staff.name}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 uppercase font-semibold text-[10px] block">Staff ID</span>
              <span className="font-bold text-blue-700 text-sm mt-0.5 block">{staff.staffId}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 uppercase font-semibold text-[10px] block">Official Email</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{staff.email}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 uppercase font-semibold text-[10px] block">Contact Mobile</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{staff.mobile}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 uppercase font-semibold text-[10px] block">Hospital Department</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{staff.department}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 uppercase font-semibold text-[10px] block">System Role</span>
              <span className="font-bold text-emerald-700 text-sm mt-0.5 block">{staff.role}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[11px]">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            Staff role is managed via Hospital System Administration.
          </span>
        </div>
      </div>
    </div>
  );
}
