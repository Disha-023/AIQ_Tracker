import React, { useState } from 'react';
import { Users, Play, SkipForward, CheckCircle2, Pause, Volume2, Plus, Ticket, Clock, AlertCircle } from 'lucide-react';
import { receptionistMockData } from '../../data/receptionistMockData';

export default function ReceptionistQueuePage() {
  const [tokens, setTokens] = useState(receptionistMockData.tokens);
  const [currentTokenNum, setCurrentTokenNum] = useState(24);
  const [waitingCount, setWaitingCount] = useState(18);
  const [isPaused, setIsPaused] = useState(false);
  const [callMessage, setCallMessage] = useState('');
  
  // Issue Token State
  const [newPatient, setNewPatient] = useState('');
  const [newDoctor, setNewDoctor] = useState('Dr. Rahul Mehta');

  const handleCallNext = () => {
    const nextNum = currentTokenNum + 1;
    const currentTokenStr = `#${currentTokenNum}`;
    const nextTokenStr = `#${nextNum}`;

    // Update tokens status
    setTokens(prevTokens =>
      prevTokens.map(t => {
        if (t.token === currentTokenStr) return { ...t, status: 'Completed', waitTime: 'Consultation Done' };
        if (t.token === nextTokenStr) return { ...t, status: 'Serving', waitTime: 'Currently In Consultation' };
        return t;
      })
    );

    setCurrentTokenNum(nextNum);
    setWaitingCount(prev => Math.max(0, prev - 1));
    setCallMessage(`Calling Token ${nextTokenStr} to OPD Room 202`);
  };

  const handleSkipToken = () => {
    const nextNum = currentTokenNum + 1;
    const currentTokenStr = `#${currentTokenNum}`;
    const nextTokenStr = `#${nextNum}`;

    setTokens(prevTokens =>
      prevTokens.map(t => {
        if (t.token === currentTokenStr) return { ...t, status: 'Skipped', waitTime: 'Skipped' };
        if (t.token === nextTokenStr) return { ...t, status: 'Serving', waitTime: 'Currently In Consultation' };
        return t;
      })
    );

    setCurrentTokenNum(nextNum);
    setCallMessage(`Skipped Token ${currentTokenStr}. Calling Token ${nextTokenStr}`);
  };

  const handleMarkCompleted = () => {
    const currentTokenStr = `#${currentTokenNum}`;
    setTokens(prevTokens =>
      prevTokens.map(t =>
        t.token === currentTokenStr ? { ...t, status: 'Completed', waitTime: 'Consultation Done' } : t
      )
    );
    setCallMessage(`Token ${currentTokenStr} consultation marked Completed`);
  };

  const handleGenerateToken = (e) => {
    e.preventDefault();
    if (!newPatient.trim()) return;

    const nextTokenId = `#${27 + tokens.length - 5}`;
    const newTokenObj = {
      token: nextTokenId,
      patient: newPatient.trim(),
      doctor: newDoctor,
      status: 'Waiting',
      waitTime: '15 min'
    };

    setTokens([...tokens, newTokenObj]);
    setWaitingCount(prev => prev + 1);
    setNewPatient('');
    setCallMessage(`Walk-in Token ${nextTokenId} generated for ${newPatient.trim()}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">OPD Queue Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">Control live OPD tokens, manage patient flow, and coordinate the waiting room.</p>
        </div>
        <span className={`self-start sm:self-center px-3.5 py-1.5 rounded-full text-xs font-bold border ${
          isPaused ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'
        }`}>
          {isPaused ? 'Queue Paused' : 'Queue Active'}
        </span>
      </div>

      {/* AUDIO ANNOUNCEMENT BANNER */}
      {callMessage && (
        <div className="p-4 bg-blue-600 text-white rounded-2xl shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Volume2 className="w-6 h-6 animate-pulse" />
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">Audio Dispatch Announcement</span>
              <h3 className="font-bold text-sm">{callMessage}</h3>
            </div>
          </div>
          <button
            onClick={() => setCallMessage('')}
            className="text-xs bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded-lg text-white font-semibold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* KEY QUEUE NUMBERS & CONTROL PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CURRENT QUEUE NUMBERS SUMMARY (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 text-white rounded-2xl p-6 shadow-sm border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned OPD Doctor</span>
            <span className="text-xs font-bold text-blue-400">Dr. Rahul Mehta &bull; OPD Room 202</span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Currently Serving</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-white mt-1 block">#{currentTokenNum}</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Next Token</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-blue-400 mt-1 block">#{currentTokenNum + 1}</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Patients Waiting</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-amber-400 mt-1 block">{waitingCount}</span>
            </div>
          </div>

          <div className="text-xs text-slate-400 text-center">
            Average consultation duration: <strong className="text-white">7 minutes per patient</strong>
          </div>
        </div>

        {/* OPERATIONAL QUEUE CONTROLS (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <h3 className="font-bold text-slate-900 text-base pb-3 border-b border-slate-200">
            Queue Controls
          </h3>

          <div className="space-y-3">
            <button
              onClick={handleCallNext}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              Call Next Patient (#{currentTokenNum + 1})
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleSkipToken}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <SkipForward className="w-4 h-4 text-amber-600" />
                Skip Token
              </button>

              <button
                onClick={handleMarkCompleted}
                className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Mark Completed
              </button>
            </div>

            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`w-full py-2.5 px-4 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                isPaused
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300'
              }`}
            >
              <Pause className="w-4 h-4" />
              {isPaused ? 'Resume Queue' : 'Pause Queue'}
            </button>
          </div>
        </div>

      </div>

      {/* ISSUE NEW WALK-IN TOKEN SECTION */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
          <Ticket className="w-4 h-4 text-blue-600" />
          Issue New Walk-in Token
        </div>
        <form onSubmit={handleGenerateToken} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Patient Name / ID *
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

      {/* PATIENT QUEUE & TOKEN REGISTRY TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center text-xs font-bold text-slate-900">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span>OPD Patient Queue & Token Registry</span>
          </div>
          <span className="text-slate-500 font-normal">Total Tokens: {tokens.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">Token #</th>
                <th className="p-4">Patient Name</th>
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
                        : t.status === 'Skipped'
                        ? 'bg-red-100 text-red-800 border-red-200'
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
