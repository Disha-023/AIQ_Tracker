import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Activity,
  Car,
  Bell,
  History,
  ArrowRight,
  Brain,
  MapPin,
  ChevronRight,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Stethoscope,
  PhoneCall,
  User,
  HeartPulse
} from 'lucide-react';
import { patientService } from '../../services/patientService';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';
import { patientMockData } from '../../data/patientMockData';
import { appointmentService } from '../../services/appointmentService';
import { predictionService } from '../../services/predictionService';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/notificationService';
import { consultationService } from '../../services/consultationService';
import GPSLocationCard from '../../components/patient/GPSLocationCard';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [activeBooking, setActiveBooking] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [loadingBooking, setLoadingBooking] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [visits, setVisits] = useState([]);

  const fetchActiveBooking = async () => {
    if (!user?.id) return;
    try {
      const booking = await appointmentService.getActiveBooking(user.id);
      setActiveBooking(booking);
    } catch (err) {
      console.error('Failed to load active booking:', err);
    } finally {
      setLoadingBooking(false);
    }
  };

  const fetchDashboardStatsData = async () => {
    if (!user?.id) return;
    try {
      const notifData = await notificationService.getAll({ patientId: user.id });
      setNotifications(notifData.slice(0, 3));
      
      const visitData = await consultationService.getAll({ patientId: user.id });
      setVisits(visitData.slice(0, 3));
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  };

  useEffect(() => {
    fetchDashboardStatsData();
  }, [user]);

  useAutoRefresh(fetchActiveBooking, 8000, !!user?.id);

  const patient = {
    name: user?.name || patientMockData.patient.name,
    email: user?.email || patientMockData.patient.email,
    patientId: user?.id || patientMockData.patient.patientId,
    mobile: user?.mobile || patientMockData.patient.mobile,
    bloodGroup: user?.bloodGroup || patientMockData.patient.bloodGroup
  };

  const isBookingActive = activeBooking && activeBooking.status !== 'Cancelled';

  const prediction = isBookingActive
    ? predictionService.getWaitingTimePrediction({
        patientsAhead: activeBooking.patientsAhead || 5,
        averageConsultationTime: 7,
        doctorStatus: 'Available'
      })
    : null;

  const handleConfirmCancel = async () => {
    if (!activeBooking) return;
    try {
      await appointmentService.update(activeBooking.id, { status: 'Cancelled' });
      await fetchActiveBooking();
    } catch (err) {
      console.error('Failed to cancel appointment:', err);
    }
    setShowCancelModal(false);
  };

  return (
    <div className="space-y-7 font-sans pb-12">
      
      {/* 1. WELCOME & HOSPITAL STATUS HERO BANNER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            OPD Clinical Shift Active &bull; Kole Hospital Sangli
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {patient.name.split(' ')[0]} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl">
            {isBookingActive
              ? `You have an active ${activeBooking.type === 'walk-in' ? 'walk-in consultation' : 'scheduled appointment'} today with ${activeBooking.doctorName}.`
              : 'You do not have any active consultations today. Book a specialist or join the OPD walk-in queue below.'}
          </p>
        </div>

        {/* Quick Top Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            to="/patient/appointment"
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            Book Specialist
          </Link>
          <Link
            to="/patient/walk-in"
            className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200/90 transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Clock className="w-4 h-4 text-teal-600" />
            Walk-in Token
          </Link>
        </div>
      </div>

      {/* 2. MAIN ASYMMETRIC DASHBOARD COCKPIT (8 cols left / 4 cols right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        
        {/* LEFT PRIMARY ZONE (8 cols) */}
        <div className="lg:col-span-8 space-y-7">
          
          {/* A. HERO CONSULTATION CARD */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col justify-between relative overflow-hidden">
            {isBookingActive ? (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200/80 shadow-2xs">
                      <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                      {activeBooking.type === 'walk-in' ? 'Walk-in OPD Queue' : 'Confirmed Specialist Appointment'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                      {activeBooking.status}
                    </span>
                  </div>

                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-800 hover:underline cursor-pointer transition-colors"
                  >
                    Cancel Booking
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white font-extrabold text-xl flex items-center justify-center shrink-0 shadow-sm">
                      {activeBooking.doctorName.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                        {activeBooking.doctorName}
                      </h2>
                      <p className="text-xs sm:text-sm font-semibold text-teal-700 mt-0.5">
                        {activeBooking.specialization} &bull; <span className="text-slate-500 font-normal">{activeBooking.department || 'OPD Consultation Room 104'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right bg-slate-50/80 sm:bg-transparent p-3.5 sm:p-0 rounded-2xl border border-slate-200/60 sm:border-0">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Your Token Number</span>
                    <span className="text-3xl font-extrabold text-teal-700 tracking-tight font-mono">{activeBooking.token}</span>
                  </div>
                </div>

                {/* Consultation Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70 text-xs">
                  <div>
                    <span className="text-slate-400 block font-bold text-[10px] uppercase tracking-wider">Scheduled Date</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">{activeBooking.date}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold text-[10px] uppercase tracking-wider">Appointment Time</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">{activeBooking.time}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold text-[10px] uppercase tracking-wider">Room Allocation</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">{activeBooking.room || 'Room 104'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold text-[10px] uppercase tracking-wider">Patient Name</span>
                    <span className="font-bold text-slate-900 mt-0.5 block truncate">{patient.name}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <span className="text-xs text-slate-500">
                    Need live queue status? Check how many patients are ahead in line.
                  </span>
                  <Link
                    to="/patient/queue"
                    className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all inline-flex items-center justify-center gap-1.5"
                  >
                    Open Live Queue Radar
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center mx-auto shadow-2xs">
                  <Calendar className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">No Active Consultations Today</h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                    You currently have no scheduled appointments or live walk-in tokens. Reserve a time with your doctor or join the walk-in queue.
                  </p>
                </div>
                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  <Link
                    to="/patient/appointment"
                    className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    Book Specialist Appointment
                  </Link>
                  <Link
                    to="/patient/walk-in"
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                  >
                    Join Walk-in OPD Queue
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* B. SEAMLESSLY EMBEDDED GPS ARRIVAL PLANNER */}
          {/* Preserves all TomTom routing, Geoapify fallback, and GPS calculations in GPSLocationCard */}
          <GPSLocationCard />

        </div>

        {/* RIGHT UTILITY & QUEUE RAIL (4 cols) */}
        <div className="lg:col-span-4 space-y-7">
          
          {/* WIDGET 1: LIVE AI QUEUE RADAR */}
          <div className="bg-gradient-to-br from-teal-50/90 via-white to-emerald-50/40 rounded-3xl p-6 border-2 border-teal-200/90 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3.5 border-b border-teal-100">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-teal-600" />
                <h3 className="font-extrabold text-teal-950 text-sm">Live OPD Queue Radar</h3>
              </div>
              <span className="px-2.5 py-0.5 bg-teal-100 text-teal-900 text-[10px] font-bold rounded-full border border-teal-200 uppercase">
                {isBookingActive ? prediction?.outputs.status : 'Idle'}
              </span>
            </div>

            {isBookingActive && prediction ? (
              <div className="space-y-4">
                <div className="text-center bg-white/90 p-4 rounded-2xl border border-teal-100 shadow-2xs">
                  <span className="text-[10px] text-teal-700 uppercase font-bold tracking-wider block">Your Live Token</span>
                  <div className="text-4xl font-extrabold text-teal-950 font-mono mt-0.5 tracking-tight">
                    {activeBooking.token}
                  </div>
                  <span className="inline-block mt-1 text-[11px] font-semibold text-teal-700">
                    Dr. {activeBooking.doctorName}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center bg-white/80 p-3 rounded-2xl border border-teal-100 shadow-2xs text-xs">
                  <div>
                    <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider block">Serving</span>
                    <span className="font-bold text-slate-800 text-sm mt-0.5 block">{activeBooking.currentToken || '#22'}</span>
                  </div>
                  <div className="border-x border-teal-100">
                    <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider block">Ahead</span>
                    <span className="font-extrabold text-teal-700 text-sm mt-0.5 block">{prediction.inputs.patientsAhead}</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider block">AI Wait</span>
                    <span className="font-extrabold text-emerald-600 text-sm mt-0.5 block">{prediction.outputs.estimatedWaitText}</span>
                  </div>
                </div>

                <div className="p-3 bg-white/90 rounded-2xl border border-teal-100 text-xs text-slate-600 text-center">
                  Estimated Turn: <strong className="text-teal-950 font-bold">{prediction.outputs.estimatedTurnTime}</strong>
                </div>

                <Link
                  to="/patient/queue"
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors text-center inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  View Full Queue Radar
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="py-8 text-center space-y-3">
                <Clock className="w-8 h-8 text-teal-600 mx-auto opacity-70" />
                <p className="text-xs text-slate-500 leading-relaxed">
                  No active token registered. Book an appointment or take a walk-in token to start real-time tracking.
                </p>
                <Link
                  to="/patient/walk-in"
                  className="inline-block text-xs font-bold text-teal-700 hover:underline"
                >
                  Join Walk-in Queue &rarr;
                </Link>
              </div>
            )}
          </div>

          {/* WIDGET 2: PATIENT DIGITAL HEALTH PASSPORT */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white font-bold flex items-center justify-center text-sm shadow-2xs">
                {patient.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm leading-tight">{patient.name}</h3>
                <span className="text-[11px] text-teal-700 font-semibold font-mono">ID: {patient.patientId}</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-medium">Contact:</span>
                <span className="font-semibold text-slate-800">{patient.mobile}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-medium">Email:</span>
                <span className="font-semibold text-slate-800 truncate max-w-[160px]">{patient.email}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400 font-medium">Blood Group:</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200 text-[11px]">
                  {patient.bloodGroup}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-right">
              <Link
                to="/patient/profile"
                className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900"
              >
                Manage Profile & Passport &rarr;
              </Link>
            </div>
          </div>

          {/* WIDGET 3: QUICK SHORTCUTS */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Patient Shortcuts</h4>
            <div className="space-y-2 text-xs">
              <Link
                to="/patient/appointment"
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-teal-50/50 border border-slate-200/70 transition-all font-semibold text-slate-700 group"
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  <span>Book New Appointment</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                to="/patient/history"
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-teal-50/50 border border-slate-200/70 transition-all font-semibold text-slate-700 group"
              >
                <div className="flex items-center gap-2.5">
                  <History className="w-4 h-4 text-teal-600" />
                  <span>Consultation History & Rx</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                to="/patient/notifications"
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-teal-50/50 border border-slate-200/70 transition-all font-semibold text-slate-700 group"
              >
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-teal-600" />
                  <span>Hospital Alerts & Slips</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>

        </div>

      </div>

      {/* 3. SECONDARY CLINICAL DATA: RECENT VISITS & NOTIFICATIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        
        {/* RECENT NOTIFICATIONS FEED */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-base">Hospital Communications</h3>
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                {notifications.length} Unread
              </span>
            </div>

            <div className="space-y-3">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-slate-400 font-medium bg-slate-50/70 border border-slate-200/70 rounded-2xl text-xs">
                  No notifications recorded today.
                </div>
              ) : (
                notifications.map((notif) => (
                  <div key={notif.id} className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/70 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">{notif.title}</span>
                      <span className="text-[10px] text-slate-400">{notif.time}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11.5px]">{notif.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-right">
            <Link
              to="/patient/notifications"
              className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900"
            >
              All Notifications &rarr;
            </Link>
          </div>
        </div>

        {/* CONSULTATION HISTORY PREVIEW */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-base">Past Consultations & Prescriptions</h3>
              </div>
            </div>

            <div className="space-y-3">
              {visits.length === 0 ? (
                <div className="p-6 text-center text-slate-400 font-medium bg-slate-50/70 border border-slate-200/70 rounded-2xl text-xs">
                  No past consultation logs found.
                </div>
              ) : (
                visits.map((visit) => (
                  <div key={visit.id} className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/70 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">{visit.date}</span>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{visit.doctor}</h4>
                      <p className="text-[11px] text-slate-500">{visit.specialization}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-[10.5px] font-bold rounded-full border border-emerald-200/80">
                      {visit.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-right">
            <Link
              to="/patient/history"
              className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900"
            >
              Full Clinical History &rarr;
            </Link>
          </div>
        </div>

      </div>

      {/* CANCELLATION CONFIRMATION MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-2xs">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xl max-w-md w-full text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto shadow-2xs">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Cancel Consultation</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Are you sure you want to cancel your consultation with <strong>{activeBooking?.doctorName}</strong>? Your token will be released back to the hospital queue.
            </p>
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
