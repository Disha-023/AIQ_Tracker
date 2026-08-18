import React from 'react';
import { BarChart3, TrendingUp, Users, CheckCircle2, XCircle, Clock, Stethoscope, Building2 } from 'lucide-react';
import { adminMockData } from '../../data/adminMockData';

export default function AdminReportsPage() {
  const { reports, stats } = adminMockData;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hospital Reports & Analytics</h1>
          <p className="text-xs text-slate-500 mt-0.5">High-level insights into patient footfall, OPD wait times, and consultation metrics.</p>
        </div>
        <span className="self-start sm:self-center px-3.5 py-1.5 rounded-full bg-purple-50 text-purple-800 text-xs font-bold border border-purple-200 flex items-center gap-1.5">
          <BarChart3 className="w-4 h-4 text-purple-600" />
          Completion Rate: {reports.completionRate}
        </span>
      </div>

      {/* STATISTICAL SUMMARY CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Weekly Patient Volume</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{reports.weeklyAppointments} Patients</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Avg Wait Time Trend</span>
            <div className="text-sm font-extrabold text-emerald-700 mt-1">{reports.avgWaitTimeTrend}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Appointments Completed</span>
            <div className="text-2xl font-extrabold text-blue-700 mt-1">{reports.completionRate}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Cancellation Rate</span>
            <div className="text-2xl font-extrabold text-red-600 mt-1">{reports.cancellationRate}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* DOCTOR-WISE & DEPARTMENT-WISE STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* DOCTOR-WISE CONSULTATION STATS (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-purple-600" />
              Doctor-wise Consultation Performance
            </h3>
          </div>

          <div className="space-y-3">
            {reports.doctorStats.map((doc, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{doc.name}</span>
                  <span className="text-[11px] text-slate-500">Avg Consultation Time: {doc.avgDuration}</span>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-purple-700 text-sm">{doc.consultations}</span>
                  <span className="text-[10px] text-slate-500 block">consultations</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DEPARTMENT-WISE PATIENT DISTRIBUTION (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-600" />
              Department-wise Patient Load
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            {reports.departmentStats.map((dept, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-700">{dept.department}</span>
                  <span className="text-purple-700 font-bold">{dept.percentage}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full"
                    style={{ width: `${dept.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
