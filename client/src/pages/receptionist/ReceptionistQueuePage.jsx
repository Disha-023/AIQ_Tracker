import React, { useState } from 'react';
import { Users, Play, SkipForward, CheckCircle2, Pause, Volume2, Sparkles } from 'lucide-react';
import { receptionistMockData } from '../../data/receptionistMockData';

export default function ReceptionistQueuePage() {
  const [currentTokenNum, setCurrentTokenNum] = useState(24);
  const [waitingCount, setWaitingCount] = useState(18);
  const [isPaused, setIsPaused] = useState(false);
  const [callMessage, setCallMessage] = useState('');

  const handleCallNext = () => {
    const nextNum = currentTokenNum + 1;
    setCurrentTokenNum(nextNum);
    setWaitingCount(prev => Math.max(0, prev - 1));
    setCallMessage(`Calling Token #${nextNum} to OPD Room 202`);
  };

  const handleSkipToken = () => {
    const nextNum = currentTokenNum + 1;
    setCurrentTokenNum(nextNum);
    setCallMessage(`Skipped Token #${currentTokenNum}. Calling Token #${nextNum}`);
  };

  const handleMarkCompleted = () => {
    setCallMessage(`Token #${currentTokenNum} consultation marked Completed`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">OPD Queue Management Desk</h1>
          <p className="text-xs text-slate-500 mt-0.5">Control live OPD tokens, dispatch consultation calls, and manage waiting room flow</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
          isPaused ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'
        }`}>
          {isPaused ? 'Queue Paused' : 'Queue Active'}
        </span>
      </div>

      {/* CALL ANNOUNCEMENT BANNER */}
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
        
        {/* CURRENT QUEUE NUMBERS (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 text-white rounded-2xl p-6 shadow-sm border border-slate-800 space-y-6">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned OPD Doctor</span>
            <span className="text-xs font-bold text-blue-400">Dr. Rahul Mehta &bull; OPD Room 202</span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Currently Serving</span>
              <span className="text-4xl font-extrabold text-white mt-1 block">#{currentTokenNum}</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Next Token</span>
              <span className="text-4xl font-extrabold text-blue-400 mt-1 block">#{currentTokenNum + 1}</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Patients Waiting</span>
              <span className="text-4xl font-extrabold text-amber-400 mt-1 block">{waitingCount}</span>
            </div>
          </div>

          <div className="text-xs text-slate-400 text-center">
            Average consultation duration: <strong className="text-white">7 minutes per patient</strong>
          </div>
        </div>

        {/* OPERATIONAL QUEUE CONTROLS (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <h3 className="font-bold text-slate-900 text-base pb-3 border-b border-slate-200">
            Front-Desk Queue Controls
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

    </div>
  );
}
