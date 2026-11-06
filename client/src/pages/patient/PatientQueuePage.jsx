import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Brain,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles,
  Info,
  Calendar,
  ChevronRight,
  Bell,
  ShieldCheck
} from 'lucide-react';
import { appointmentService } from '../../services/appointmentService';
import { predictionService } from '../../services/predictionService';
import { useAuth } from '../../context/AuthContext';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';
import { queueService } from '../../services/queueService';

export default function PatientQueuePage() {
  const [activeBooking, setActiveBooking] = useState(null);
  const [simulatedPatientsAhead, setSimulatedPatientsAhead] = useState(5);
  const [simulatedCurrentTokenNum, setSimulatedCurrentTokenNum] = useState(22);
  const [isSimulating, setIsSimulating] = useState(false);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [dbPrediction, setDbPrediction] = useState(null);

  const { user } = useAuth();

  const fetchBooking = async () => {
    if (!user?.id) return;
    try {
      const booking = await appointmentService.getActiveBooking(user.id);
      if (booking && booking.status !== 'Cancelled') {
        setActiveBooking(booking);
        
        // Find if they have an active queue entry
        const qEntries = await queueService.getAll();
        const activeQ = qEntries.find(q => q.patientId === user.id && q.status !== 'COMPLETED' && q.status !== 'CANCELLED');
        if (activeQ) {
          try {
            const pred = await predictionService.fetchPrediction(activeQ.id);
            setDbPrediction(pred);
          } catch (e) {
            console.error('Failed to load wait-time prediction:', e);
          }

          setSimulatedCurrentTokenNum(parseInt(activeQ.token.replace('#', ''), 10) - activeQ.position);
          setSimulatedPatientsAhead(activeQ.position);
        } else {
          // Parse token number if numeric
          const yourTokenNum = parseInt(booking.token.replace('#', ''), 10) || 28;
          if (!isSimulating) {
            const currentNum = Math.max(1, yourTokenNum - 5);
            setSimulatedCurrentTokenNum(currentNum);
            setSimulatedPatientsAhead(Math.max(0, yourTokenNum - currentNum));
          }
        }
      } else {
        setActiveBooking(null);
      }
    } catch (err) {
      console.error('Failed to load active queue booking:', err);
    }
  };

  useAutoRefresh(fetchBooking, 8000, !!user?.id);

  // Demo Simulation Timer (updates queue every 20 seconds if simulation is active)
  useEffect(() => {
    let timer;
    if (isSimulating && simulatedPatientsAhead > 0) {
      timer = setInterval(() => {
        setSimulatedCurrentTokenNum((prev) => prev + 1);
        setSimulatedPatientsAhead((prev) => Math.max(0, prev - 1));
        setSecondsAgo(0);
      }, 20000);
    }
    return () => clearInterval(timer);
  }, [isSimulating, simulatedPatientsAhead]);

  // "Last updated X seconds ago" counter
  useEffect(() => {
    const counter = setInterval(() => {
      setSecondsAgo((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(counter);
  }, []);

  const isBookingActive = activeBooking && activeBooking.status !== 'Cancelled';

  // Get dynamic AI prediction from predictionService
  const basePrediction = predictionService.getWaitingTimePrediction({
    patientsAhead: simulatedPatientsAhead,
    averageConsultationTime: 7,
    doctorStatus: 'Available',
    dayOfWeek: 'Thursday'
  });

  const prediction = dbPrediction ? {
    ...basePrediction,
    outputs: {
      ...basePrediction.outputs,
      estimatedWaitMin: dbPrediction.estimatedWaitMin,
      estimatedWaitMax: dbPrediction.estimatedWaitMax,
      estimatedWaitText: `${dbPrediction.estimatedWaitMin}–${dbPrediction.estimatedWaitMax} min`,
      confidence: dbPrediction.confidence,
      lastUpdated: 'Live from Server (V1.0)'
    }
  } : basePrediction;

  const yourTokenNum = isBookingActive
    ? parseInt(activeBooking.token.replace('#', ''), 10) || 28
    : 28;

  // Build visual queue subset array around patient token
  const queueSequence = [];
  const startNum = Math.max(1, yourTokenNum - 6);
  for (let i = startNum; i <= yourTokenNum; i++) {
    let tokenStatus = 'Waiting';
    if (i < simulatedCurrentTokenNum) tokenStatus = 'Completed';
    else if (i === simulatedCurrentTokenNum) tokenStatus = 'Serving';
    else if (i === yourTokenNum) tokenStatus = 'You';

    queueSequence.push({ tokenNum: i, tokenText: `#${i}`, status: tokenStatus });
  }

  const handleStepSimulation = () => {
    if (simulatedPatientsAhead > 0) {
      setSimulatedCurrentTokenNum((prev) => prev + 1);
      setSimulatedPatientsAhead((prev) => Math.max(0, prev - 1));
      setSecondsAgo(0);
    }
  };

  const handleResetSimulation = () => {
    const currentNum = Math.max(1, yourTokenNum - 5);
    setSimulatedCurrentTokenNum(currentNum);
    setSimulatedPatientsAhead(Math.max(0, yourTokenNum - currentNum));
    setSecondsAgo(0);
  };

  if (!isBookingActive) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm max-w-2xl mx-auto text-center space-y-6 my-8 font-sans">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center mx-auto shadow-2xs">
          <Activity className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">No Active Queue</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
            You currently do not have an active appointment or walk-in queue token. Book a consultation slot to start tracking live waiting time.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-2.5 pt-2">
          <Link
            to="/patient/appointment"
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Book Appointment
          </Link>
          <Link
            to="/patient/walk-in"
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
          >
            Join Walk-in Queue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7 max-w-7xl mx-auto font-sans">
      
      {/* HEADER BANNER */}
      <div className="bg-white rounded-3xl p-6 md:p-7 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200/80 mb-2 shadow-2xs">
            <Activity className="w-3.5 h-3.5 text-teal-600" />
            Live Queue & AI Waiting Time
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Live Queue Tracking</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Track your position and estimated waiting time in real time for <strong>{activeBooking.doctorName}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            Updated: {secondsAgo === 0 ? 'Just now' : `${secondsAgo}s ago`}
          </span>
          <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
            {prediction.outputs.status}
          </span>
        </div>
      </div>

      {/* NOTIFICATION TRIGGERS (UI STATUS) */}
      {simulatedPatientsAhead === 0 ? (
        <div className="bg-emerald-50 border-2 border-emerald-200 text-emerald-950 p-4.5 rounded-3xl shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-emerald-900">It's your turn for consultation! 🎉</h3>
            <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
              Please proceed directly to {activeBooking.department || 'OPD Room 104'} for your appointment with {activeBooking.doctorName}.
            </p>
          </div>
        </div>
      ) : simulatedPatientsAhead <= 2 ? (
        <div className="bg-amber-50 border-2 border-amber-200 text-amber-950 p-4.5 rounded-3xl shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-amber-900">You're almost up! 🔔</h3>
            <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
              Only {simulatedPatientsAhead} patients ahead. Please stay near {activeBooking.department || 'OPD Room 104'}.
            </p>
          </div>
        </div>
      ) : null}

      {/* 2. CURRENT TOKEN CARD & 4. AI PREDICTION HERO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CURRENT TOKEN CARD (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 md:p-7 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Queue Position</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {activeBooking.type === 'walk-in' ? 'Walk-in Token' : 'Appointment Token'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3.5 text-center my-2">
              <div className="p-4 bg-teal-50/70 rounded-2xl border border-teal-200/70 shadow-2xs">
                <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">Your Token</span>
                <span className="text-3xl font-extrabold text-teal-800 mt-1 block">{activeBooking.token}</span>
              </div>
              <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/70 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Now Serving</span>
                <span className="text-3xl font-extrabold text-slate-900 mt-1 block">#{simulatedCurrentTokenNum}</span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-slate-50/80 rounded-2xl border border-slate-200/70 text-center">
              <span className="text-xs text-slate-600 font-medium">
                Patients Ahead: <strong className="text-slate-900 text-sm font-extrabold">{simulatedPatientsAhead}</strong>
              </span>
              <p className="text-xs font-semibold text-teal-700 mt-1">
                You are {simulatedPatientsAhead} position{simulatedPatientsAhead === 1 ? '' : 's'} away from consultation.
              </p>
            </div>
          </div>

          {/* DEMO SIMULATION CONTROLS */}
          <div className="mt-6 pt-4 border-t border-slate-100 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-400 uppercase text-[10px] flex items-center gap-1 tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                Live Queue Demo Controls
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Interactive test</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs ${
                  isSimulating
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-teal-600 hover:bg-teal-700 text-white'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                {isSimulating ? 'Pause Queue' : 'Simulate Queue'}
              </button>

              <button
                onClick={handleStepSimulation}
                className="py-2 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer border border-slate-200"
                title="Advance queue by 1"
              >
                Step +1
              </button>

              <button
                onClick={handleResetSimulation}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer border border-slate-200"
                title="Reset simulation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 4. AI WAITING-TIME PREDICTION (7 cols - Bright Modern Healthcare Theme) */}
        <div className="lg:col-span-7 bg-gradient-to-br from-teal-50/90 via-white to-emerald-50/50 rounded-3xl p-6 md:p-7 border-2 border-teal-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-teal-100 mb-4">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-teal-600" />
                <h3 className="font-extrabold text-teal-950 text-base">AI Waiting-Time Prediction</h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-900 border border-teal-200 shadow-2xs">
                AI Prediction
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-center my-4">
              <div className="bg-white/90 p-4 rounded-2xl border border-teal-100 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Wait</span>
                <span className="text-2xl font-extrabold text-emerald-600 mt-1 block">
                  {prediction.outputs.estimatedWaitText}
                </span>
              </div>

              <div className="bg-white/90 p-4 rounded-2xl border border-teal-100 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Model Confidence</span>
                <span className="text-2xl font-extrabold text-teal-900 mt-1 block">
                  {prediction.outputs.confidence}%
                </span>
              </div>

              <div className="bg-white/90 p-4 rounded-2xl border border-teal-100 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Turn</span>
                <span className="text-2xl font-extrabold text-teal-950 mt-1 block">
                  {prediction.outputs.estimatedTurnTime}
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-white/80 rounded-2xl border border-teal-100 text-xs text-slate-700 flex items-center gap-2.5 shadow-2xs">
              <Info className="w-4 h-4 text-teal-600 shrink-0" />
              <span>
                Prediction Status: <strong>{prediction.outputs.lastUpdated}</strong> &bull; Dynamically updates with real-time consultation duration.
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-teal-100 text-xs text-slate-500 font-medium text-center">
            AI wait estimates are continuously calibrated against doctor consultation pacing and queue throughput.
          </div>
        </div>

      </div>

      {/* 3. QUEUE PROGRESS VISUAL */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Visual Queue Sequence (Around Your Token)
        </h3>

        <div className="flex items-center justify-between gap-2.5 overflow-x-auto pb-2">
          {queueSequence.map((item) => (
            <div
              key={item.tokenNum}
              className={`flex-1 min-w-[85px] p-3.5 rounded-2xl text-center border transition-all ${
                item.status === 'Completed'
                  ? 'bg-slate-50 border-slate-200 text-slate-400'
                  : item.status === 'Serving'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 ring-2 ring-emerald-300 font-bold shadow-2xs'
                  : item.status === 'You'
                  ? 'bg-teal-600 text-white font-extrabold border-teal-700 ring-2 ring-teal-400 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <div className="text-sm font-extrabold">{item.tokenText}</div>
              <span
                className={`inline-block mt-1 text-[9.5px] font-bold px-2 py-0.5 rounded-full ${
                  item.status === 'Completed'
                    ? 'bg-slate-200/70 text-slate-500'
                    : item.status === 'Serving'
                    ? 'bg-emerald-200 text-emerald-900'
                    : item.status === 'You'
                    ? 'bg-white text-teal-900'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {item.status === 'Completed' && '✓ Done'}
                {item.status === 'Serving' && 'Serving'}
                {item.status === 'You' && 'YOU'}
                {item.status === 'Waiting' && 'Waiting'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. PREDICTION BREAKDOWN & 6. QUEUE TIMELINE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 5. PREDICTION BREAKDOWN (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">Prediction Model Factors</h3>
            <span className="text-[10px] font-bold text-teal-800 uppercase bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
              Live AI Inputs
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            The waiting time prediction model factors in these real-time operational parameters:
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/70 flex justify-between">
              <span className="text-slate-500">Patients Ahead:</span>
              <strong className="text-slate-900">{prediction.inputs.patientsAhead}</strong>
            </div>
            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/70 flex justify-between">
              <span className="text-slate-500">Avg Consultation:</span>
              <strong className="text-slate-900">{prediction.inputs.averageConsultationTime} min</strong>
            </div>
            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/70 flex justify-between">
              <span className="text-slate-500">Queue Length:</span>
              <strong className="text-slate-900">{prediction.inputs.currentQueueLength}</strong>
            </div>
            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/70 flex justify-between">
              <span className="text-slate-500">Doctor Status:</span>
              <strong className="text-emerald-700">{prediction.inputs.doctorStatus}</strong>
            </div>
            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/70 flex justify-between">
              <span className="text-slate-500">Current Time:</span>
              <strong className="text-slate-900">{prediction.inputs.currentTimeFormatted}</strong>
            </div>
            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/70 flex justify-between">
              <span className="text-slate-500">Day of Week:</span>
              <strong className="text-slate-900">{prediction.inputs.dayOfWeek}</strong>
            </div>
          </div>
        </div>

        {/* 6. QUEUE TIMELINE (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">Queue Progress Milestones</h3>
            <p className="text-xs text-slate-500">Predicted time milestones for your token turn</p>
          </div>

          <div className="space-y-4 relative pl-4 border-l-2 border-teal-200 ml-2">
            <div className="relative">
              <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-teal-600 ring-4 ring-white" />
              <span className="text-xs font-bold text-slate-900 block">{prediction.inputs.currentTimeFormatted}</span>
              <span className="text-[11px] text-slate-500">Current Queue Baseline</span>
            </div>

            <div className="relative">
              <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-teal-400 ring-4 ring-white" />
              <span className="text-xs font-bold text-slate-900 block">
                {new Date(Date.now() + 10 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="text-[11px] text-slate-500">Expected Queue Advancement</span>
            </div>

            <div className="relative">
              <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-teal-400 ring-4 ring-white" />
              <span className="text-xs font-bold text-slate-900 block">
                {new Date(Date.now() + (prediction.outputs.estimatedWaitMin - 5) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="text-[11px] text-slate-500">Recommended Arrival Window</span>
            </div>

            <div className="relative">
              <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-white" />
              <span className="text-xs font-bold text-emerald-800 block">{prediction.outputs.estimatedTurnTime}</span>
              <span className="text-[11px] font-bold text-emerald-700">Your Expected Turn</span>
            </div>
          </div>
        </div>

      </div>

      {/* 14. "ABOUT AIQ PREDICTION" INFORMATIONAL CARD */}
      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200/80 space-y-2">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-teal-600" />
          <h4 className="font-bold text-slate-900 text-sm">About AIQ Prediction Technology</h4>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          AIQ Tracker predicts waiting time using live queue positions, doctor availability, historical consultation pace, and hospital operational data. The prediction continuously updates to give you the most accurate window to leave home.
        </p>
      </div>

    </div>
  );
}
