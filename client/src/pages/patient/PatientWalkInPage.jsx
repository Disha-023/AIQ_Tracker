import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Stethoscope,
  Users,
  Activity
} from 'lucide-react';
import { doctorsMockData } from '../../data/doctorsMockData';
import { appointmentService } from '../../services/appointmentService';
import { useAuth } from '../../context/AuthContext';

export default function PatientWalkInPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const patientName = user?.name || 'Nisha Sharma';

  const [step, setStep] = useState(1); // 1: Select | 2: Confirm | 3: Success
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [error, setError] = useState('');
  const [confirmedWalkIn, setConfirmedWalkIn] = useState(null);

  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (!selectedDoctor) {
      setError('Please select a doctor to join their walk-in queue.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleConfirmWalkIn = () => {
    const walkInRecord = appointmentService.createWalkIn({
      patientName,
      doctor: selectedDoctor
    });

    setConfirmedWalkIn(walkInRecord);
    setStep(3);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Join Walk-in Queue</h1>
          <p className="text-xs text-slate-500 mt-0.5">Join the OPD consultation queue without a prior appointment</p>
        </div>
        <span className="px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-xs font-bold border border-blue-200 hidden sm:inline">
          Walk-in OPD Token
        </span>
      </div>

      {/* Validation Error */}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: SELECT DOCTOR & VIEW QUEUE STATS */}
      {step === 1 && (
        <form onSubmit={handleStep1Submit} className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Step 1 — Select Doctor</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {doctorsMockData.map((doc) => {
              const isSelected = selectedDoctor?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => { setSelectedDoctor(doc); setError(''); }}
                  className={`bg-white rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 ring-2 ring-blue-500 shadow-md bg-blue-50/20'
                      : 'border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                        <Stethoscope className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        doc.isAvailableToday
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border-amber-200'
                      }`}>
                        {doc.availability}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-base">{doc.name}</h4>
                    <p className="text-xs font-semibold text-blue-700 mb-2">{doc.specialization}</p>

                    {/* Live Queue Overview Badge */}
                    <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-semibold">Current Serving Token:</span>
                        <span className="font-bold text-slate-900">{doc.currentToken}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-semibold">Patients Waiting:</span>
                        <span className="font-bold text-blue-700">{doc.patientsWaiting}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-semibold">Estimated Initial Wait:</span>
                        <span className="font-bold text-slate-800">{doc.estimatedWaitMinutes} min</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">{doc.room}</span>
                    <button
                      type="button"
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white'
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

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              Join Queue
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: CONFIRM WALK-IN */}
      {step === 2 && selectedDoctor && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Step 2 — Confirm Walk-in Queue Entry</h3>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase">Walk-in Summary</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                Walk-in Token Request
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <span className="text-slate-500 text-xs font-semibold block">Doctor Name</span>
                <span className="font-bold text-slate-900 text-base">{selectedDoctor.name}</span>
                <p className="text-xs text-blue-700 font-medium">{selectedDoctor.specialization}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 text-xs font-semibold block">Department & Room</span>
                <span className="font-bold text-slate-900 text-base">{selectedDoctor.room}</span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 text-xs font-semibold block">Current Queue Position</span>
                <span className="font-bold text-blue-700 text-base">{selectedDoctor.patientsWaiting} Patients Ahead</span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 text-xs font-semibold block">Estimated Wait Time</span>
                <span className="font-bold text-slate-900 text-base">~{selectedDoctor.estimatedWaitMinutes} minutes</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={handleConfirmWalkIn}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirm & Join Queue
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SUCCESS CONFIRMATION */}
      {step === 3 && confirmedWalkIn && (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center max-w-xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-widest block">Successfully Joined Queue ✓</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Token {confirmedWalkIn.token}</h2>
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-left space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 font-semibold">Doctor:</span>
              <span className="font-bold text-slate-900">{confirmedWalkIn.doctorName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 font-semibold">Patients Ahead:</span>
              <span className="font-bold text-blue-700">{confirmedWalkIn.patientsAhead} Patients</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 font-semibold">Estimated Initial Wait:</span>
              <span className="font-bold text-slate-900">{confirmedWalkIn.estimatedWait}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-semibold">Queue Status:</span>
              <span className="font-bold text-blue-700">{confirmedWalkIn.status}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/patient/queue"
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors text-center"
            >
              Track Live Queue
            </Link>
            <Link
              to="/patient/dashboard"
              className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors text-center"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
