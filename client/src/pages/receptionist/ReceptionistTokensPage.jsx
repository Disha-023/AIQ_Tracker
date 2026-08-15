import React, { useState } from 'react';
import { Ticket, Plus, CheckCircle, Clock } from 'lucide-react';
import { receptionistMockData } from '../../data/receptionistMockData';

export default function ReceptionistTokensPage() {
  const [tokens, setTokens] = useState(receptionistMockData.tokens);
  const [newPatient, setNewPatient] = useState('');
  const [newDoctor, setNewDoctor] = useState('Dr. Rahul Mehta');

  const handleGenerateToken = (e) => {
    e.preventDefault();
    if (!newPatient.trim()) return;

    const nextTokenNum = `#${27 + tokens.length - 5}`;
    const newTokenObj = {
      token: nextTokenNum,
      patient: newPatient,
      doctor: newDoctor,
      status: 'Waiting',
      waitTime: '15 min'
    };

    setTokens([...tokens, newTokenObj]);
    setNewPatient('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Token Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">Issue new walk-in tokens and monitor active token registry</p>
        </div>
      </div>

      {/* ISSUE TOKEN FORM */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Issue New Walk-in Token</h3>
        <form onSubmit={handleGenerateToken} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Patient Name / ID
            </label>
            <input
              type="text"
              required
              value={newPatient}
              onChange={(e) => setNewPatient(e.target.value)}
              placeholder="e.g. Suresh Kumar"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Assign OPD Doctor
            </label>
            <select
              value={newDoctor}
              onChange={(e) => setNewDoctor(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            >
              <option>Dr. Rahul Mehta</option>
              <option>Dr. Anjali Sharma</option>
              <option>Dr. Vikram Shah</option>
            </select>
          </div>

          <button
            type="submit"
            className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Generate Token
          </button>
        </form>
      </div>

      {/* TOKEN REGISTRY TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 text-xs font-bold text-slate-900">
          Today's Token Registry
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">Token #</th>
                <th className="p-4">Patient</th>
                <th className="p-4">Assigned Doctor</th>
                <th className="p-4">Status</th>
                <th className="p-4">Estimated Wait Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {tokens.map((t, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-extrabold text-blue-700">{t.token}</td>
                  <td className="p-4 font-bold text-slate-900">{t.patient}</td>
                  <td className="p-4 text-slate-700">{t.doctor}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      t.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : t.status === 'Serving'
                        ? 'bg-teal-100 text-teal-800 border-teal-200'
                        : 'bg-amber-100 text-amber-800 border-amber-200'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">{t.waitTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
