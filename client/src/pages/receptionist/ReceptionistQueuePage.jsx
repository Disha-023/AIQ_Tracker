import React, { useState, useEffect } from 'react';
import { Users, Play, SkipForward, CheckCircle2, Pause, Volume2, Plus, Ticket, Clock, AlertCircle } from 'lucide-react';
import { queueService } from '../../services/queueService';
import { doctorService } from '../../services/doctorService';
import { patientService } from '../../services/patientService';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';

export default function ReceptionistQueuePage() {
  const [tokens, setTokens] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [callMessage, setCallMessage] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  
  // Issue Token State
  const [newPatient, setNewPatient] = useState('');
  const [newDoctorId, setNewDoctorId] = useState('');

  const fetchQueueData = async () => {
    try {
      const qData = await queueService.getAll();
      setTokens(qData);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load queue entries.');
    } finally {
      setLoading(false);
    }
  };

  const loadDoctors = async () => {
    try {
      const dData = await doctorService.getAll();
      const activeDocs = dData.filter(d => d.isAvailableToday);
      setDoctors(activeDocs);
      if (activeDocs.length > 0 && !newDoctorId) {
        setNewDoctorId(activeDocs[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  useAutoRefresh(fetchQueueData, 8000);

  // Derived values
  const servingToken = tokens.find(t => t.status === 'SERVING');
  const currentTokenStr = servingToken ? servingToken.token : '#0';
  const waitingCount = tokens.filter(t => t.status === 'WAITING').length;
  const currentTokenNum = servingToken && servingToken.token_number ? Number(servingToken.token_number) : 0;

  const handleCallNext = async () => {
    setError('');
    const serving = tokens.find(t => t.status === 'SERVING');
    const nextWaiting = tokens.find(t => t.status === 'WAITING');

    try {
      if (serving) {
        // Complete current serving patient
        await queueService.update(serving.id, { status: 'COMPLETED' });
      }

      if (nextWaiting) {
        // Call next waiting patient
        await queueService.update(nextWaiting.id, { status: 'SERVING' });
        setCallMessage(`Calling Token ${nextWaiting.token} to ${nextWaiting.doctorName}'s OPD room`);
      } else {
        setCallMessage('No patients waiting in queue.');
      }
      fetchQueueData();
    } catch (err) {
      setError(err.message || 'Failed to transition queue status.');
    }
  };

  const handleSkipToken = async () => {
    setError('');
    const serving = tokens.find(t => t.status === 'SERVING');
    const nextWaiting = tokens.find(t => t.status === 'WAITING');

    try {
      if (serving) {
        // Cancel/Skip current serving patient
        await queueService.update(serving.id, { status: 'CANCELLED' });
      }

      if (nextWaiting) {
        // Call next waiting patient
        await queueService.update(nextWaiting.id, { status: 'SERVING' });
        setCallMessage(`Skipped current token. Calling Token ${nextWaiting.token}`);
      } else {
        setCallMessage('Skipped current token. No more patients waiting.');
      }
      fetchQueueData();
    } catch (err) {
      setError(err.message || 'Failed to skip token.');
    }
  };

  const handleMarkCompleted = async () => {
    setError('');
    const serving = tokens.find(t => t.status === 'SERVING');
    if (!serving) {
      setError('No patient is currently in consultation.');
      return;
    }
    try {
      await queueService.update(serving.id, { status: 'COMPLETED' });
      setActionMessage(`Token ${serving.token} consultation marked Completed.`);
      setTimeout(() => setActionMessage(''), 3000);
      fetchQueueData();
    } catch (err) {
      setError(err.message || 'Failed to complete consultation.');
    }
  };

  const handleGenerateToken = async (e) => {
    e.preventDefault();
    if (!newPatient.trim() || !newDoctorId) return;

    setError('');
    setActionMessage('');
    try {
      // Find matching patient by ID, mobile, or name
      const patientSearch = await patientService.getAll();
      const match = patientSearch.find(
        p => p.id.toLowerCase() === newPatient.trim().toLowerCase() ||
             p.mobile === newPatient.trim() ||
             p.name.toLowerCase() === newPatient.trim().toLowerCase()
      );

      if (!match) {
        setError(`Patient '${newPatient}' not found in registry. Register them first.`);
        return;
      }

      const freshEntry = await queueService.join({
        patientId: match.id,
        doctorId: newDoctorId,
        type: 'walk-in'
      });

      setNewPatient('');
      setActionMessage(`Walk-in Token ${freshEntry.token} generated for ${match.name}`);
      setTimeout(() => setActionMessage(''), 4000);
      fetchQueueData();
    } catch (err) {
      setError(err.message || 'Failed to issue walk-in token.');
    }
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

      {/* Error / Alert Bar */}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Action Banner Message */}
      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

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
              value={newDoctorId}
              onChange={(e) => setNewDoctorId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-bold"
            >
              {doctors.map(doc => (
                <option key={doc.id} value={doc.id}>{doc.name} ({doc.specialization})</option>
              ))}
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
              {loading && tokens.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500 font-semibold">
                    Loading OPD queue details...
                  </td>
                </tr>
              ) : tokens.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500 font-semibold">
                    No active queue entries today.
                  </td>
                </tr>
              ) : (
                tokens.map((t, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-extrabold text-blue-700">{t.token}</td>
                    <td className="p-4 font-bold text-slate-900">{t.patientName || t.patient_name || t.patient || 'N/A'}</td>
                    <td className="p-4 text-slate-700">{t.doctorName || t.doctor_name || t.doctor || 'N/A'}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        t.status === 'COMPLETED' || t.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : t.status === 'SERVING' || t.status === 'Serving'
                          ? 'bg-teal-100 text-teal-800 border-teal-200'
                          : t.status === 'CANCELLED' || t.status === 'Skipped' || t.status === 'Cancelled'
                          ? 'bg-red-100 text-red-800 border-red-200'
                          : 'bg-amber-100 text-amber-800 border-amber-200'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{t.waitTime || 'N/A'}</td>
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
