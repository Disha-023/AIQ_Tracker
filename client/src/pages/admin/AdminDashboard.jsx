import React, { useState } from 'react';
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
  Settings,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { adminMockData } from '../../data/adminMockData';
import { dashboardService } from '../../services/dashboardService';
import { doctorService } from '../../services/doctorService';
import { departmentService } from '../../services/departmentService';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';

export default function AdminDashboard() {
  const { staffMembers } = adminMockData;
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    todaysAppointments: 0,
    activeDoctors: 0,
    activeReceptionists: 1,
    patientsWaiting: 0,
    completedToday: 0
  });

  const loadStats = async () => {
    try {
      const data = await dashboardService.getStats();
      setStats({
        totalPatients: data.totalPatients,
        todaysAppointments: data.waitingPatients + data.completedVisits,
        activeDoctors: data.activeDoctors,
        activeReceptionists: 1,
        patientsWaiting: data.waitingPatients,
        completedToday: data.completedVisits
      });

      const docs = await doctorService.getAll();
      setDoctors(docs.slice(0, 5));

      const depts = await departmentService.getAll();
      setDepartments(depts.slice(0, 5));
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    }
  };

  useAutoRefresh(loadStats, 8000);

  const completionRate = stats.todaysAppointments > 0
    ? Math.round((stats.completedToday / stats.todaysAppointments) * 100)
    : 72;

  return (
    <div className="space-y-7 font-sans pb-12">
      
      {/* 1. EXECUTIVE COMMAND HEADER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold shadow-2xs">
              <ShieldAlert className="w-3.5 h-3.5 text-teal-600" />
              Chief Executive Command Center &bull; Kole Hospital
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational &bull; 99.9% Uptime
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Hospital Operations & Clinical Governance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl">
            Real-time telemetry on patient registrations, doctor room utilization, OPD queue pacing, and clinical departmental throughput.
          </p>
        </div>

        {/* Quick Executive Shortcuts */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            to="/admin/doctors"
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Stethoscope className="w-4 h-4" />
            Manage Doctors
          </Link>
          <Link
            to="/admin/reports"
            className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200/90 transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <BarChart3 className="w-4 h-4 text-teal-600" />
            Clinical Analytics
          </Link>
        </div>
      </div>

      {/* 2. EXECUTIVE 6-METRIC KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Patients</span>
            <div className="text-2xl font-black text-slate-900 mt-1 font-mono">{stats.totalPatients.toLocaleString()}</div>
            <span className="text-[10px] text-teal-600 font-semibold mt-1 inline-block">Registered in EHR</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-100 shadow-2xs">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Today's Total Appts</span>
            <div className="text-2xl font-black text-teal-700 mt-1 font-mono">{stats.todaysAppointments}</div>
            <span className="text-[10px] text-teal-600 font-semibold mt-1 inline-block">Scheduled for OPD</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100 shadow-2xs">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Doctors on Duty</span>
            <div className="text-2xl font-black text-emerald-700 mt-1 font-mono">{stats.activeDoctors}</div>
            <span className="text-[10px] text-emerald-600 font-semibold mt-1 inline-block">Active Consultation</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-100 shadow-2xs">
            <Stethoscope className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Front Desk Staff</span>
            <div className="text-2xl font-black text-slate-800 mt-1 font-mono">{stats.activeReceptionists}</div>
            <span className="text-[10px] text-slate-500 font-semibold mt-1 inline-block">Counter Active</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200 shadow-2xs">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Waiting Lounge</span>
            <div className="text-2xl font-black text-amber-600 mt-1 font-mono">{stats.patientsWaiting}</div>
            <span className="text-[10px] text-amber-700 font-semibold mt-1 inline-block">OPD Queue</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100 shadow-2xs">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Consultations Done</span>
            <div className="text-2xl font-black text-emerald-600 mt-1 font-mono">{stats.completedToday}</div>
            <span className="text-[10px] text-emerald-700 font-semibold mt-1 inline-block">Discharged Today</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100 shadow-2xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* 3. ENTERPRISE OPD TELEMETRY & CLINICAL THROUGHPUT (7 cols Left / 5 cols Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        
        {/* LEFT: ENTERPRISE OPD QUEUE TELEMETRY (7 cols) */}
        <div className="lg:col-span-7 bg-gradient-to-br from-teal-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-teal-900/40 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-300 uppercase tracking-wider">
                <Activity className="w-4 h-4 text-teal-300" />
                Hospital-Wide OPD Queue Telemetry
              </div>
              <span className="text-xs font-bold bg-white/10 text-teal-200 px-3 py-1 rounded-full border border-white/15">
                Pacing Optimal
              </span>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Live Outpatient Traffic & Capacity
              </h3>
              <p className="text-xs text-teal-200/80 mt-1">
                Continuous algorithmic telemetry of patient queue movement across all clinical departments.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3.5 text-center my-4">
              <div className="bg-white/5 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Waiting</span>
                <span className="text-3xl font-black text-amber-300 mt-1.5 block font-mono">{stats.patientsWaiting}</span>
                <span className="text-[10.5px] text-teal-200/70 mt-1 block">In OPD Lounges</span>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Average Wait Time</span>
                <span className="text-3xl font-black text-teal-300 mt-1.5 block font-mono">14 min</span>
                <span className="text-[10.5px] text-teal-200/70 mt-1 block">-38% vs baseline</span>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Consultations</span>
                <span className="text-3xl font-black text-emerald-300 mt-1.5 block font-mono">{stats.completedToday}</span>
                <span className="text-[10.5px] text-teal-200/70 mt-1 block">Completed Today</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <span className="text-xs text-slate-400">
              Department Queue Routing: <strong className="text-teal-200">5 Active Specialty Wings</strong>
            </span>
            <Link
              to="/admin/queue"
              className="px-5 py-2.5 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              Open Enterprise Queue Monitor
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* RIGHT: APPOINTMENT COMPLETION BENCHMARKS (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-600" />
                Clinical Throughput & Completion
              </h4>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {completionRate}% Complete
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-2 mb-4 leading-relaxed">
              Real-time daily progress towards scheduled outpatient consultations and walk-in triage milestones.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-semibold mb-1.5">
                  <span className="text-slate-700">Completed Doctor Consultations</span>
                  <span className="text-slate-900 font-bold font-mono">{stats.completedToday}</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(15, completionRate))}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1.5">
                  <span className="text-slate-700">Patients In Queue / Lounge</span>
                  <span className="text-slate-900 font-bold font-mono">{stats.patientsWaiting}</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '28%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1.5">
                  <span className="text-slate-700">Upcoming Afternoon Shift Appointments</span>
                  <span className="text-slate-900 font-bold font-mono">16</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: '22%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-right">
            <Link
              to="/admin/reports"
              className="text-xs font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1"
            >
              Full Clinical Analytics Reports
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>

      {/* 4. DOCTORS ROSTER & DEPARTMENT STATUS (2 COLUMNS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        
        {/* DOCTOR AVAILABILITY & OPD ROOMS (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Doctor Availability & Room Allocation</h3>
                <p className="text-xs text-slate-500">Live consultation room status and duty schedule</p>
              </div>
              <Link to="/admin/doctors" className="text-xs font-bold text-teal-700 hover:text-teal-900 hover:underline">
                Manage All Doctors &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              {doctors.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex items-center justify-between text-xs hover:border-teal-300 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 font-bold flex items-center justify-center text-xs border border-teal-100 shadow-2xs">
                      {doc.name ? doc.name[0].toUpperCase() : 'D'}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">{doc.name}</span>
                      <span className="text-[11px] text-slate-500">{doc.specialization} &bull; {doc.room}</span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                    doc.availability === 'Available'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : doc.availability === 'On Break'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}>
                    {doc.availability}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DEPARTMENT / OPD STATUS (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Clinical Department Capacity</h3>
                <p className="text-xs text-slate-500">Active OPD clinical wings & assigned staff</p>
              </div>
              <Link to="/admin/departments" className="text-xs font-bold text-teal-700 hover:text-teal-900 hover:underline">
                View All Departments &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              {departments.map((dept) => (
                <div
                  key={dept.id}
                  className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex items-center justify-between text-xs hover:border-teal-300 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 font-bold flex items-center justify-center text-xs border border-teal-100 shadow-2xs">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">{dept.name}</span>
                      <span className="text-[11px] text-slate-500">{dept.assignedDoctors} Doctors Assigned &bull; {dept.room}</span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                    dept.queueStatus === 'High Volume'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-teal-50 text-teal-800 border-teal-200'
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
