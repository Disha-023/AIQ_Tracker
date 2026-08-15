import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Stethoscope,
  UserCheck,
  Activity,
  UserPlus,
  ShieldAlert,
  BarChart3,
  Settings,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { adminMockData } from '../../data/adminMockData';

export default function AdminDashboard() {
  const { stats, staffMembers, doctors } = adminMockData;

  return (
    <div className="space-y-8">
      
      {/* STATISTICS CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Hospital Staff</span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{stats.totalStaff}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Active OPD Doctors</span>
            <div className="text-3xl font-extrabold text-blue-700 mt-1">{stats.activeDoctors}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Stethoscope className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Registered Patients</span>
            <div className="text-3xl font-extrabold text-teal-700 mt-1">{stats.totalPatients}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Queue Efficiency Rate</span>
            <div className="text-3xl font-extrabold text-emerald-700 mt-1">{stats.queueEfficiency}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* QUICK ACTIONS GRID */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Admin Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <Link
            to="/admin/staff"
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-400 transition-all group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Staff Management</h4>
                <p className="text-xs text-slate-500">Add & manage staff accounts</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
          </Link>

          <Link
            to="/admin/doctors"
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-400 transition-all group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Doctor Roster</h4>
                <p className="text-xs text-slate-500">Manage OPD room slots</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </Link>

          <Link
            to="/admin/reports"
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-400 transition-all group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Reports & Analytics</h4>
                <p className="text-xs text-slate-500">Hospital queue performance</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </Link>

          <Link
            to="/admin/settings"
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-400 transition-all group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">System Settings</h4>
                <p className="text-xs text-slate-500">Configure AIQ system</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
          </Link>

        </div>
      </div>

      {/* STAFF MANAGEMENT & DOCTORS ROSTER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* AUTHORIZED STAFF MEMBERS (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Authorized Hospital Staff</h3>
                <p className="text-xs text-slate-500">Manage receptionist and staff accounts</p>
              </div>
              <Link
                to="/admin/staff"
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-1 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Add Receptionist
              </Link>
            </div>

            <div className="space-y-3">
              {staffMembers.map((staff) => (
                <div key={staff.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{staff.name}</span>
                    <span className="text-[11px] text-slate-500">{staff.role} &bull; {staff.department}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {staff.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-right">
            <Link to="/admin/staff" className="text-xs font-semibold text-purple-700 hover:underline">
              View All Staff Accounts &rarr;
            </Link>
          </div>
        </div>

        {/* ACTIVE DOCTOR ROSTER (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">OPD Doctor Roster</h3>
                <p className="text-xs text-slate-500">Live consultation room assignments</p>
              </div>
            </div>

            <div className="space-y-3">
              {doctors.map((doc) => (
                <div key={doc.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{doc.name}</span>
                    <span className="text-[11px] text-slate-500">{doc.specialization} &bull; {doc.room}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-right">
            <Link to="/admin/doctors" className="text-xs font-semibold text-purple-700 hover:underline">
              Manage Doctor Roster &rarr;
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
