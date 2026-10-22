import React, { useState } from 'react';
import { ClipboardList, CheckCircle2, Clock } from 'lucide-react';
import { queueService } from '../../services/queueService';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';

export default function ReceptionistVisitsPage() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchVisits = async () => {
    try {
      const qEntries = await queueService.getAll();
      const mappedVisits = qEntries.map(q => ({
        id: q.queueId,
        patient: q.patientName,
        patientId: q.patientId,
        doctor: q.doctorName,
        token: q.token,
        arrivalTime: q.joined_at ? new Date(q.joined_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : 'N/A',
        consultationStatus: q.status === 'SERVING' ? 'In Consultation' : q.status === 'COMPLETED' ? 'Completed' : 'Waiting',
        visitStatus: q.status === 'COMPLETED' ? 'Discharged' : 'Active in OPD'
      }));
      setVisits(mappedVisits);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load visits log.');
    } finally {
      setLoading(false);
    }
  };

  useAutoRefresh(fetchVisits, 15000);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-bold mb-2">
            <ClipboardList className="w-3.5 h-3.5 text-teal-600" />
            <span>Consultation Audit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Today's Patient Visits Log</h1>
          <p className="text-xs text-slate-500 mt-0.5">Real-time log of checked-in patients, consultation statuses, and discharges</p>
        </div>
        <span className="self-start sm:self-center px-4 py-2 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-bold border border-emerald-200">
          {visits.length} Logged Visits Today
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="p-4 pl-6">Visit ID</th>
                <th className="p-4">Patient Name</th>
                <th className="p-4">Assigned Doctor</th>
                <th className="p-4">Token #</th>
                <th className="p-4">Arrival Time</th>
                <th className="p-4">Consultation Status</th>
                <th className="p-4 pr-6">Visit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading && visits.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400 font-semibold">
                    Loading today's patient visits...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-red-500 font-semibold">
                    {error}
                  </td>
                </tr>
              ) : visits.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-10 text-center text-slate-400">
                    <ClipboardList className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No patient visits logged today</p>
                    <p className="text-xs text-slate-400 mt-0.5">Checked-in patient visits will appear here automatically</p>
                  </td>
                </tr>
              ) : (
                visits.map((v) => (
                  <tr key={v.id} className="hover:bg-teal-50/30 transition-colors">
                    <td className="p-4 pl-6 font-mono font-bold text-teal-700">{v.id}</td>
                    <td className="p-4 text-slate-900 font-bold">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 font-bold flex items-center justify-center text-xs border border-teal-100">
                          {v.patient ? v.patient[0].toUpperCase() : 'P'}
                        </div>
                        <div>
                          <span>{v.patient}</span>
                          <span className="block text-[10px] text-slate-400 font-normal">{v.patientId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-700 font-medium">{v.doctor}</td>
                    <td className="p-4 font-extrabold text-teal-700">{v.token}</td>
                    <td className="p-4 text-slate-700 font-medium">{v.arrivalTime}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        v.consultationStatus === 'Completed'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : v.consultationStatus === 'In Consultation'
                          ? 'bg-teal-50 text-teal-800 border-teal-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {v.consultationStatus}
                      </span>
                    </td>
                    <td className="p-4 pr-6 font-bold text-slate-800">{v.visitStatus}</td>
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
