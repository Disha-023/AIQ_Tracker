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
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-teal-600 text-white font-black text-2xl flex items-center justify-center shadow-md border-2 border-teal-500">
            {staff.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">{staff.name}</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Staff ID: <strong className="text-teal-700 font-mono">{staff.staffId}</strong> &bull; {staff.department}</p>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-[11px] font-bold border border-teal-200 mt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              {staff.role} (Authorized Front Desk)
            </span>
          </div>
        </div>

        <div className="py-6 space-y-4 text-xs">
          <h3 className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">Official Staff Credentials</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90">
              <span className="text-slate-400 uppercase font-bold text-[10px] tracking-wider block">Full Name</span>
              <span className="font-bold text-slate-900 text-sm mt-1 block">{staff.name}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90">
              <span className="text-slate-400 uppercase font-bold text-[10px] tracking-wider block">Staff ID</span>
              <span className="font-bold text-teal-700 font-mono text-sm mt-1 block">{staff.staffId}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90">
              <span className="text-slate-400 uppercase font-bold text-[10px] tracking-wider block">Official Email</span>
              <span className="font-bold text-slate-900 text-sm mt-1 block">{staff.email}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90">
              <span className="text-slate-400 uppercase font-bold text-[10px] tracking-wider block">Contact Mobile</span>
              <span className="font-bold text-slate-900 text-sm mt-1 block">{staff.mobile}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90">
              <span className="text-slate-400 uppercase font-bold text-[10px] tracking-wider block">Hospital Department</span>
              <span className="font-bold text-slate-900 text-sm mt-1 block">{staff.department}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90">
              <span className="text-slate-400 uppercase font-bold text-[10px] tracking-wider block">System Role</span>
              <span className="font-bold text-emerald-700 text-sm mt-1 block">{staff.role}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[11px]">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            Staff credentials and counter assignment managed by Hospital System Administration.
          </span>
        </div>
      </div>
    </div>
  );
}
