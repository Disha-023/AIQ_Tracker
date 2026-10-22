import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, CheckCircle2, Ticket, AlertCircle, RefreshCw, Stethoscope, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { patientService } from '../../services/patientService';
import { doctorService } from '../../services/doctorService';
import { queueService } from '../../services/queueService';

export default function ReceptionistRegisterPatientPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    dob: '',
    gender: 'Male',
    address: '',
    emergencyContact: ''
  });

  // Doctor & OPD Token Assignment State
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [issueToken, setIssueToken] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  // Workflow Outcome States
  const [loading, setLoading] = useState(false);
  const [retryLoading, setRetryLoading] = useState(false);
  const [error, setError] = useState('');
  const [tokenError, setTokenError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [partialSuccess, setPartialSuccess] = useState(false);

  // Persisted response data from actual backend
  const [assignedPatient, setAssignedPatient] = useState(null); // { id, name }
  const [tokenResult, setTokenResult] = useState(null); // { token, token_number, status, doctorName, specialization, room }

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const allDocs = await doctorService.getAll();
        const available = allDocs.filter(d => d.isAvailableToday);
        const docsToUse = available.length > 0 ? available : allDocs;
        setDoctors(docsToUse);
        if (docsToUse.length > 0) {
          setSelectedDoctorId(docsToUse[0].id);
        }
      } catch (err) {
        console.error('Failed to load doctors list:', err);
      } finally {
        setLoadingDoctors(false);
      }
    };
    loadDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTokenError('');
    setPartialSuccess(false);

    let createdPatient = null;

    // Step 1: Register Patient Master Record
    try {
      const payload = {
        name: formData.fullName.trim(),
        dob: formData.dob || null,
        gender: formData.gender,
        mobile: formData.mobile.trim(),
        address: formData.address || null,
        email: formData.email || null,
        emergency_contact: formData.emergencyContact || null
      };

      const newPatient = await patientService.create(payload);
      createdPatient = {
        id: newPatient.patient_id || newPatient.id,
        name: newPatient.name || formData.fullName.trim()
      };
      setAssignedPatient(createdPatient);
    } catch (err) {
      setError(err.message || 'Failed to register patient record.');
      setLoading(false);
      return;
    }

    // Step 2: Issue Walk-in Queue Token if requested
    if (issueToken && selectedDoctorId) {
      try {
        const qEntry = await queueService.join({
          patientId: createdPatient.id,
          doctorId: selectedDoctorId,
          type: 'walk-in',
          priority: 'NORMAL'
        });

        const docObj = doctors.find(d => d.id === selectedDoctorId);
        setTokenResult({
          ...qEntry,
          doctorName: docObj ? docObj.name : qEntry.doctorName || 'Assigned Doctor',
          specialization: docObj?.specialization || 'OPD',
          room: docObj?.room || 'General OPD'
        });
        setSubmitted(true);
      } catch (qErr) {
        // Patient registration was saved, but token issuance failed
        console.error('Token issuance failed after successful registration:', qErr);
        setPartialSuccess(true);
        setTokenError(qErr.message || 'Failed to issue walk-in queue token.');
      }
    } else {
      // Demographic registration completed without queue token
      setSubmitted(true);
    }

    setLoading(false);
  };

  const handleRetryToken = async () => {
    if (!assignedPatient?.id || !selectedDoctorId) return;
    setRetryLoading(true);
    setTokenError('');
    try {
      const qEntry = await queueService.join({
        patientId: assignedPatient.id,
        doctorId: selectedDoctorId,
        type: 'walk-in',
        priority: 'NORMAL'
      });

      const docObj = doctors.find(d => d.id === selectedDoctorId);
      setTokenResult({
        ...qEntry,
        doctorName: docObj ? docObj.name : qEntry.doctorName || 'Assigned Doctor',
        specialization: docObj?.specialization || 'OPD',
        room: docObj?.room || 'General OPD'
      });
      setPartialSuccess(false);
      setSubmitted(true);
    } catch (err) {
      setTokenError(err.message || 'Retry token issuance failed.');
    } finally {
      setRetryLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setPartialSuccess(false);
    setError('');
    setTokenError('');
    setAssignedPatient(null);
    setTokenResult(null);
    setFormData({
      fullName: '',
      mobile: '',
      email: '',
      dob: '',
      gender: 'Male',
      address: '',
      emergencyContact: ''
    });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto font-sans">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        
        {/* Header Banner */}
        <div className="flex items-center gap-3.5 mb-6 pb-5 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold border border-teal-100">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-[10px] font-bold mb-1">
              <span>Front Desk Intake</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Hospital Patient Registration</h1>
            <p className="text-xs text-slate-500 mt-0.5">Register walk-in patients and instantly issue active OPD queue tokens</p>
          </div>
        </div>

        {/* Global Error Alert */}
        {error && (
          <div className="mb-5 p-4 bg-red-50 text-red-700 text-xs rounded-2xl font-bold border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. PARTIAL SUCCESS STATE (Registration Succeeded, Token Failed) */}
        {partialSuccess && assignedPatient && (
          <div className="py-6 space-y-6 animate-in fade-in duration-200">
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Patient Registered Successfully</span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed">
                Master record for <strong className="font-extrabold">{assignedPatient.name}</strong> was created in the hospital database.
                Assigned Patient ID: <strong className="font-mono text-sm px-2 py-0.5 bg-white rounded-md border border-emerald-300 ml-1">{assignedPatient.id}</strong>
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>Walk-in Token Issuance Pending</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                {tokenError || 'Could not connect the patient to the live OPD queue. The patient master record is preserved.'}
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 items-center">
                <div className="w-full sm:w-auto flex-1">
                  <select
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-amber-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {doctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} — {doc.specialization} ({doc.room || 'General OPD'})
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={handleRetryToken}
                  disabled={retryLoading}
                  className="w-full sm:w-auto px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${retryLoading ? 'animate-spin' : ''}`} />
                  {retryLoading ? 'Retrying...' : 'Retry Token Issuance'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <Link
                to="/reception/queue"
                className="text-xs font-bold text-teal-700 hover:text-teal-900 transition-colors inline-flex items-center gap-1"
              >
                Go to Queue Management Desk &rarr;
              </Link>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 underline"
              >
                Register Another Patient
              </button>
            </div>
          </div>
        )}

        {/* 2. FULL SUCCESS STATE (Registration & Token Both Successful) */}
        {submitted && assignedPatient && (
          <div className="py-8 text-center space-y-6 animate-in fade-in duration-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100 shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">Intake Completed</span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">Patient Registered & Token Issued</h2>
              <p className="text-xs text-slate-500 mt-1">Walk-in patient is active in today's live OPD consultation roster</p>
            </div>

            {/* Token & Patient Telemetry Card */}
            <div className="bg-slate-50/80 p-6 rounded-3xl border border-slate-200/90 max-w-md mx-auto text-left space-y-4 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Patient Name</span>
                  <strong className="text-sm font-black text-slate-900 block">{assignedPatient.name}</strong>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Patient ID</span>
                  <span className="text-xs font-bold font-mono text-teal-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    {assignedPatient.id}
                  </span>
                </div>
              </div>

              {tokenResult ? (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">Generated Token</span>
                      <strong className="text-2xl font-black text-teal-900 font-mono">{tokenResult.token}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">Queue Status</span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-teal-200 text-teal-800 text-[11px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {tokenResult.status || 'WAITING'}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-2xl border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Assigned Doctor:</span>
                      <strong className="text-slate-900">{tokenResult.doctorName}</strong>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Room / Department:</span>
                      <span>{tokenResult.room} ({tokenResult.specialization})</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
                  Registered without immediate token issuance. You can generate a token at any time from the Queue desk.
                </p>
              )}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/reception/queue"
                className="w-full sm:w-auto px-6 py-3.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-xs rounded-2xl shadow-md transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Ticket className="w-4 h-4" />
                View in Live OPD Queue &rarr;
              </Link>
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-2xl border border-slate-200 shadow-2xs transition-all cursor-pointer"
              >
                Register Another Patient
              </button>
            </div>
          </div>
        )}

        {/* 3. INTAKE FORM (When not submitted and not in partial success) */}
        {!submitted && !partialSuccess && (
          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            
            {/* Demographic Information Sub-Section */}
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-2 h-2 rounded-full bg-teal-600" />
                <span>Patient Demographics</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Ramesh Kulkarni"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ramesh@example.com"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all font-bold text-slate-800"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Residential Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Street name, City, Pincode"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Emergency Contact Number
                  </label>
                  <input
                    type="tel"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    placeholder="Emergency mobile number"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* SEPARATED SECTION: OPD VISIT & TOKEN ASSIGNMENT */}
            <div className="p-5 rounded-2xl bg-teal-50/50 border border-teal-200/80 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-teal-100">
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-teal-600" />
                  <span className="font-extrabold text-teal-950 text-xs uppercase tracking-wider">
                    OPD Visit & Token Assignment
                  </span>
                </div>
                <label className="inline-flex items-center gap-2 text-xs font-bold text-teal-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={issueToken}
                    onChange={(e) => setIssueToken(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
                  />
                  <span>Issue Walk-in Queue Token Now</span>
                </label>
              </div>

              {issueToken ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-teal-900 uppercase tracking-wider mb-1.5">
                      Assign OPD Doctor *
                    </label>
                    {loadingDoctors ? (
                      <p className="text-xs text-slate-400 py-2">Loading available hospital doctors...</p>
                    ) : doctors.length === 0 ? (
                      <p className="text-xs text-rose-600 py-2">No active doctors found in system roster.</p>
                    ) : (
                      <select
                        value={selectedDoctorId}
                        onChange={(e) => setSelectedDoctorId(e.target.value)}
                        required={issueToken}
                        className="w-full px-4 py-3 bg-white border border-teal-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs"
                      >
                        {doctors.map((doc) => (
                          <option key={doc.id} value={doc.id}>
                            {doc.name} — {doc.specialization} ({doc.room || 'General OPD'})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <p className="text-[11px] text-teal-700/90 flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    Submitting will immediately place the patient into the live waiting room queue with a numbered token.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  Patient will be registered in the master directory only. No active queue token will be created today.
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                All fields marked * are required for registration.
              </span>
              <button
                type="submit"
                disabled={loading}
                className="py-3.5 px-7 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-xs rounded-2xl shadow-md hover:shadow-teal-600/20 transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing Intake...</span>
                  </>
                ) : issueToken ? (
                  <>
                    <Ticket className="w-3.5 h-3.5" />
                    <span>Register & Issue OPD Token</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Register Patient Record</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
