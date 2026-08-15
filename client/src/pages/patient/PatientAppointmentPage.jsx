import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Stethoscope,
  Sparkles,
  XCircle
} from 'lucide-react';
import { doctorsMockData } from '../../data/doctorsMockData';
import { appointmentService } from '../../services/appointmentService';
import { useAuth } from '../../context/AuthContext';

export default function PatientAppointmentPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const patientName = user?.name || 'Nisha Sharma';

  const [activeBooking, setActiveBooking] = useState(null);

  // Form State
  const [step, setStep] = useState(1); // 1: Doctor | 2: Date | 3: Time | 4: Review | 5: Confirmation
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [error, setError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    const booking = appointmentService.getActiveBooking();
    if (booking && booking.status !== 'Cancelled') {
      setActiveBooking(booking);
    }
  }, []);

  const handleSelectDoctor = (doc) => {
    setSelectedDoctor(doc);
    setError('');
  };

  const handleStep1Continue = () => {
    if (!selectedDoctor) {
      setError('Please select a doctor to proceed.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleStep2Continue = () => {
    if (!selectedDate) {
      setError('Please select an appointment date.');
      return;
    }
    setError('');
    setStep(3);
  };

  const handleStep3Continue = () => {
    if (!selectedTime) {
      setError('Please select an available time slot.');
      return;
    }
    setError('');
    setStep(4);
  };

  const handleConfirmAppointment = () => {
    const newBooking = appointmentService.createAppointment({
      patientName,
      doctor: selectedDoctor,
      date: selectedDate,
      time: selectedTime
    });

    setConfirmedBooking(newBooking);
    setActiveBooking(newBooking);
    setStep(5);
  };

  const handleCancelActiveBooking = () => {
    appointmentService.cancelBooking();
    setActiveBooking(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Existing Active Booking Warning Guard */}
      {activeBooking && step < 5 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-amber-900">You already have an active booking</h3>
                <p className="text-xs text-amber-700 mt-1">
                  Active Token <strong>{activeBooking.token}</strong> for <strong>{activeBooking.doctorName}</strong> ({activeBooking.date} at {activeBooking.time}).
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                to="/patient/queue"
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                Track Queue
              </Link>
              <button
                onClick={handleCancelActiveBooking}
                className="px-3 py-1.5 bg-white hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Cancel Existing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Book an Appointment</h1>
          <p className="text-xs text-slate-500 mt-0.5">Select doctor, date, and time slot for OPD consultation</p>
        </div>
        <span className="px-3 py-1 bg-teal-50 text-teal-800 rounded-full text-xs font-bold border border-teal-200 hidden sm:inline">
          Step {step} of 5
        </span>
      </div>

      {/* 5-Step Visible Progress Indicator */}
      {step < 5 && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            
            <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-teal-700 font-bold' : ''}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-teal-600 text-white' : 'bg-slate-200'}`}>1</span>
              <span>Doctor</span>
            </div>

            <div className={`h-0.5 flex-1 mx-2 ${step >= 2 ? 'bg-teal-600' : 'bg-slate-200'}`} />

            <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-teal-700 font-bold' : ''}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-teal-600 text-white' : 'bg-slate-200'}`}>2</span>
              <span>Date</span>
            </div>

            <div className={`h-0.5 flex-1 mx-2 ${step >= 3 ? 'bg-teal-600' : 'bg-slate-200'}`} />

            <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-teal-700 font-bold' : ''}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-teal-600 text-white' : 'bg-slate-200'}`}>3</span>
              <span>Time</span>
            </div>

            <div className={`h-0.5 flex-1 mx-2 ${step >= 4 ? 'bg-teal-600' : 'bg-slate-200'}`} />

            <div className={`flex items-center gap-1.5 ${step >= 4 ? 'text-teal-700 font-bold' : ''}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 4 ? 'bg-teal-600 text-white' : 'bg-slate-200'}`}>4</span>
              <span>Review</span>
            </div>

          </div>
        </div>
      )}

      {/* Validation Error Alert */}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: SELECT DOCTOR */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Step 1 — Select Doctor</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {doctorsMockData.map((doc) => {
              const isSelected = selectedDoctor?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => handleSelectDoctor(doc)}
                  className={`bg-white rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-teal-600 ring-2 ring-teal-500 shadow-md bg-teal-50/20'
                      : 'border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
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
                    <p className="text-xs font-semibold text-teal-700 mb-2">{doc.specialization}</p>
                    <p className="text-xs text-slate-500">{doc.room} &bull; {doc.experience}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-medium">★ {doc.rating} Rating</span>
                    <button
                      type="button"
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-teal-600 text-white'
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
              onClick={handleStep1Continue}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SELECT DATE */}
      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Step 2 — Select Date for {selectedDoctor?.name}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Today', date: '13 August 2026', sub: '13 Aug' },
              { label: 'Tomorrow', date: '14 August 2026', sub: '14 Aug' },
              { label: 'Saturday', date: '15 August 2026', sub: '15 Aug' }
            ].map((item) => {
              const isSelected = selectedDate === item.date;
              return (
                <div
                  key={item.date}
                  onClick={() => { setSelectedDate(item.date); setError(''); }}
                  className={`bg-white p-5 rounded-2xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-teal-600 ring-2 ring-teal-500 shadow-md bg-teal-50/20'
                      : 'border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <Calendar className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-teal-600' : 'text-slate-400'}`} />
                  <span className="text-xs font-bold text-slate-500 block uppercase">{item.label}</span>
                  <div className="text-lg font-extrabold text-slate-900 mt-1">{item.sub}</div>
                  <span className="text-xs text-slate-500 block mt-1">{item.date}</span>
                </div>
              );
            })}
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
              onClick={handleStep2Continue}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SELECT TIME */}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Step 3 — Select Time Slot for {selectedDate}
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {selectedDoctor?.timeSlots.map((slot) => {
              const isSelected = selectedTime === slot.time;
              const isUnavailable = slot.status === 'Unavailable';
              return (
                <div
                  key={slot.time}
                  onClick={() => {
                    if (isUnavailable) {
                      setError('Selected slot is unavailable. Please choose another time.');
                      return;
                    }
                    setSelectedTime(slot.time);
                    setError('');
                  }}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    isUnavailable
                      ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                      : isSelected
                      ? 'bg-teal-50 border-teal-600 ring-2 ring-teal-500 shadow-xs cursor-pointer'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs cursor-pointer'
                  }`}
                >
                  <Clock className={`w-4 h-4 mx-auto mb-1.5 ${isSelected ? 'text-teal-600' : 'text-slate-400'}`} />
                  <span className="text-base font-bold text-slate-900 block">{slot.time}</span>
                  <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded ${
                    slot.status === 'Available'
                      ? 'bg-emerald-100 text-emerald-800'
                      : slot.status === 'Few Slots'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {slot.status}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={handleStep3Continue}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW */}
      {step === 4 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Step 4 — Review Summary</h3>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase">Consultation Details</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                Ready to Confirm
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <span className="text-slate-500 text-xs font-semibold block">Doctor</span>
                <span className="font-bold text-slate-900 text-base">{selectedDoctor?.name}</span>
                <p className="text-xs text-teal-700 font-medium">{selectedDoctor?.specialization}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 text-xs font-semibold block">Date & Time</span>
                <span className="font-bold text-slate-900 text-base">{selectedDate}</span>
                <p className="text-xs text-slate-700 font-semibold">{selectedTime}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 text-xs font-semibold block">Patient Name</span>
                <span className="font-bold text-slate-900">{patientName}</span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 text-xs font-semibold block">Hospital Room</span>
                <span className="font-bold text-slate-900">{selectedDoctor?.room}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(3)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={handleConfirmAppointment}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirm Appointment
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: CONFIRMATION SUCCESS SCREEN */}
      {step === 5 && confirmedBooking && (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center max-w-xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block">Appointment Confirmed ✓</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Token {confirmedBooking.token}</h2>
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-left space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 font-semibold">Doctor:</span>
              <span className="font-bold text-slate-900">{confirmedBooking.doctorName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 font-semibold">Date:</span>
              <span className="font-bold text-slate-900">{confirmedBooking.date}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 font-semibold">Time:</span>
              <span className="font-bold text-slate-900">{confirmedBooking.time}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-semibold">Status:</span>
              <span className="font-bold text-emerald-700">{confirmedBooking.status}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/patient/queue"
              className="flex-1 py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors text-center"
            >
              Track My Queue
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
