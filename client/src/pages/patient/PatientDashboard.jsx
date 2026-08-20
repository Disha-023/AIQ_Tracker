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
  AlertCircle
} from 'lucide-react';
import { patientService } from '../../services/patientService';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';
import { patientMockData } from '../../data/patientMockData';
import { appointmentService } from '../../services/appointmentService';
import { predictionService } from '../../services/predictionService';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/notificationService';
import { consultationService } from '../../services/consultationService';

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

  // Lazy-load name and email from active auth session
  const patient = {
    name: user?.name || patientMockData.patient.name,
    email: user?.email || patientMockData.patient.email,
    patientId: user?.id || patientMockData.patient.patientId,
    mobile: user?.mobile || patientMockData.patient.mobile,
    bloodGroup: user?.bloodGroup || patientMockData.patient.bloodGroup
  };

  const { travel } = patientMockData;
  const isBookingActive = activeBooking && activeBooking.status !== 'Cancelled';

  // Get consistent prediction metrics from predictionService
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
    <div className="space-y-8">
      
      {/* 1. UPCOMING APPOINTMENT & 2. LIVE QUEUE HERO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* UPCOMING APPOINTMENT / ACTIVE BOOKING CARD (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          {isBookingActive ? (
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200">
                  <Calendar className="w-3.5 h-3.5 text-teal-600" />
                  {activeBooking.type === 'walk-in' ? 'Active Walk-in OPD Queue' : 'Upcoming Appointment'}
                </span>
                <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${
                  activeBooking.status === 'Confirmed'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    : 'bg-blue-100 text-blue-800 border-blue-200'
                }`}>
                  {activeBooking.status}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {activeBooking.doctorName}
                  </h2>
                  <p className="text-slate-600 text-sm font-medium">
                    {activeBooking.specialization} &bull; {activeBooking.department || 'OPD Room 104'}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-500 block uppercase font-bold text-[10px]">Date</span>
                    <span className="font-bold text-slate-900 text-sm">{activeBooking.date}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase font-bold text-[10px]">Time</span>
                    <span className="font-bold text-slate-900 text-sm">{activeBooking.time}</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-slate-500 block uppercase font-bold text-[10px]">Your Token</span>
                    <span className="font-extrabold text-teal-700 text-sm">{activeBooking.token}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No Active Appointments</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You do not have any active appointments or walk-in queue tokens. Schedule a slot to get started.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <Link
                  to="/patient/appointment"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Book Appointment
                </Link>
                <Link
                  to="/patient/walk-in"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Join Walk-in Queue
                </Link>
              </div>
            </div>
          )}

          {isBookingActive && (
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setShowCancelModal(true)}
                className="px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancel Appointment
              </button>

              <Link
                to="/patient/queue"
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
              >
                Track My Queue
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* LIVE QUEUE CARD (5 cols - Synchronized with predictionService) */}
        <div className="lg:col-span-5 bg-teal-900 text-white rounded-2xl p-6 shadow-sm border border-teal-800 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-teal-800 mb-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-200">
                <Brain className="w-4 h-4 text-teal-400" />
                Live AI Queue Tracking
              </span>
              <span className="px-2 py-0.5 bg-teal-800 text-teal-200 text-[10px] font-bold rounded uppercase">
                {isBookingActive ? prediction?.outputs.status : 'No Queue'}
              </span>
            </div>

            {isBookingActive && prediction ? (
              <>
                <div className="text-center my-3">
                  <span className="text-xs text-teal-300 uppercase font-bold tracking-wider">Your Token Number</span>
                  <div className="text-4xl font-extrabold text-white mt-0.5">{activeBooking.token}</div>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-teal-950/60 p-3 rounded-xl border border-teal-800 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-teal-300 block font-semibold uppercase">Current</span>
                    <span className="font-bold text-white">{activeBooking.currentToken || '#22'}</span>
                  </div>
                  <div className="border-x border-teal-800">
                    <span className="text-[10px] text-teal-300 block font-semibold uppercase">Ahead</span>
                    <span className="font-bold text-teal-200">{prediction.inputs.patientsAhead}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-teal-300 block font-semibold uppercase">AI Wait</span>
                    <span className="font-bold text-emerald-400">{prediction.outputs.estimatedWaitText}</span>
                  </div>
                </div>

                <div className="mt-3 text-center text-xs text-teal-200 font-medium">
                  Estimated Turn Time: <strong className="text-white">{prediction.outputs.estimatedTurnTime}</strong>
                </div>
              </>
            ) : (
              <div className="py-8 text-center text-teal-200 text-xs">
                No active token currently assigned.
              </div>
            )}
          </div>

          <Link
            to="/patient/queue"
            className="mt-4 w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors text-center inline-flex items-center justify-center gap-1.5"
          >
            View Live Queue
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      {/* 3. QUICK ACTIONS */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <Link
            to="/patient/appointment"
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-400 hover:shadow-sm transition-all group flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Book Appointment</h4>
                <p className="text-xs text-slate-500">Schedule a hospital slot</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
          </Link>

          <Link
            to="/patient/walk-in"
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-400 hover:shadow-sm transition-all group flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Join Walk-in Queue</h4>
                <p className="text-xs text-slate-500">Instant OPD queue token</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </Link>

          <Link
            to="/patient/queue"
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-400 hover:shadow-sm transition-all group flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Track Live Queue</h4>
                <p className="text-xs text-slate-500">Real-time status updates</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </Link>

        </div>
      </div>

      {/* 4. TRAVEL TIME CARD & 7. PROFILE SUMMARY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* TRAVEL TIME CARD (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-base">Plan Your Arrival</h3>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
                {travel.status}
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-xs py-1">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Hospital Location
                </span>
                <span className="font-semibold text-slate-900">{travel.hospital} ({travel.distance})</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Estimated Travel Time
                </span>
                <span className="font-semibold text-slate-900">{travel.travelTime}</span>
              </div>
              <div className="flex items-center justify-between bg-teal-50 p-3 rounded-xl border border-teal-200 mt-2">
                <span className="text-xs font-semibold text-teal-900">Recommended Departure:</span>
                <span className="text-sm font-extrabold text-teal-700">{travel.recommendedDeparture}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-right">
            <Link
              to="/patient/queue"
              className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-900"
            >
              View Travel Details
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 7. PATIENT PROFILE SUMMARY (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 pb-3 border-b border-slate-200 mb-4">
              <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-sm">
                {patient.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base leading-none">{patient.name}</h3>
                <span className="text-xs text-slate-500">ID: {patient.patientId}</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-500">Mobile:</span>
                <span className="font-semibold text-slate-800">{patient.mobile}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="font-semibold text-slate-800 truncate max-w-[180px]">{patient.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Blood Group:</span>
                <span className="font-semibold text-slate-800">{patient.bloodGroup}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-right">
            <Link
              to="/patient/profile"
              className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-900"
            >
              View Profile
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>

      {/* 5. RECENT NOTIFICATIONS & 6. VISIT HISTORY PREVIEW GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* RECENT NOTIFICATIONS (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-base">Recent Notifications</h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                {notifications.length} Active
              </span>
            </div>

            <div className="space-y-3">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-slate-500 font-semibold bg-slate-50 border border-slate-200 rounded-xl text-xs">
                  No recent notifications.
                </div>
              ) : (
                notifications.map((notif) => (
                  <div key={notif.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-900">{notif.title}</span>
                      <span className="text-[10px] text-slate-400">{notif.time}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{notif.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-right">
            <Link
              to="/patient/notifications"
              className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-900"
            >
              View All Notifications
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* VISIT HISTORY PREVIEW (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-base">Recent Visits</h3>
              </div>
            </div>

            <div className="space-y-3">
              {visits.length === 0 ? (
                <div className="p-4 text-center text-slate-500 font-semibold bg-slate-50 border border-slate-200 rounded-xl text-xs">
                  No past consultation logs.
                </div>
              ) : (
                visits.map((visit) => (
                  <div key={visit.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">{visit.date}</span>
                      <h4 className="font-bold text-slate-900">{visit.doctor}</h4>
                      <p className="text-[11px] text-slate-500">{visit.specialization}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-200">
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
              className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-900"
            >
              View Full History
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>

      {/* CANCELLATION CONFIRMATION MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl max-w-md w-full text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Cancel Appointment</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to cancel this appointment for <strong>{activeBooking?.doctorName}</strong>?
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Keep Appointment
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Cancel Appointment
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
