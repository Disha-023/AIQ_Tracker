import React, { useState, useEffect } from 'react';
import { Building2, Stethoscope, Activity, CheckCircle2 } from 'lucide-react';
import { departmentService } from '../../services/departmentService';

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDepartments = async () => {
    try {
      const data = await departmentService.getAll();
      setDepartments(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load departments list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hospital Department & OPD Room Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">Overview of active clinical departments, OPD room allocations, and queue load status.</p>
        </div>
        <span className="self-start sm:self-center px-3.5 py-1.5 rounded-full bg-purple-50 text-purple-800 text-xs font-bold border border-purple-200 flex items-center gap-1.5">
          <Building2 className="w-4 h-4 text-purple-600" />
          Active Departments: {departments.length}
        </span>
      </div>

      {/* Department Cards Grid */}
      {loading && departments.length === 0 ? (
        <div className="text-center font-semibold text-slate-500 py-12 bg-white border border-slate-200 rounded-2xl shadow-xs">
          Loading departments list...
        </div>
      ) : error ? (
        <div className="text-center font-semibold text-red-500 py-12 bg-white border border-slate-200 rounded-2xl shadow-xs">
          {error}
        </div>
      ) : departments.length === 0 ? (
        <div className="text-center font-semibold text-slate-500 py-12 bg-white border border-slate-200 rounded-2xl shadow-xs">
          No hospital departments registered in database.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <div key={dept.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4 hover:border-purple-300 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">{dept.id}</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">{dept.name}</h3>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  dept.status === 'Active' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  {dept.status}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned OPD Doctors:</span>
                  <span className="font-bold text-slate-900">{dept.assignedDoctors} Doctors</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Allocated OPD Rooms:</span>
                  <span className="font-bold text-purple-700">{dept.room}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Queue Load:</span>
                  <span className={`font-bold ${
                    dept.queueStatus === 'High Volume' ? 'text-amber-600' : 'text-blue-600'
                  }`}>{dept.queueStatus}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Departments Detailed Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 text-xs font-bold text-slate-900">
          Hospital Department Registry
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">Dept ID</th>
                <th className="p-4">Department Name</th>
                <th className="p-4">Assigned Doctors</th>
                <th className="p-4">OPD Room Allocation</th>
                <th className="p-4">Queue Load Status</th>
                <th className="p-4">Operational Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {loading && departments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500 font-semibold">
                    Loading department records...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-red-500 font-semibold">
                    {error}
                  </td>
                </tr>
              ) : departments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500 font-semibold">
                    No departments found.
                  </td>
                </tr>
              ) : (
                departments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono font-bold text-purple-700">{dept.id}</td>
                    <td className="p-4 font-bold text-slate-900">{dept.name}</td>
                    <td className="p-4 text-slate-700">{dept.assignedDoctors} Doctors</td>
                    <td className="p-4 font-semibold text-slate-800">{dept.room}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        dept.queueStatus === 'High Volume'
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : 'bg-blue-100 text-blue-800 border-blue-200'
                      }`}>
                        {dept.queueStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {dept.status}
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
