import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Stethoscope,
  Users,
  Activity,
  Sparkles,
  MapPin
} from 'lucide-react';
import { doctorService } from '../../services/doctorService';
import { appointmentService } from '../../services/appointmentService';
import { useAuth } from '../../context/AuthContext';

export default function PatientWalkInPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const patientName = user?.name || 'Nisha Sharma';

  const [step, setStep] = useState(1); // 1: Select | 2: Confirm | 3: Success
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [error, setError] = useState('');
  const [confirmedWalkIn, setConfirmedWalkIn] = useState(null);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const data = await doctorService.getAll();
        // Only list active/available doctors for walk-ins
        setDoctors(data.filter(d => d.isAvailableToday));
      } catch (err) {
        setError(err.message || 'Failed to load available doctors.');
      } finally {
        setLoadingDoctors(false);
      }
    };
    loadDoctors();
  }, []);

  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (!selectedDoctor) {
      setError('Please select a doctor to join their walk-in queue.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleConfirmWalkIn = async () => {
    if (!user?.id) {
      setError('You must be logged in to join the queue.');
      return;
    }
    setError('');
    try {
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toTimeString().split(' ')[0]; // HH:MM:SS
      const walkInRecord = await appointmentService.create({
        patientId: user.id,
        doctorId: selectedDoctor.id,
        date: dateStr,
        time: timeStr,
        type: 'walk-in'
      });

      setConfirmedWalkIn(walkInRecord);
      setStep(3);
    } catch (err) {
      setError(err.message || 'Failed to join walk-in queue.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 md:p-7 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200/80 mb-2 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            Walk-in OPD Registration
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Join Walk-in Queue</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Join the OPD consultation queue immediately without a scheduled slot</p>
        </div>
        <span className="px-3.5 py-1 bg-teal-50 text-teal-800 rounded-full text-xs font-bold border border-teal-200 self-start sm:self-center shadow-2xs">
          Instant OPD Token
        </span>
      </div>

      {/* Validation Error */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 shadow-2xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: SELECT DOCTOR & VIEW QUEUE STATS */}
      {step === 1 && (
        <form onSubmit={handleStep1Submit} className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 1 — Choose Clinical Specialist</h3>

          {loadingDoctors ? (
            <div className="p-10 text-center bg-white border border-slate-200 rounded-3xl text-slate-400 font-medium text-xs">
              Loading available hospital doctors...
            </div>
          ) : doctors.length === 0 ? (
            <div className="p-10 text-center bg-white border border-slate-200 rounded-3xl text-slate-400 font-medium text-xs">
              No doctors are currently available for walk-in OPD queue today.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {doctors.map((doc) => {
                const isSelected = selectedDoctor?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => { setSelectedDoctor(doc); setError(''); }}
                    className={`bg-white rounded-3xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-teal-600 ring-2 ring-teal-500 shadow-md bg-teal-50/20'
                        : 'border-slate-200/90 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center shadow-2xs">
                          <Stethoscope className="w-5 h-5" />
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs ${
                          doc.isAvailableToday
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          {doc.availability}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-slate-900 text-base">{doc.name}</h4>
                      <p className="text-xs font-semibold text-teal-700 mb-2">{doc.specialization}</p>

                      {/* Live Queue Overview Badge */}
                      <div className="mt-3 p-3 bg-slate-50/80 rounded-2xl border border-slate-200/70 space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-medium text-[11px]">Currently Serving:</span>
                          <span className="font-extrabold text-slate-900">{doc.currentToken}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-medium text-[11px]">Patients Waiting:</span>
                          <span className="font-extrabold text-teal-700">{doc.patientsWaiting}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-medium text-[11px]">Est. Initial Wait:</span>
                          <span className="font-bold text-slate-800">{doc.estimatedWaitMinutes} min</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-medium">{doc.room}</span>
                      <button
                        type="button"
                        className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors ${
                          isSelected
                            ? 'bg-teal-600 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected ? 'Selected ✓' : 'Select'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            >
              Continue to Confirm
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: CONFIRM WALK-IN */}
      {step === 2 && selectedDoctor && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 2 — Confirm Walk-in Queue Entry</h3>

          <div className="bg-white rounded-3xl p-6 md:p-7 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Walk-in Overview</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                Instant OPD Request
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/70 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Assigned Doctor</span>
                <span className="font-extrabold text-slate-900 text-sm block">{selectedDoctor.name}</span>
                <p className="text-xs text-teal-700 font-semibold">{selectedDoctor.specialization}</p>
              </div>

              <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/70 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Consultation Room</span>
                <span className="font-extrabold text-slate-900 text-sm block">{selectedDoctor.room}</span>
                <p className="text-xs text-slate-500 font-medium">OPD Wing, Kole Hospital</p>
              </div>

              <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/70 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Patients Ahead</span>
                <span className="font-extrabold text-teal-700 text-sm block">{selectedDoctor.patientsWaiting} Patients</span>
              </div>

              <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/70 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Initial AI Wait Estimate</span>
                <span className="font-extrabold text-slate-900 text-sm block">~{selectedDoctor.estimatedWaitMinutes} minutes</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={handleConfirmWalkIn}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirm & Generate Token
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SUCCESS CONFIRMATION */}
      {step === 3 && confirmedWalkIn && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-2xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Walk-in Token Issued!</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
              Your OPD token has been registered in the live hospital queue system.
            </p>
          </div>

          <div className="p-6 bg-gradient-to-br from-teal-50/90 via-white to-emerald-50/50 rounded-3xl border-2 border-teal-200 max-w-sm mx-auto shadow-xs">
            <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block">Your Live Token</span>
            <span className="text-4xl font-extrabold text-teal-950 mt-1 block tracking-tight">
              {confirmedWalkIn.token}
            </span>
            <div className="mt-3 pt-3 border-t border-teal-100 text-xs text-slate-600">
              <span>{selectedDoctor.name} &bull; {selectedDoctor.room}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
            <Link
              to="/patient/queue"
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors inline-flex items-center justify-center gap-1.5"
            >
              <Activity className="w-4 h-4" />
              Track in Live Queue
            </Link>
            <Link
              to="/patient/dashboard"
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors inline-flex items-center justify-center"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
