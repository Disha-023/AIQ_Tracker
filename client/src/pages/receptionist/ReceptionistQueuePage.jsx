import React, { useState, useEffect } from 'react';
import { Users, Play, SkipForward, CheckCircle2, Pause, Volume2, Plus, Ticket, Clock, AlertCircle, AlertTriangle } from 'lucide-react';
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

  // Cancellation Modal State
  const [cancellingToken, setCancellingToken] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

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

  const handleConfirmCancel = async () => {
    if (!cancellingToken) return;
    setCancelLoading(true);
    setError('');
    try {
      await queueService.update(cancellingToken.id, { status: 'CANCELLED' });
      setActionMessage(`Queue Token ${cancellingToken.token} for ${cancellingToken.patientName || 'patient'} has been cancelled.`);
      setTimeout(() => setActionMessage(''), 4000);
      setCancellingToken(null);
      await fetchQueueData();
    } catch (err) {
      setError(err.message || 'Failed to cancel queue token.');
    } finally {
      setCancelLoading(false);
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
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-bold mb-2">
            <Ticket className="w-3.5 h-3.5 text-teal-600" />
            <span>Live Dispatch Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">OPD Queue Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">Control live OPD tokens, manage patient flow, and coordinate the waiting room.</p>
        </div>
        <span className={`self-start sm:self-center px-4 py-2 rounded-2xl text-xs font-bold border transition-all ${
          isPaused ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
        }`}>
          <span className="inline-block w-2 h-2 rounded-full mr-2 bg-current animate-pulse"></span>
          {isPaused ? 'Queue Paused' : 'Queue Active'}
        </span>
      </div>

      {/* Error / Alert Bar */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Action Banner Message */}
      {actionMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* AUDIO ANNOUNCEMENT BANNER */}
      {callMessage && (
        <div className="p-5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-3xl shadow-lg border border-teal-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Volume2 className="w-5 h-5 animate-pulse text-white" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-teal-100 tracking-wider">Audio Dispatch Announcement</span>
              <h3 className="font-bold text-sm text-white">{callMessage}</h3>
            </div>
          </div>
          <button
            onClick={() => setCallMessage('')}
            className="text-xs bg-white/20 hover:bg-white/30 px-3.5 py-1.5 rounded-xl text-white font-semibold cursor-pointer transition-colors backdrop-blur-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* KEY QUEUE NUMBERS & CONTROL PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CURRENT QUEUE NUMBERS SUMMARY (7 cols) */}
        <div className="lg:col-span-7 bg-gradient-to-br from-teal-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-teal-900/50 space-y-6 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-300"></span>
              </span>
              <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wider">Assigned OPD Doctor</span>
            </div>
            <span className="text-xs font-semibold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/15">
              Dr. Rahul Mehta &bull; OPD Room 202
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3.5 text-center my-auto">
            <div className="bg-white/5 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10">
              <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Currently Serving</span>
              <span className="text-3xl sm:text-5xl font-black text-white mt-1.5 block">#{currentTokenNum}</span>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10">
              <span className="text-[10px] font-bold text-teal-300 uppercase block tracking-wider">Next Token</span>
              <span className="text-3xl sm:text-5xl font-black text-teal-300 mt-1.5 block">#{currentTokenNum + 1}</span>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10">
              <span className="text-[10px] font-bold text-amber-300 uppercase block tracking-wider">Patients Waiting</span>
              <span className="text-3xl sm:text-5xl font-black text-amber-300 mt-1.5 block">{waitingCount}</span>
            </div>
          </div>

          <div className="text-xs text-slate-400 text-center pt-2 border-t border-white/10">
            Average consultation duration: <strong className="text-teal-200">7 minutes per patient</strong>
          </div>
        </div>

        {/* OPERATIONAL QUEUE CONTROLS (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">Queue Controls</h3>
            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">Front Desk Dispatch</span>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleCallNext}
              className="w-full py-3.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-2xl shadow-md hover:shadow-teal-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              Call Next Patient (#{currentTokenNum + 1})
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handleSkipToken}
                className="py-3 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-2xl border border-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <SkipForward className="w-4 h-4 text-amber-600" />
                Skip Token
              </button>

              <button
                onClick={handleMarkCompleted}
                className="py-3 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-xs rounded-2xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Mark Completed
              </button>
            </div>

            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`w-full py-3 px-4 font-semibold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isPaused
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <Pause className="w-4 h-4" />
              {isPaused ? 'Resume Queue' : 'Pause Queue'}
            </button>
          </div>
        </div>

      </div>

      {/* ISSUE NEW WALK-IN TOKEN SECTION */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
          <Ticket className="w-4 h-4 text-teal-600" />
          <span>Issue New Walk-in Token</span>
        </div>
        <form onSubmit={handleGenerateToken} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Patient Name / ID *
            </label>
            <input
              type="text"
              required
              value={newPatient}
              onChange={(e) => setNewPatient(e.target.value)}
              placeholder="e.g. Suresh Kumar"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Assign OPD Doctor
            </label>
            <select
              value={newDoctorId}
              onChange={(e) => setNewDoctorId(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white font-bold transition-all text-slate-800"
            >
              {doctors.map(doc => (
                <option key={doc.id} value={doc.id}>{doc.name} ({doc.specialization})</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="py-3 px-5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-2xl shadow-md hover:shadow-teal-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer h-[46px]"
          >
            <Plus className="w-4 h-4" />
            Generate Token
          </button>
        </form>
      </div>

      {/* PATIENT QUEUE & TOKEN REGISTRY TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center text-xs font-bold text-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm block text-slate-900">OPD Patient Queue & Token Registry</span>
              <span className="text-[11px] text-slate-400 font-normal">Real-time status of all daily tokens</span>
            </div>
          </div>
          <span className="px-3 py-1 bg-slate-50 rounded-full border border-slate-200 text-slate-600 font-semibold text-xs">
            Total Tokens: {tokens.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="p-4 pl-6">Token #</th>
                <th className="p-4">Patient Name</th>
                <th className="p-4">Assigned Doctor</th>
                <th className="p-4">Status</th>
                <th className="p-4">Estimated Wait Time</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading && tokens.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400 font-semibold">
                    Loading OPD queue details...
                  </td>
                </tr>
              ) : tokens.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-slate-400">
                    <Ticket className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No active queue entries today</p>
                    <p className="text-xs text-slate-400 mt-0.5">Generate a walk-in token above to begin</p>
                  </td>
                </tr>
              ) : (
                tokens.map((t, idx) => (
                  <tr key={idx} className="hover:bg-teal-50/30 transition-colors">
                    <td className="p-4 pl-6 font-extrabold text-teal-700">{t.token}</td>
                    <td className="p-4 font-bold text-slate-900">{t.patientName || t.patient_name || t.patient || 'N/A'}</td>
                    <td className="p-4 text-slate-700">{t.doctorName || t.doctor_name || t.doctor || 'N/A'}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        t.status === 'COMPLETED' || t.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : t.status === 'SERVING' || t.status === 'Serving'
                          ? 'bg-teal-50 text-teal-800 border-teal-200'
                          : t.status === 'CANCELLED' || t.status === 'Skipped' || t.status === 'Cancelled'
                          ? 'bg-red-50 text-red-800 border-red-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 font-medium">{t.waitTime || 'N/A'}</td>
                    <td className="p-4 pr-6 text-right">
                      {(t.status === 'WAITING' || t.status === 'Waiting') ? (
                        <button
                          type="button"
                          onClick={() => setCancellingToken(t)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs font-medium">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CANCELLATION CONFIRMATION DIALOG */}
      {cancellingToken && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border border-slate-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Cancel OPD Queue Token</h3>
                <span className="text-[11px] text-slate-500">Live queue removal confirmation</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Patient:</span>
                <strong className="text-slate-900">{cancellingToken.patientName || cancellingToken.patient || 'Patient'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Token Number:</span>
                <strong className="text-teal-700 font-mono text-sm">{cancellingToken.token}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Assigned Doctor:</span>
                <span className="text-slate-800 font-semibold">{cancellingToken.doctorName || 'Doctor'}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-amber-50 p-3.5 rounded-xl border border-amber-200">
              This action cancels the patient's active live OPD queue token for today. The patient's master medical registry record will <strong>NOT</strong> be deleted.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancellingToken(null)}
                disabled={cancelLoading}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Keep Token
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={cancelLoading}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {cancelLoading ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
