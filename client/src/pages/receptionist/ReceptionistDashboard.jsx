import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  Ticket,
  CheckCircle2,
  Clock,
  Search,
  UserPlus,
  ArrowRight,
  ChevronRight,
  Activity,
  Building2,
  Stethoscope,
  Volume2,
  PhoneCall,
  Sparkles,
  Filter,
  BadgeAlert
} from 'lucide-react';
import { dashboardService } from '../../services/dashboardService';
import { appointmentService } from '../../services/appointmentService';
import { queueService } from '../../services/queueService';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';

export default function ReceptionistDashboard() {
  const [stats, setStats] = useState({
    todaysAppointments: 0,
    patientsWaiting: 0,
    currentlyServingToken: '#0',
    completedVisits: 0
  });

  const [liveQueue, setLiveQueue] = useState({
    currentToken: '#0',
    nextToken: '#0',
    patientsWaiting: 0,
    averageWait: '0 min'
  });

  const [todayAppointments, setTodayAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const loadDashboardData = async () => {
    try {
      const statsData = await dashboardService.getStats();
      const appointments = await appointmentService.getAll();
      const queues = await queueService.getAll();

      const todayStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
      const todaysApts = appointments.filter(a => a.date === todayStr);
      setTodayAppointments(todaysApts);

      const serving = queues.find(q => q.status === 'SERVING');
      const nextWaiting = queues.find(q => q.status === 'WAITING');

      setStats({
        todaysAppointments: todaysApts.length,
        patientsWaiting: statsData.waitingPatients,
        currentlyServingToken: serving ? serving.token : '#0',
        completedVisits: statsData.completedVisits
      });

      setLiveQueue({
        currentToken: serving ? serving.token : '#0',
        nextToken: nextWaiting ? nextWaiting.token : '#0',
        patientsWaiting: statsData.waitingPatients,
        averageWait: `${statsData.averageWaitMin} min`
      });

    } catch (err) {
      console.error('Failed to load receptionist dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useAutoRefresh(loadDashboardData, 8000);

  const handleCheckIn = async (appointmentId) => {
    try {
      const apt = todayAppointments.find(a => a.id === appointmentId);
      if (!apt) return;
      
      await queueService.join({
        patientId: apt.patientId,
        doctorId: apt.doctorId,
        appointmentId: appointmentId,
        type: 'appointment'
      });

      await loadDashboardData();
    } catch (err) {
      console.error('Check-in error:', err);
    }
  };

  const filteredAppointments = todayAppointments.filter(apt => {
    const matchesSearch = !searchFilter.trim() ||
      apt.patientName?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      apt.token?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      apt.doctor?.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'pending' && apt.status !== 'Checked-in' && apt.status !== 'Completed') ||
      (statusFilter === 'checked-in' && apt.status === 'Checked-in') ||
      (statusFilter === 'completed' && apt.status === 'Completed');

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-7 font-sans pb-12">
      
      {/* 1. WORKSTATION COMMAND HEADER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold shadow-2xs">
              <Building2 className="w-3.5 h-3.5 text-teal-600" />
              Terminal Desk 01 &bull; Kole Hospital OPD
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Morning Shift Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            OPD Reception Operations Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl">
            Front-desk patient intake, walk-in token issuance, instant appointment check-in, and real-time consultation dispatch.
          </p>
        </div>

        {/* Quick Workstation Shortcuts */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            to="/reception/register-patient"
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            New Patient Intake
          </Link>
          <Link
            to="/reception/queue"
            className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200/90 transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Ticket className="w-4 h-4 text-teal-600" />
            Issue Walk-in Token
          </Link>
        </div>
      </div>

      {/* 2. OPERATIONAL TELEMETRY METRIC STRIP (4 CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Today's Scheduled</span>
            <div className="text-3xl font-black text-slate-900 mt-1 font-mono">{stats.todaysAppointments}</div>
            <span className="text-[11px] text-teal-600 font-semibold mt-1 inline-block">Active OPD Bookings</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100 shadow-2xs">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Waiting in Lounge</span>
            <div className="text-3xl font-black text-amber-600 mt-1 font-mono">{stats.patientsWaiting}</div>
            <span className="text-[11px] text-amber-700 font-semibold mt-1 inline-block">Awaiting Doctor Call</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shadow-2xs">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Currently Serving</span>
            <div className="text-3xl font-black text-teal-700 mt-1 font-mono">{stats.currentlyServingToken}</div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">Inside Doctor Rooms</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100 shadow-2xs">
            <Ticket className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Consultations Finished</span>
            <div className="text-3xl font-black text-emerald-600 mt-1 font-mono">{stats.completedVisits}</div>
            <span className="text-[11px] text-emerald-700 font-semibold mt-1 inline-block">Discharged & Completed</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-2xs">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* 3. DUAL-PANEL LIVE WORKSTATION CONSOLE (7 cols Left / 5 cols Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        
        {/* LEFT PANEL: LIVE OPD QUEUE DISPATCH & CALLER (7 cols) */}
        <div className="lg:col-span-7 bg-gradient-to-br from-teal-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-teal-800/40 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-200 text-xs font-bold">
                <Activity className="w-3.5 h-3.5 text-teal-300" />
                Live OPD Queue Dispatch Console
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-400/30">
                Pacing Active
              </span>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Main OPD Waiting Lounge
              </h3>
              <p className="text-xs text-teal-200/80 mt-1">
                Real-time queue monitoring, patient call sequence, and room capacity management.
              </p>
            </div>

            {/* Token Metrics Display */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-center text-xs">
              <div className="p-2 bg-white/5 rounded-xl">
                <span className="text-[10px] text-teal-200 font-bold uppercase tracking-wider block">Serving Now</span>
                <span className="text-2xl font-black text-white font-mono mt-1 block">{liveQueue.currentToken}</span>
              </div>
              <div className="p-2 bg-white/5 rounded-xl">
                <span className="text-[10px] text-teal-200 font-bold uppercase tracking-wider block">Next Up</span>
                <span className="text-2xl font-black text-teal-300 font-mono mt-1 block">{liveQueue.nextToken}</span>
              </div>
              <div className="p-2 bg-white/5 rounded-xl">
                <span className="text-[10px] text-teal-200 font-bold uppercase tracking-wider block">In Waiting Room</span>
                <span className="text-2xl font-black text-amber-300 font-mono mt-1 block">{liveQueue.patientsWaiting}</span>
              </div>
              <div className="p-2 bg-white/5 rounded-xl">
                <span className="text-[10px] text-teal-200 font-bold uppercase tracking-wider block">Average Wait</span>
                <span className="text-2xl font-black text-emerald-300 font-mono mt-1 block">{liveQueue.averageWait}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-teal-200/80">
              Need to call next patient, advance room queues, or broadcast audio announcement?
            </span>
            <Link
              to="/reception/queue"
              className="w-full sm:w-auto px-6 py-3 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              Open Queue Dispatch Desk
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* RIGHT PANEL: RAPID CHECK-IN DESK (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-600" />
                <h3 className="font-extrabold text-slate-900 text-base">Rapid Check-In Desk</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                1-Click Dispatch
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              When a scheduled patient arrives at the front desk, click <strong>Check-in</strong> to confirm arrival and issue their active OPD queue token.
            </p>

            {/* Quick Pending Appointments List */}
            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {todayAppointments.filter(a => a.status !== 'Checked-in' && a.status !== 'Completed').length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs bg-slate-50/80 rounded-2xl border border-slate-200/70">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
                  All scheduled patients currently checked in!
                </div>
              ) : (
                todayAppointments
                  .filter(a => a.status !== 'Checked-in' && a.status !== 'Completed')
                  .slice(0, 3)
                  .map(apt => (
                    <div
                      key={apt.id}
                      className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900 block">{apt.patientName}</span>
                        <span className="text-slate-500 text-[11px] block">{apt.doctor} &bull; {apt.time}</span>
                      </div>
                      <button
                        onClick={() => handleCheckIn(apt.id)}
                        className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
                      >
                        Check-in
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-right">
            <Link
              to="/reception/appointments"
              className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900"
            >
              Full Appointment Check-In Ledger &rarr;
            </Link>
          </div>
        </div>

      </div>

      {/* 4. TODAY'S APPOINTMENTS LEDGER TABLE WITH SEARCH & STATUS TABS */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden space-y-4 p-6 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Today's Scheduled Appointments Ledger
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live consultation roster and front-desk patient arrival verification.
            </p>
          </div>

          {/* Search Input & Status Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search patient, token, doctor..."
                className="w-full sm:w-64 pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              {[
                { id: 'all', label: 'All' },
                { id: 'pending', label: 'Pending' },
                { id: 'checked-in', label: 'Checked In' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    statusFilter === tab.id
                      ? 'bg-white text-teal-800 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="p-3.5 pl-4">Patient Name</th>
                <th className="p-3.5">Doctor & Specialization</th>
                <th className="p-3.5">Scheduled Slot</th>
                <th className="p-3.5">Token #</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 pr-4 text-right">Desk Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading && todayAppointments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-slate-400 font-semibold">
                    Loading today's scheduled appointments...
                  </td>
                </tr>
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-slate-400">
                    <Calendar className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-700 text-sm">No matching appointments found</p>
                    <p className="text-xs text-slate-400 mt-0.5">Try adjusting your search query or filter tab</p>
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-teal-50/30 transition-colors">
                    <td className="p-3.5 pl-4 text-slate-900 font-bold">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 font-bold flex items-center justify-center text-xs border border-teal-100 shadow-2xs">
                          {apt.patientName ? apt.patientName[0].toUpperCase() : 'P'}
                        </div>
                        <div>
                          <span className="block">{apt.patientName}</span>
                          <span className="block text-[10px] font-normal text-slate-400">{apt.patientId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-700">
                      <span className="font-semibold block text-slate-900">{apt.doctor}</span>
                      <span className="text-[11px] text-slate-500">{apt.specialization || 'General Medicine'}</span>
                    </td>
                    <td className="p-3.5 text-slate-700 font-semibold">{apt.time}</td>
                    <td className="p-3.5 font-bold text-teal-700 font-mono text-sm">{apt.token}</td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        apt.status === 'Waiting'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : apt.status === 'Checked-in'
                          ? 'bg-teal-50 text-teal-800 border-teal-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="p-3.5 pr-4 text-right">
                      {apt.status !== 'Checked-in' && apt.status !== 'Completed' && apt.status !== 'Cancelled' ? (
                        <button
                          onClick={() => handleCheckIn(apt.id)}
                          className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-colors cursor-pointer text-xs shadow-xs"
                        >
                          Check-in
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-semibold">
                          {apt.status === 'Checked-in' ? 'Checked In ✓' : 'Finished'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
