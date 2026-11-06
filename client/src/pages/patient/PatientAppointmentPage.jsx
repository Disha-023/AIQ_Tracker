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
  XCircle,
  MapPin,
  Star
} from 'lucide-react';
import { doctorService } from '../../services/doctorService';
import { appointmentService } from '../../services/appointmentService';
import { useAuth } from '../../context/AuthContext';

function generateSlots(availableFrom, availableTo, intervalMinutes = 30) {
  if (!availableFrom || !availableTo) {
    // Fallback default slots if doctor hours are not defined
    return [
      "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
      "12:00 PM", "12:30 PM", "02:00 PM", "02:30 PM",
      "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
    ];
  }
  
  const parseTimeToMinutes = (tStr) => {
    const parts = tStr.split(':');
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  };
  
  const startMins = parseTimeToMinutes(availableFrom);
  const endMins = parseTimeToMinutes(availableTo);
  
  const slots = [];
  for (let m = startMins; m < endMins; m += intervalMinutes) {
    const hour24 = Math.floor(m / 60);
    const mins = m % 60;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    const displayHour = hour24 % 12 === 0 ? 12 : hour24 % 12;
    const displayMins = String(mins).padStart(2, '0');
    slots.push(`${String(displayHour).padStart(2, '0')}:${displayMins} ${ampm}`);
  }
  return slots;
}

export default function PatientAppointmentPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const patientName = user?.name || 'Nisha Sharma';

  const [activeBooking, setActiveBooking] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  // Form State
  const [step, setStep] = useState(1); // 1: Doctor | 2: Date | 3: Time | 4: Review | 5: Confirmation
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [error, setError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    if (!selectedDoctor || !selectedDate) {
      setAvailableSlots([]);
      return;
    }

    const fetchAvailability = async () => {
      setLoadingSlots(true);
      setError('');
      try {
        const data = await appointmentService.getAll({ doctorId: selectedDoctor.id });
        const generated = generateSlots(selectedDoctor.available_from, selectedDoctor.available_to, selectedDoctor.average_consultation_time || 30);
        const bookedAppointments = data.filter(apt => apt.date === selectedDate && apt.status !== 'Cancelled');
        
        const slotsWithStatus = generated.map(slotTime => {
          const isBooked = bookedAppointments.some(apt => apt.time.trim() === slotTime.trim());
          return {
            time: slotTime,
            status: isBooked ? 'Unavailable' : 'Available'
          };
        });
        
        setAvailableSlots(slotsWithStatus);
      } catch (err) {
        console.error('Failed to fetch availability:', err);
        setError('Failed to load available time slots.');
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchAvailability();
  }, [selectedDoctor, selectedDate]);

  useEffect(() => {
    const fetchActive = async () => {
      if (!user?.id) return;
      try {
        const booking = await appointmentService.getActiveBooking(user.id);
        if (booking && booking.status !== 'Cancelled') {
          setActiveBooking(booking);
        }
      } catch (err) {
        console.error('Failed to load active booking:', err);
      }
    };

    const loadDoctors = async () => {
      try {
        const data = await doctorService.getAll();
        // Only list active doctors for appointments
        setDoctors(data.filter(d => d.status === 'Active'));
      } catch (err) {
        setError(err.message || 'Failed to load doctors.');
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchActive();
    loadDoctors();
  }, [user]);

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

  const handleConfirmAppointment = async () => {
    if (!user?.id) {
      setError('You must be logged in to book an appointment.');
      return;
    }
    setError('');
    try {
      const newBooking = await appointmentService.create({
        patientId: user.id,
        doctorId: selectedDoctor.id,
        date: selectedDate,
        time: selectedTime,
        type: 'appointment'
      });

      setConfirmedBooking(newBooking);
      setActiveBooking(newBooking);
      setStep(5);
    } catch (err) {
      setError(err.message || 'Failed to book appointment.');
    }
  };

  const handleCancelActiveBooking = async () => {
    if (!activeBooking) return;
    try {
      await appointmentService.update(activeBooking.id, { status: 'Cancelled' });
      setActiveBooking(null);
    } catch (err) {
      console.error('Failed to cancel active booking:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Existing Active Booking Warning Guard */}
      {activeBooking && step < 5 && (
        <div className="bg-amber-50/90 border border-amber-200/80 rounded-3xl p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-950">You have an active appointment scheduled</h3>
                <p className="text-xs sm:text-sm text-amber-800 mt-0.5">
                  Token <strong className="font-mono">{activeBooking.token}</strong> with <strong>{activeBooking.doctorName}</strong> ({activeBooking.date} at {activeBooking.time}).
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
              <Link
                to="/patient/queue"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                Track Live Queue
              </Link>
              <button
                onClick={handleCancelActiveBooking}
                className="px-4 py-2 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/60 text-teal-800 text-xs font-semibold mb-2">
            <Calendar className="w-3.5 h-3.5 text-teal-600" />
            OPD Scheduling
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Book an Appointment</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Select your preferred physician, appointment date, and available consultation slot.</p>
        </div>
        <span className="self-start sm:self-center px-4 py-1.5 bg-slate-50 text-slate-700 rounded-full text-xs font-bold border border-slate-200 shadow-2xs">
          Step {step} of 5
        </span>
      </div>

      {/* 5-Step Visible Progress Indicator */}
      {step < 5 && (
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-teal-700 font-bold' : ''}`}>
              <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shadow-2xs ${step >= 1 ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'}`}>1</span>
              <span className="hidden sm:inline">Doctor</span>
            </div>

            <div className={`h-0.5 flex-1 mx-2 sm:mx-3 ${step >= 2 ? 'bg-teal-600' : 'bg-slate-200'}`} />

            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-teal-700 font-bold' : ''}`}>
              <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shadow-2xs ${step >= 2 ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'}`}>2</span>
              <span className="hidden sm:inline">Date</span>
            </div>

            <div className={`h-0.5 flex-1 mx-2 sm:mx-3 ${step >= 3 ? 'bg-teal-600' : 'bg-slate-200'}`} />

            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-teal-700 font-bold' : ''}`}>
              <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shadow-2xs ${step >= 3 ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'}`}>3</span>
              <span className="hidden sm:inline">Time</span>
            </div>

            <div className={`h-0.5 flex-1 mx-2 sm:mx-3 ${step >= 4 ? 'bg-teal-600' : 'bg-slate-200'}`} />

            <div className={`flex items-center gap-2 ${step >= 4 ? 'text-teal-700 font-bold' : ''}`}>
              <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shadow-2xs ${step >= 4 ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'}`}>4</span>
              <span className="hidden sm:inline">Review</span>
            </div>
          </div>
        </div>
      )}

      {/* Validation Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold flex items-center gap-2.5 shadow-2xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: SELECT DOCTOR */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 1 — Choose Specialist</h3>
            <span className="text-xs text-slate-500">{doctors.length} Doctors available</span>
          </div>

          {loadingDoctors ? (
            <div className="p-12 text-center bg-white border border-slate-200/90 rounded-3xl text-slate-400 font-semibold shadow-xs">
              Loading available hospital doctors...
            </div>
          ) : doctors.length === 0 ? (
            <div className="p-12 text-center bg-white border border-slate-200/90 rounded-3xl text-slate-400 font-semibold shadow-xs">
              No active doctors currently available.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {doctors.map((doc) => {
                const isSelected = selectedDoctor?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => handleSelectDoctor(doc)}
                    className={`bg-white rounded-3xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-teal-600 ring-2 ring-teal-500/30 shadow-md bg-teal-50/20'
                        : 'border-slate-200/90 hover:border-teal-200 shadow-xs'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200/60 flex items-center justify-center shrink-0">
                          <Stethoscope className="w-5 h-5" />
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          doc.isAvailableToday
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          {doc.availability || 'Available'}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-base">{doc.name}</h4>
                      <p className="text-xs font-semibold text-teal-700 mt-0.5 mb-2">{doc.specialization}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {doc.room} &bull; {doc.experience}
                      </p>
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-600 font-semibold flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" /> {doc.rating || '4.9'}
                      </span>
                      <button
                        type="button"
                        className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                          isSelected
                            ? 'bg-teal-600 text-white shadow-xs'
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
              onClick={handleStep1Continue}
              className="px-7 py-3 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              Continue to Date
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SELECT DATE */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Step 2 — Select Consultation Date for {selectedDoctor?.name}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(() => {
              const todayObj = new Date();
              const tomorrowObj = new Date();
              tomorrowObj.setDate(todayObj.getDate() + 1);
              const nextDayObj = new Date();
              nextDayObj.setDate(todayObj.getDate() + 2);
              
              const formatItem = (d, label) => {
                const dateStr = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
                const subStr = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
                return { label, date: dateStr, sub: subStr };
              };
              
              const weekday = nextDayObj.toLocaleDateString('en-US', { weekday: 'long' });
              
              return [
                formatItem(todayObj, 'Today'),
                formatItem(tomorrowObj, 'Tomorrow'),
                formatItem(nextDayObj, weekday)
              ];
            })().map((item) => {
              const isSelected = selectedDate === item.date;
              return (
                <div
                  key={item.date}
                  onClick={() => { setSelectedDate(item.date); setError(''); }}
                  className={`bg-white p-6 rounded-3xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-teal-600 ring-2 ring-teal-500/30 shadow-md bg-teal-50/20'
                      : 'border-slate-200/90 hover:border-teal-200 shadow-xs'
                  }`}
                >
                  <Calendar className={`w-7 h-7 mx-auto mb-2 ${isSelected ? 'text-teal-600' : 'text-slate-400'}`} />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{item.label}</span>
                  <div className="text-xl font-extrabold text-slate-900 mt-1">{item.sub}</div>
                  <span className="text-xs text-slate-500 block mt-1">{item.date}</span>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-2xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={handleStep2Continue}
              className="px-7 py-3 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              Continue to Time
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SELECT TIME */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Step 3 — Select Time Slot for {selectedDate}
            </h3>
          </div>

          {loadingSlots ? (
            <div className="p-12 text-center bg-white border border-slate-200/90 rounded-3xl text-slate-400 font-semibold shadow-xs">
              Loading available slots from hospital schedule...
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="p-8 text-center bg-white border border-slate-200/90 rounded-3xl text-rose-600 font-semibold flex items-center justify-center gap-2 shadow-xs">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>No available appointment slots for this doctor on the selected date.</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {availableSlots.map((slot) => {
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
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      isUnavailable
                        ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                        : isSelected
                        ? 'bg-teal-50 border-teal-600 ring-2 ring-teal-500/30 shadow-xs cursor-pointer'
                        : 'bg-white border-slate-200/90 hover:border-teal-200 shadow-2xs cursor-pointer'
                    }`}
                  >
                    <Clock className={`w-4 h-4 mx-auto mb-1.5 ${isSelected ? 'text-teal-600' : 'text-slate-400'}`} />
                    <span className="text-sm font-bold text-slate-900 block">{slot.time}</span>
                    <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      slot.status === 'Available'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : slot.status === 'Few Slots'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {slot.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-2xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={handleStep3Continue}
              className="px-7 py-3 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              Review Booking
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW */}
      {step === 4 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 4 — Review Summary</h3>

          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Consultation Details</span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200/60">
                Ready to Confirm
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-1">
                <span className="text-slate-400 text-xs font-semibold block">Physician</span>
                <span className="font-bold text-slate-900 text-base">{selectedDoctor?.name}</span>
                <p className="text-xs text-teal-700 font-semibold">{selectedDoctor?.specialization}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-1">
                <span className="text-slate-400 text-xs font-semibold block">Appointment Slot</span>
                <span className="font-bold text-slate-900 text-base">{selectedDate}</span>
                <p className="text-xs text-slate-700 font-semibold">{selectedTime}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-1">
                <span className="text-slate-400 text-xs font-semibold block">Patient Name</span>
                <span className="font-bold text-slate-900">{patientName}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-1">
                <span className="text-slate-400 text-xs font-semibold block">Hospital Room / Department</span>
                <span className="font-bold text-slate-900">{selectedDoctor?.room}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(3)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-2xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={handleConfirmAppointment}
              className="px-8 py-3.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirm Appointment
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: CONFIRMATION SUCCESS SCREEN */}
      {step === 5 && confirmedBooking && (
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-sm text-center max-w-xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center mx-auto shadow-2xs">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block">Appointment Confirmed ✓</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1 font-mono">Token {confirmedBooking.token}</h2>
          </div>

          <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-200/80 text-left space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between py-1.5 border-b border-slate-200/60">
              <span className="text-slate-400 font-semibold">Doctor:</span>
              <span className="font-bold text-slate-900">{confirmedBooking.doctorName}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-200/60">
              <span className="text-slate-400 font-semibold">Date:</span>
              <span className="font-bold text-slate-900">{confirmedBooking.date}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-200/60">
              <span className="text-slate-400 font-semibold">Time:</span>
              <span className="font-bold text-slate-900">{confirmedBooking.time}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400 font-semibold">Status:</span>
              <span className="font-bold text-emerald-700">{confirmedBooking.status}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/patient/queue"
              className="flex-1 py-3.5 px-5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-xs transition-colors text-center"
            >
              Track My Queue
            </Link>
            <Link
              to="/patient/dashboard"
              className="flex-1 py-3.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-2xl transition-colors text-center"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
