import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Stethoscope,
  UserCheck,
  Activity,
  Calendar,
  CheckCircle2,
  Clock,
  Building2,
  ChevronRight,
  TrendingUp,
  ShieldAlert,
  BarChart3,
  Settings
} from 'lucide-react';
import { adminMockData } from '../../data/adminMockData';

export default function AdminDashboard() {
  const { stats, doctors, staffMembers, departments } = adminMockData;

  return (
    <div className="space-y-8">
      
      {/* HEADER TITLE */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Good Morning, Admin 👋</h1>
          <p className="text-xs text-slate-500 mt-0.5">Hospital administration overview & operational analytics</p>
        </div>
        <span className="self-start sm:self-center px-3.5 py-1.5 rounded-full bg-purple-50 text-purple-800 text-xs font-bold border border-purple-200 flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
          AIQ Super Specialty Hospital Administration
        </span>
      </div>

      {/* 6 SUMMARY STAT CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Patients</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{stats.totalPatients.toLocaleString()}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Today's Appointments</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-700 mt-1">{stats.todaysAppointments}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Active Doctors</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-teal-700 mt-1">{stats.activeDoctors}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
            <Stethoscope className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Active Receptionists</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-700 mt-1">{stats.activeReceptionists}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Patients Waiting</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">{stats.patientsWaiting}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Completed Today</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-1">{stats.completedToday}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* HOSPITAL OPERATIONS OVERVIEW SECTION */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hospital Operations Overview</h3>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* OPD QUEUE STATUS & PERFORMANCE (7 cols) */}
          <div className="lg:col-span-7 bg-slate-950 text-white rounded-2xl p-6 shadow-sm border border-slate-800 space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
                  <Activity className="w-4 h-4 text-purple-400" />
                  Real-time OPD Queue Monitoring
                </div>
                <span className="text-xs font-bold bg-purple-900/60 text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-700">
                  Hospital Efficiency {stats.queueEfficiency}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center mt-6">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Waiting</span>
                  <span className="text-3xl font-extrabold text-amber-400 mt-1 block">{stats.patientsWaiting}</span>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Avg Wait Time</span>
                  <span className="text-3xl font-extrabold text-blue-400 mt-1 block">{stats.avgWaitMin}</span>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Consultations Completed</span>
                  <span className="text-3xl font-extrabold text-emerald-400 mt-1 block">{stats.completedToday}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
              <span className="text-xs text-slate-400">
                Active OPD Queue Rooms: <strong className="text-white">5 Departments Operational</strong>
              </span>
              <Link
                to="/admin/departments"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-1.5"
              >
                View OPD Departments &rarr;
              </Link>
            </div>
          </div>

          {/* APPOINTMENT COMPLETION RATE & VISIT STATS (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  Appointment Completion Rate
                </h4>
                <span className="text-xs font-bold text-emerald-600">92% Completion</span>
              </div>

              <div className="space-y-4 mt-4 text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-600">Completed Consultations (52)</span>
                    <span className="text-slate-900 font-bold">60%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-600">Patients In Queue / Waiting (18)</span>
                    <span className="text-slate-900 font-bold">21%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '21%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-600">Upcoming Afternoon Slots (16)</span>
                    <span className="text-slate-900 font-bold">19%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '19%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-right">
              <Link to="/admin/reports" className="text-xs font-semibold text-purple-700 hover:underline">
                View Full Analytics Reports &rarr;
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* QUICK ADMIN ACTIONS & DOCTORS ROSTER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* DOCTOR AVAILABILITY & OPD ROOMS (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Doctor Availability & OPD Rooms</h3>
                <p className="text-xs text-slate-500">Live consultation room status</p>
              </div>
              <Link to="/admin/doctors" className="text-xs font-semibold text-purple-700 hover:underline">
                Doctor Roster &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              {doctors.map((doc) => (
                <div key={doc.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{doc.name}</span>
                    <span className="text-[11px] text-slate-500">{doc.specialization} &bull; {doc.room}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    doc.availability === 'Available'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : doc.availability === 'On Break'
                      ? 'bg-amber-100 text-amber-800 border-amber-200'
                      : 'bg-red-100 text-red-800 border-red-200'
                  }`}>
                    {doc.availability}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DEPARTMENT / OPD STATUS (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Hospital Department Status</h3>
                <p className="text-xs text-slate-500">Active OPD departments & assigned staff</p>
              </div>
              <Link to="/admin/departments" className="text-xs font-semibold text-purple-700 hover:underline">
                View Departments &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              {departments.map((dept) => (
                <div key={dept.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{dept.name}</span>
                    <span className="text-[11px] text-slate-500">{dept.assignedDoctors} Doctors Assigned &bull; {dept.room}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    dept.queueStatus === 'High Volume'
                      ? 'bg-amber-100 text-amber-800 border-amber-200'
                      : 'bg-blue-100 text-blue-800 border-blue-200'
                  }`}>
                    {dept.queueStatus}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
