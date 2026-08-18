import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  Calendar,
  Clock,
  Navigation,
  Bell,
  FileText,
  UserCheck,
  Users,
  Shield,
  CheckCircle2,
  Brain,
  Car,
  ChevronRight,
  TrendingDown,
  Building2,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();

  const handleCtaClick = () => {
    if (isAuthenticated) {
      if (role === 'receptionist') navigate('/reception/dashboard');
      else if (role === 'admin') navigate('/admin/dashboard');
      else navigate('/patient/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="bg-slate-50 min-h-full">
      
      {/* HERO SECTION */}
      <section className="bg-white border-b border-slate-200 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold">
                <Activity className="w-4 h-4 text-teal-600" />
                AIQ Tracker &bull; Smart Appointment & Queue Management
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Smarter Hospital Visits, <br className="hidden sm:inline" />
                <span className="text-teal-600">Less Time Waiting.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                AIQ Tracker helps patients manage appointments, track live queues, estimate waiting time, and plan when to leave for the hospital.
              </p>

              <div className="text-teal-700 font-semibold text-sm tracking-wide">
                "Know your waiting time. Know when to leave."
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={handleCtaClick}
                  className="w-full sm:w-auto px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  Book an Appointment
                </button>
                <button
                  onClick={handleCtaClick}
                  className="w-full sm:w-auto px-6 py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-sm rounded-xl shadow-xs transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Clock className="w-4 h-4 text-teal-600" />
                  Join Walk-in Queue
                </button>
              </div>

              {/* Separate Professional Links for Hospital Staff & Admin Portals */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4 text-xs font-semibold text-slate-500 border-t border-slate-100">
                <span className="text-slate-400 font-medium">Hospital Personnel:</span>
                <Link
                  to="/staff-login"
                  className="inline-flex items-center gap-1.5 text-slate-700 hover:text-teal-700 transition-colors bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200"
                >
                  <Building2 className="w-3.5 h-3.5 text-teal-600" />
                  Hospital Staff Portal &rarr;
                </Link>
                <Link
                  to="/admin-login"
                  className="inline-flex items-center gap-1.5 text-slate-700 hover:text-purple-700 transition-colors bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
                  Administration Portal &rarr;
                </Link>
              </div>
            </div>

            {/* Right Hero Healthcare Visual Card (Patient -> AI Prediction -> Hospital) */}
            <div className="lg:col-span-5">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm relative">
                <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-4">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Live Flow Indicator
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                    Active System
                  </span>
                </div>

                {/* 3 Step Visual Pipeline */}
                <div className="space-y-3">
                  {/* Step 1: Patient */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                        01
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Patient Request</h4>
                        <p className="text-[11px] text-slate-500">Token #27 &bull; General OPD</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">Joined Queue</span>
                  </div>

                  <div className="flex justify-center text-teal-600">
                    <ChevronRight className="w-5 h-5 rotate-90" />
                  </div>

                  {/* Step 2: AI Prediction */}
                  <div className="bg-white p-3.5 rounded-xl border border-teal-200 bg-teal-50/50 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                        <Brain className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">AI Waiting Engine</h4>
                        <p className="text-[11px] text-teal-700 font-medium">Estimated wait: 38–45 min</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-teal-800 bg-teal-100 px-2 py-1 rounded">5 Ahead</span>
                  </div>

                  <div className="flex justify-center text-teal-600">
                    <ChevronRight className="w-5 h-5 rotate-90" />
                  </div>

                  {/* Step 3: Hospital Desk */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                        03
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Hospital Consultation</h4>
                        <p className="text-[11px] text-slate-500">Recommended departure: 3:30 PM</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">On Time</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold text-teal-700 uppercase tracking-widest mb-2">Simple 4-Step Process</h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">How AIQ Tracker Works</h3>
          <p className="text-slate-600 text-sm mt-2 max-w-xl mx-auto">
            Streamlining your hospital experience from token allocation to doctor consultation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs relative">
            <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 font-bold flex items-center justify-center mb-4 text-base">
              1
            </div>
            <h4 className="text-lg font-semibold text-slate-900 mb-2">Book or Join Queue</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              Schedule an online appointment or join the live OPD walk-in queue from your phone.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs relative">
            <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 font-bold flex items-center justify-center mb-4 text-base">
              2
            </div>
            <h4 className="text-lg font-semibold text-slate-900 mb-2">Get Your Token</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              Receive a digital queue token with real-time status updates on patients ahead of you.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs relative">
            <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 font-bold flex items-center justify-center mb-4 text-base">
              3
            </div>
            <h4 className="text-lg font-semibold text-slate-900 mb-2">Track AI Waiting Time</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              Dynamic AI calculations continuously update your predicted doctor consultation time.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs relative">
            <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 font-bold flex items-center justify-center mb-4 text-base">
              4
            </div>
            <h4 className="text-lg font-semibold text-slate-900 mb-2">Arrive at Right Time</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              Receive departure notifications and arrive right when the doctor is ready for you.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold text-teal-700 uppercase tracking-widest mb-2">Core Platform Capabilities</h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">Key System Features</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-xs">
              <Calendar className="w-8 h-8 text-teal-600 mb-4" />
              <h4 className="font-bold text-slate-900 text-base mb-2">Smart Appointment Booking</h4>
              <p className="text-slate-600 text-sm">Select preferred doctors, specialties, and convenient time slots with ease.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-xs">
              <Clock className="w-8 h-8 text-teal-600 mb-4" />
              <h4 className="font-bold text-slate-900 text-base mb-2">Live Queue Tracking</h4>
              <p className="text-slate-600 text-sm">Monitor current doctor consultations and live patient queue movement in real time.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-xs">
              <Brain className="w-8 h-8 text-teal-600 mb-4" />
              <h4 className="font-bold text-slate-900 text-base mb-2">AI Waiting-Time Prediction</h4>
              <p className="text-slate-600 text-sm">Accurate waiting estimations based on consultation pace and emergency queues.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-xs">
              <Navigation className="w-8 h-8 text-teal-600 mb-4" />
              <h4 className="font-bold text-slate-900 text-base mb-2">GPS-Based Travel Estimation</h4>
              <p className="text-slate-600 text-sm">Integrates travel duration so you know exact departure time from home.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-xs">
              <Bell className="w-8 h-8 text-teal-600 mb-4" />
              <h4 className="font-bold text-slate-900 text-base mb-2">Smart Notifications</h4>
              <p className="text-slate-600 text-sm">Timely alerts when your token is near, preventing missed appointments.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-xs">
              <FileText className="w-8 h-8 text-teal-600 mb-4" />
              <h4 className="font-bold text-slate-900 text-base mb-2">Digital Visit History</h4>
              <p className="text-slate-600 text-sm">Keep comprehensive digital records of past hospital consultations and tokens.</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI WAITING-TIME SECTION ("Know Before You Go") */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-teal-900 text-white rounded-2xl p-8 sm:p-12 shadow-sm">
          <div className="lg:col-span-7 space-y-4">
            <span className="px-3 py-1 bg-teal-800 text-teal-200 rounded-full text-xs font-semibold">
              Predictive AI Engine
            </span>
            <h3 className="text-2xl sm:text-4xl font-bold tracking-tight">Know Before You Go</h3>
            <p className="text-teal-100 text-sm sm:text-base leading-relaxed">
              No more sitting for hours in overcrowded hospital waiting rooms. AIQ Tracker dynamically calculates waiting time based on historical consultation speeds, active emergency tokens, and doctor availability.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs font-semibold text-teal-200">
              <CheckCircle2 className="w-4 h-4 text-teal-400" /> Dynamic Queue Adjustments
              <CheckCircle2 className="w-4 h-4 text-teal-400" /> Emergency Prioritization
            </div>
          </div>

          {/* Mock Prediction Card */}
          <div className="lg:col-span-5">
            <div className="bg-white text-slate-900 rounded-xl p-6 shadow-lg border border-teal-700">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200 mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase">Live Token Preview</span>
                <span className="px-2 py-0.5 bg-teal-100 text-teal-800 text-xs font-bold rounded">Active</span>
              </div>
              <div className="text-center my-4">
                <div className="text-3xl font-extrabold text-teal-700">Token #27</div>
                <div className="text-xs text-slate-500 mt-1">General OPD &bull; Dr. Smith</div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase font-bold">Ahead</span>
                  <span className="text-sm font-extrabold text-slate-800">5</span>
                </div>
                <div className="border-x border-slate-200">
                  <span className="block text-[10px] text-slate-500 uppercase font-bold">AI Wait</span>
                  <span className="text-sm font-extrabold text-teal-700">38–45 min</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase font-bold">Turn</span>
                  <span className="text-sm font-extrabold text-slate-800">4:05 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRAVEL TIME SECTION ("Know When to Leave") */}
      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Mock Travel UI Card */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <Car className="w-4 h-4 text-teal-600" />
                    Smart Departure Recommendation
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                    You're on time
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm py-1.5 border-b border-slate-200">
                    <span className="text-slate-600">Waiting Time:</span>
                    <span className="font-bold text-slate-900">45 min</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-1.5 border-b border-slate-200">
                    <span className="text-slate-600">Travel Time:</span>
                    <span className="font-bold text-slate-900">24 min</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-1.5 bg-teal-50 p-2.5 rounded-lg border border-teal-200">
                    <span className="font-semibold text-teal-900">Recommended Departure:</span>
                    <span className="font-extrabold text-teal-700 text-base">3:30 PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Travel Section Description */}
            <div className="lg:col-span-7 space-y-4 order-1 lg:order-2">
              <span className="text-xs font-bold text-teal-700 uppercase tracking-widest">Travel Optimization</span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">Know When to Leave</h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                AIQ Tracker synchronizes your predicted consultation turn with real-time travel duration. Relax at home or at work until the system recommends the ideal time to head to the hospital.
              </p>
              <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-700 pt-2">
                <span className="inline-flex items-center gap-1"><TrendingDown className="w-4 h-4 text-teal-600" /> Zero Waiting Room Stress</span>
                <span className="inline-flex items-center gap-1"><Clock className="w-4 h-4 text-teal-600" /> Timely Departure Alerts</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section id="about" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold text-teal-700 uppercase tracking-widest mb-2">Designed for Hospital Ecosystems</h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">Benefits for Everyone</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Patients Benefit */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <UserCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-3">For Patients</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Less unnecessary hospital waiting time</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Better planning for work and family</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Live queue and status transparency</span>
              </li>
            </ul>
          </div>

          {/* Receptionists Benefit */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-3">For Receptionists</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Easier queue and patient management</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Faster patient check-in & dispatch</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Digital consultation & walk-in records</span>
              </li>
            </ul>
          </div>

          {/* Admin Benefit */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-3">For Administration</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <span>Better hospital operational insights</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <span>Historical consultation data records</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <span>AI queue performance analytics</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="bg-white border-t border-slate-200 py-16 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Ready for a smarter hospital visit?
          </h2>
          <p className="text-slate-600 text-base max-w-xl mx-auto">
            Join AIQ Tracker today to book appointments, track live OPD queues, and avoid long waiting room delays.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleCtaClick}
              className="px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Book Appointment
            </button>
            <button
              onClick={handleCtaClick}
              className="px-6 py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Join Walk-in Queue
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
