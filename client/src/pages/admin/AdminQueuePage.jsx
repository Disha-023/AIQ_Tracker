import React, { useState } from 'react';
import { Activity, Clock, Users, Stethoscope, Building2 } from 'lucide-react';
import { queueService } from '../../services/queueService';
import { doctorService } from '../../services/doctorService';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';

export default function AdminQueuePage() {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    patientsWaiting: 0,
    avgWaitMin: '0 min',
    completedToday: 0,
    queueEfficiency: '100%'
  });

  const fetchQueueData = async () => {
    try {
      const qEntries = await queueService.getAll();
      const docs = await doctorService.getAll();
      
      const waiting = qEntries.filter(q => q.status === 'WAITING').length;
      const completed = qEntries.filter(q => q.status === 'COMPLETED').length;
      
      setStats({
        patientsWaiting: waiting,
        avgWaitMin: `${waiting * 8} min`,
        completedToday: completed,
        queueEfficiency: waiting > 10 ? '92%' : '98%'
      });

      const monitorList = docs.map(doc => {
        const docQueues = qEntries.filter(q => q.doctorId === doc.id);
        const activeServing = docQueues.find(q => q.status === 'SERVING');
        const waitingForDoc = docQueues.filter(q => q.status === 'WAITING').length;
        
        return {
          department: doc.department || doc.department_name,
          doctor: doc.name,
          currentToken: activeServing ? activeServing.token : '#0',
          patientsWaiting: waitingForDoc,
          avgWaitTime: `${waitingForDoc * 8} min`,
          status: doc.status === 'Active' ? 'Active' : 'Paused'
        };
      });

      setQueues(monitorList);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch live queue monitoring data.');
    } finally {
      setLoading(false);
    }
  };

  useAutoRefresh(fetchQueueData, 8000);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hospital-Wide Queue Performance Monitoring</h1>
          <p className="text-xs text-slate-500 mt-0.5">High-level administrative oversight of active OPD queues, wait times, and room congestion.</p>
        </div>
        <span className="self-start sm:self-center px-3.5 py-1.5 rounded-full bg-purple-50 text-purple-800 text-xs font-bold border border-purple-200 flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-purple-600" />
          Queue Efficiency Rate: {stats.queueEfficiency}
        </span>
      </div>

      {/* Summary Stat Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-950 text-white p-5 rounded-2xl border border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Patients Waiting</span>
            <div className="text-3xl font-extrabold text-amber-400 mt-1">{stats.patientsWaiting}</div>
          </div>
          <Users className="w-8 h-8 text-amber-400" />
        </div>

        <div className="bg-slate-950 text-white p-5 rounded-2xl border border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Average Wait Time</span>
            <div className="text-3xl font-extrabold text-blue-400 mt-1">{stats.avgWaitMin}</div>
          </div>
          <Clock className="w-8 h-8 text-blue-400" />
        </div>

        <div className="bg-slate-950 text-white p-5 rounded-2xl border border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Completed Consultations</span>
            <div className="text-3xl font-extrabold text-emerald-400 mt-1">{stats.completedToday}</div>
          </div>
          <Activity className="w-8 h-8 text-emerald-400" />
        </div>
      </div>

      {/* Queue Monitoring Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 text-xs font-bold text-slate-900 flex justify-between items-center">
          <span>Active OPD Queue Monitor</span>
          <span className="text-slate-500 font-normal">Real-time status tracking</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">Department</th>
                <th className="p-4">Assigned Doctor</th>
                <th className="p-4">Current Token</th>
                <th className="p-4">Patients Waiting</th>
                <th className="p-4">Average Wait Time</th>
                <th className="p-4">Queue Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {loading && queues.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500 font-semibold">
                    Loading hospital queue data...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-red-500 font-semibold">
                    {error}
                  </td>
                </tr>
              ) : queues.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500 font-semibold">
                    No active queues found.
                  </td>
                </tr>
              ) : (
                queues.map((q, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-purple-600" />
                      {q.department}
                    </td>
                    <td className="p-4 text-slate-800 font-medium">{q.doctor}</td>
                    <td className="p-4 font-extrabold text-blue-700">{q.currentToken}</td>
                    <td className="p-4 font-bold text-amber-600">{q.patientsWaiting} Patients</td>
                    <td className="p-4 text-slate-600">{q.avgWaitTime}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        q.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border-amber-200'
                      }`}>
                        {q.status}
                      </span>
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
