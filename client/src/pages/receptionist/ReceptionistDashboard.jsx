import React from 'react';
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
  Building2
} from 'lucide-react';
import { dashboardService } from '../../services/dashboardService';
import { appointmentService } from '../../services/appointmentService';
import { queueService } from '../../services/queueService';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';
import { useState } from 'react';

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

  const loadDashboardData = async () => {
    try {
      const statsData = await dashboardService.getStats();
      const appointments = await appointmentService.getAll();
      const queues = await queueService.getAll();

      // Today's appointments list
      const todayStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
      const todaysApts = appointments.filter(a => a.date === todayStr);
      setTodayAppointments(todaysApts);

      // Serving token
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
      
      // Call create queue entry which updates appointment status to Checked-in inside transaction
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

  return (
    <div className="space-y-8">
      
      {/* STATISTICS CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Today's Appointments</span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{stats.todaysAppointments}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Patients Waiting</span>
            <div className="text-3xl font-extrabold text-blue-700 mt-1">{stats.patientsWaiting}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Currently Serving</span>
            <div className="text-3xl font-extrabold text-teal-700 mt-1">{stats.currentlyServingToken}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
            <Ticket className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Completed Visits</span>
            <div className="text-3xl font-extrabold text-emerald-700 mt-1">{stats.completedVisits}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* LIVE OPD QUEUE CONTROL PANEL */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
            <Activity className="w-4 h-4 text-blue-400" />
            Live OPD Queue Control Panel
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {liveQueue.doctor}
          </h3>
          <p className="text-xs text-slate-400">Hospital Front Desk Queue Coordination</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800 w-full md:w-auto text-center text-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Current Token</span>
            <span className="text-xl font-extrabold text-white">{liveQueue.currentToken}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Next Token</span>
            <span className="text-xl font-extrabold text-blue-400">{liveQueue.nextToken}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Waiting</span>
            <span className="text-xl font-extrabold text-amber-400">{liveQueue.patientsWaiting}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Avg Wait</span>
            <span className="text-xl font-extrabold text-emerald-400">{liveQueue.averageWait}</span>
          </div>
        </div>

        <Link
          to="/reception/queue"
          className="w-full md:w-auto px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors text-center inline-flex items-center justify-center gap-2 shrink-0"
        >
          Manage Queue
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* QUICK ACTIONS GRID */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Desk Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <Link
            to="/reception/register-patient"
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Register Patient</h4>
                <p className="text-xs text-slate-500">Add desk registration</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </Link>

          <Link
            to="/reception/appointments"
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Create Appointment</h4>
                <p className="text-xs text-slate-500">Schedule OPD slot</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
          </Link>

          <Link
            to="/reception/queue"
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Generate Token</h4>
                <p className="text-xs text-slate-500">Issue walk-in token</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
          </Link>

          <Link
            to="/reception/patients"
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Search Patient</h4>
                <p className="text-xs text-slate-500">Find master record</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
          </Link>

        </div>
      </div>

      {/* TODAY'S APPOINTMENTS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Today's Scheduled Appointments</h3>
            <p className="text-xs text-slate-500">Overview of active patient OPD appointments</p>
          </div>
          <Link
            to="/reception/appointments"
            className="text-xs font-semibold text-blue-700 hover:underline"
          >
            View All Appointments &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">Patient Name</th>
                <th className="p-4">Doctor</th>
                <th className="p-4">Time</th>
                <th className="p-4">Token</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {loading && todayAppointments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500 font-semibold">
                    Loading today's scheduled appointments...
                  </td>
                </tr>
              ) : todayAppointments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500 font-semibold">
                    No scheduled appointments today.
                  </td>
                </tr>
              ) : (
                todayAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 text-slate-900 font-bold">
                      {apt.patientName}
                      <span className="block text-[10px] font-normal text-slate-400">{apt.patientId}</span>
                    </td>
                    <td className="p-4 text-slate-700">{apt.doctor}</td>
                    <td className="p-4 text-slate-700">{apt.time}</td>
                    <td className="p-4 font-bold text-blue-700">{apt.token}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        apt.status === 'Waiting'
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : apt.status === 'Checked-in'
                          ? 'bg-blue-100 text-blue-800 border-blue-200'
                          : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {apt.status !== 'Checked-in' && apt.status !== 'Completed' && apt.status !== 'Cancelled' && (
                        <button
                          onClick={() => handleCheckIn(apt.id)}
                          className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg border border-blue-200 cursor-pointer text-xs"
                        >
                          Check-in
                        </button>
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
