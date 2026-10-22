import React, { useState } from 'react';
import { BarChart3, Users, CheckCircle2, XCircle, Clock, Stethoscope, Building2 } from 'lucide-react';
import { dashboardService } from '../../services/dashboardService';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';

export default function AdminReportsPage() {
  const [reports, setReports] = useState({
    weeklyAppointments: 0,
    avgWaitTimeTrend: '0 mins average',
    completionRate: '100%',
    cancellationRate: '0%',
    doctorStats: [],
    departmentStats: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReports = async () => {
    try {
      const data = await dashboardService.getReports();
      setReports(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load hospital reports.');
    } finally {
      setLoading(false);
    }
  };

  useAutoRefresh(fetchReports, 15000);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-bold mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-teal-600" />
            <span>Clinical Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Hospital Reports & Analytics</h1>
          <p className="text-xs text-slate-500 mt-0.5">High-level insights into patient footfall, OPD wait times, and consultation metrics.</p>
        </div>
        <span className="self-start sm:self-center px-4 py-2 rounded-2xl bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200 flex items-center gap-1.5">
          <BarChart3 className="w-4 h-4 text-teal-600" />
          Completion Rate: {reports.completionRate}
        </span>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* STATISTICAL SUMMARY CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Weekly Patient Volume</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{reports.weeklyAppointments} Patients</div>
            <span className="text-[10px] text-teal-600 font-semibold mt-1 inline-block">Consulted this week</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Avg Wait Time Trend</span>
            <div className="text-base font-black text-emerald-700 mt-1">{reports.avgWaitTimeTrend}</div>
            <span className="text-[10px] text-emerald-600 font-semibold mt-1 inline-block">Under target 15m</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Appointments Completed</span>
            <div className="text-2xl font-black text-teal-700 mt-1">{reports.completionRate}</div>
            <span className="text-[10px] text-teal-600 font-semibold mt-1 inline-block">Successful visits</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cancellation Rate</span>
            <div className="text-2xl font-black text-red-600 mt-1">{reports.cancellationRate}</div>
            <span className="text-[10px] text-red-500 font-semibold mt-1 inline-block">Low dropout rate</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* DOCTOR-WISE & DEPARTMENT-WISE STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* DOCTOR-WISE CONSULTATION STATS (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-7 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-teal-600" />
              Doctor-wise Consultation Performance
            </h3>
          </div>

          <div className="space-y-3">
            {loading && reports.doctorStats.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">Loading performance data...</div>
            ) : reports.doctorStats.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">No active consultations recorded today.</div>
            ) : (
              reports.doctorStats.map((doc, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-between text-xs hover:border-slate-200 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 font-bold flex items-center justify-center text-xs border border-teal-100">
                      {doc.name ? doc.name.charAt(4) : 'D'}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">{doc.name}</span>
                      <span className="text-[11px] text-slate-400">Avg Consultation: {doc.avg_duration || '10 mins'}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-teal-700 text-base">{doc.consultations}</span>
                    <span className="text-[10px] text-slate-400 block font-medium">consultations</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* DEPARTMENT-WISE PATIENT DISTRIBUTION (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-7 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-600" />
              Department-wise Patient Load
            </h3>
          </div>

          <div className="space-y-4 text-xs pt-1">
            {loading && reports.departmentStats.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">Loading load distribution...</div>
            ) : reports.departmentStats.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">No active department loads today.</div>
            ) : (
              reports.departmentStats.map((dept, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-700">{dept.department}</span>
                    <span className="text-teal-700 font-bold">{dept.percentage}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-teal-600 rounded-full"
                      style={{ width: `${dept.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
