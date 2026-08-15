import React from 'react';
import { ClipboardList, CheckCircle2, Clock } from 'lucide-react';
import { receptionistMockData } from '../../data/receptionistMockData';

export default function ReceptionistVisitsPage() {
  const { visits } = receptionistMockData;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Today's Patient Visits Log</h1>
          <p className="text-xs text-slate-500 mt-0.5">Real-time log of checked-in patients, consultation statuses, and discharges</p>
        </div>
        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200">
          {visits.length} Logged Visits Today
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">Visit ID</th>
                <th className="p-4">Patient Name</th>
                <th className="p-4">Assigned Doctor</th>
                <th className="p-4">Token #</th>
                <th className="p-4">Arrival Time</th>
                <th className="p-4">Consultation Status</th>
                <th className="p-4">Visit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {visits.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-mono font-bold text-blue-700">{v.id}</td>
                  <td className="p-4 text-slate-900 font-bold">
                    {v.patient}
                    <span className="block text-[10px] text-slate-400 font-normal">{v.patientId}</span>
                  </td>
                  <td className="p-4 text-slate-700">{v.doctor}</td>
                  <td className="p-4 font-extrabold text-blue-700">{v.token}</td>
                  <td className="p-4 text-slate-700">{v.arrivalTime}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      v.consultationStatus === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {v.consultationStatus}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-slate-800">{v.visitStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
