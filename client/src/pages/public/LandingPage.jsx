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
  ShieldAlert,
  Sparkles,
  Stethoscope,
  MapPin,
  HeartPulse,
  Compass,
  ArrowUpRight
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

  const handleAppointmentClick = () => {
    if (isAuthenticated) {
      navigate('/patient/appointment');
    } else {
      navigate('/login');
    }
  };

  const handleWalkInClick = () => {
    if (isAuthenticated) {
      navigate('/patient/walk-in');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="bg-white text-slate-900 font-sans selection:bg-teal-500 selection:text-white">
      
      {/* 1. HERO SECTION — THE SHOWPIECE */}
      <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-32 overflow-hidden border-b border-slate-200/80">
        {/* Soft atmospheric background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-gradient-to-b from-teal-50/60 via-slate-50/40 to-transparent pointer-events-none -z-10" />
        <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-teal-400/5 blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-40 left-10 w-96 h-96 rounded-full bg-sky-400/5 blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Header & Headline */}
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-teal-200 text-teal-800 text-xs font-bold shadow-2xs">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-600"></span>
              </span>
              Intelligent Hospital Operations &bull; Kole Hospital
            </div>

            {/* Editorial Bold Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-950 tracking-tight leading-[1.08]">
              Less Waiting. <br />
              <span className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
                More Caring.
              </span>
            </h1>

            {/* Supporting Editorial Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
              Smarter appointments, real-time queue visibility, and traffic-aware hospital arrival planning — all in one connected experience.
            </p>

            {/* Primary Action Row */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <button
                onClick={handleAppointmentClick}
                className="w-full sm:w-auto px-7 py-4 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-sm rounded-2xl shadow-sm hover:shadow-md transition-all inline-flex items-center justify-center gap-2 cursor-pointer group"
              >
                <Calendar className="w-4 h-4 text-teal-200" />
                Book an Appointment
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={handleWalkInClick}
                className="w-full sm:w-auto px-7 py-4 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-2xl border border-slate-200/90 shadow-2xs transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Clock className="w-4 h-4 text-teal-600" />
                Join Walk-in Queue
              </button>
            </div>

            {/* Professional Portal Redirect Link */}
            <div className="pt-2 text-xs text-slate-500 font-medium">
              Are you hospital personnel?{' '}
              <Link to="/staff" className="font-bold text-teal-700 hover:text-teal-900 transition-colors inline-flex items-center gap-1">
                Access Reception Desk or Admin Portal &rarr;
              </Link>
            </div>

          </div>

          {/* HERO VISUAL SHOWCASE: HIGH-FIDELITY DIGITAL CARE COCKPIT */}
          <div className="mt-14 lg:mt-20 max-w-5xl mx-auto relative">
            
            {/* Ambient Shadow glow */}
            <div className="absolute inset-4 bg-teal-600/10 rounded-3xl blur-2xl -z-10" />

            {/* Elevated Cockpit Container */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
              
              {/* Cockpit Window Top Bar */}
              <div className="bg-slate-50/90 px-5 py-3 border-b border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-300" />
                  <div className="w-3 h-3 rounded-full bg-slate-300" />
                  <div className="w-3 h-3 rounded-full bg-slate-300" />
                  <span className="text-[11px] font-mono text-slate-400 ml-2">aiqtracker.hospital/patient/live-care</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live System Connected
                  </span>
                </div>
              </div>

              {/* Showcase Interior Content */}
              <div className="p-6 sm:p-8 space-y-6">
                
                {/* Upper Consultation Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white font-extrabold text-lg flex items-center justify-center shadow-xs">
                      AJ
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-slate-950 text-base">Dr. Ananya Joshi</h3>
                        <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                          Cardiology Specialist
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        OPD Consultation Room 104 &bull; Kole Hospital
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Your Live Token</span>
                      <span className="text-2xl font-black text-teal-700 font-mono">#28</span>
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200">
                      Confirmed
                    </span>
                  </div>
                </div>

                {/* Two-Column Telemetry Inside Showcase */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* Left Mock Module: Live AI Queue Radar */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-50/60 via-white to-emerald-50/40 border border-teal-200/80 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4 text-teal-600" />
                        <span className="font-bold text-xs text-teal-950">Live AI Queue Radar</span>
                      </div>
                      <span className="text-[10px] font-bold text-teal-800 uppercase bg-teal-100 px-2 py-0.5 rounded-full">
                        Pacing Active
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2.5 bg-white/90 rounded-xl border border-teal-100">
                        <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">Serving</span>
                        <span className="text-lg font-black text-slate-900 font-mono mt-0.5 block">#22</span>
                      </div>
                      <div className="p-2.5 bg-white/90 rounded-xl border border-teal-100">
                        <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">Ahead</span>
                        <span className="text-lg font-black text-teal-700 font-mono mt-0.5 block">5</span>
                      </div>
                      <div className="p-2.5 bg-white/90 rounded-xl border border-teal-100">
                        <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">AI Wait</span>
                        <span className="text-lg font-black text-emerald-600 mt-0.5 block">38–45m</span>
                      </div>
                    </div>

                    <div className="p-3 bg-white/90 rounded-xl border border-teal-100 text-xs flex items-center justify-between">
                      <span className="text-slate-600">Expected Turn Time:</span>
                      <strong className="text-teal-950 font-bold font-mono">11:45 AM</strong>
                    </div>
                  </div>

                  {/* Right Mock Module: TomTom Traffic-Aware Arrival Planner */}
                  <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-teal-600" />
                        <span className="font-bold text-xs text-slate-900">Traffic-Aware Arrival Planner</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        TomTom Routing
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center text-xs">
                      <div className="p-2.5 bg-white rounded-xl border border-slate-200/70">
                        <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">Road Distance</span>
                        <span className="text-base font-black text-slate-900 mt-0.5 block">15.5 km</span>
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-slate-200/70">
                        <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">Live Traffic ETA</span>
                        <span className="text-base font-black text-teal-700 mt-0.5 block">~35 min</span>
                      </div>
                    </div>

                    <div className="p-3 bg-teal-50/80 rounded-xl border border-teal-200/70 text-xs flex items-center justify-between">
                      <span className="text-teal-900 font-medium">Recommended Departure:</span>
                      <strong className="text-teal-800 font-extrabold font-mono text-sm">11:10 AM</strong>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 2. THE PATIENT JOURNEY — CONNECTED STORYTELLING */}
      <section id="journey" className="py-20 sm:py-28 bg-[#F8FAFC] border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-widest block">
              Patient Care Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              From Home to Consultation, Reimagined
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Experience a connected healthcare visit that eliminates the hours spent in crowded hospital waiting lounges.
            </p>
          </div>

          {/* 4-Stage Connected Journey Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            
            {/* Step 1 */}
            <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 font-extrabold text-lg flex items-center justify-center border border-teal-100 shadow-2xs">
                  01
                </div>
                <h3 className="text-lg font-bold text-slate-900">Reserve Your Consultation</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Book a specialist appointment online for your preferred time slot, or generate an instant OPD walk-in queue slip.
                </p>
              </div>
              <span className="text-[11px] font-bold text-teal-700 inline-flex items-center gap-1">
                Specialist Selection &rarr;
              </span>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 font-extrabold text-lg flex items-center justify-center border border-teal-100 shadow-2xs">
                  02
                </div>
                <h3 className="text-lg font-bold text-slate-900">Monitor Live Token Radar</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Track the doctor's live queue pace and exactly how many patients are ahead of you from the comfort of your home.
                </p>
              </div>
              <span className="text-[11px] font-bold text-teal-700 inline-flex items-center gap-1">
                Real-Time Queuing &rarr;
              </span>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 font-extrabold text-lg flex items-center justify-center border border-teal-100 shadow-2xs">
                  03
                </div>
                <h3 className="text-lg font-bold text-slate-900">Calibrate Travel with GPS</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  TomTom traffic-aware navigation calculates road delays and notifies you of the exact departure time to reach on schedule.
                </p>
              </div>
              <span className="text-[11px] font-bold text-teal-700 inline-flex items-center gap-1">
                Live Traffic ETA &rarr;
              </span>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 font-extrabold text-lg flex items-center justify-center border border-teal-100 shadow-2xs">
                  04
                </div>
                <h3 className="text-lg font-bold text-slate-900">Walk In On Time</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Step straight into your physician's consultation room right as your token is announced, with zero waiting room fatigue.
                </p>
              </div>
              <span className="text-[11px] font-bold text-teal-700 inline-flex items-center gap-1">
                Doctor Consultation &rarr;
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* 3. PURPOSEFUL FEATURE SHOWCASE (ASYMMETRICAL EDITORIAL LAYOUT) */}
      <section id="features" className="py-20 sm:py-28 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          
          {/* Feature 1: Traffic-Aware Departure (Left 7 cols / Right 5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200/80">
                <Car className="w-3.5 h-3.5 text-teal-600" />
                Live Traffic Intelligence
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-snug">
                Know When to Leave Home. <br />
                <span className="text-teal-700">Not Just When to Arrive.</span>
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Ordinary hospital systems give you a static appointment time and leave you to wait in crowded lobbies. AIQ Tracker continuously monitors live road congestion with TomTom Routing, computing your driving distance and recommending the ideal departure minute.
              </p>
              <div className="space-y-3 text-xs sm:text-sm text-slate-700 pt-1">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Real-time road routing using primary TomTom Traffic API with Geoapify fallback</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Departure advisory synchronized with live queue pacing</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>1-click Google Maps handoff for turn-by-turn driving directions</span>
                </div>
              </div>
            </div>

            {/* Illustrative Telemetry Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-50 p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Departure Advisory</span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    On Schedule
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between p-3 rounded-2xl bg-white border border-slate-200/70">
                    <span className="text-slate-500 font-medium">Predicted Waiting Time:</span>
                    <strong className="text-slate-900">45 minutes</strong>
                  </div>
                  <div className="flex justify-between p-3 rounded-2xl bg-white border border-slate-200/70">
                    <span className="text-slate-500 font-medium">Road Driving Duration:</span>
                    <strong className="text-teal-700">35 minutes (Live Traffic)</strong>
                  </div>
                  <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">Recommended Leave Time</span>
                      <strong className="text-xl font-extrabold text-teal-950 font-mono">11:10 AM</strong>
                    </div>
                    <span className="text-xs font-bold text-teal-800 bg-white px-3 py-1.5 rounded-xl border border-teal-200 shadow-2xs">
                      Ready in 25 min
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2: Dynamic AI Queue Engine (Right 7 cols / Left 5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Illustrative AI Prediction Card */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white p-6 sm:p-7 rounded-3xl border border-teal-800/50 shadow-md space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5 text-teal-300" />
                    AI Queue Calculation
                  </span>
                  <span className="text-[10px] font-bold bg-white/10 text-teal-200 px-2 py-0.5 rounded-full">
                    95% Confidence
                  </span>
                </div>

                <div className="text-center py-2">
                  <span className="text-[11px] text-teal-200 uppercase font-bold tracking-wider block">Predicted Wait Window</span>
                  <div className="text-4xl font-extrabold text-white mt-1 tracking-tight font-mono">
                    38–45 min
                  </div>
                  <span className="text-xs text-teal-300 mt-1 inline-block">Estimated Turn: 11:45 AM</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-2 border-t border-white/10">
                  <div className="p-2.5 bg-white/5 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Doctor Pace</span>
                    <strong className="text-white">7 min/patient</strong>
                  </div>
                  <div className="p-2.5 bg-white/5 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Lounge Density</span>
                    <strong className="text-white">5 Patients Ahead</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200/80">
                <Brain className="w-3.5 h-3.5 text-teal-600" />
                Dynamic Queue Modeling
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-snug">
                Predictive Queue Pacing <br />
                <span className="text-teal-700">Calibrated to Reality.</span>
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Hospital consultation queues aren't simple stopwatches. AIQ Tracker analyzes doctor consultation duration, patient turnaround pace, and active room counts to continuously calibrate the most accurate wait-time window for each patient.
              </p>
              <div className="space-y-3 text-xs sm:text-sm text-slate-700 pt-1">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Dynamic recalculation when doctor consultation durations shift</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Transparent visual counter showing exactly how many patients are ahead</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Audio chime call alerts and real-time status changes</span>
                </div>
              </div>
            </div>

          </div>

          {/* Feature 3: Integrated Hospital Portals (3-Column Grid) */}
          <div className="pt-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold text-teal-700 uppercase tracking-widest block">
                Hospital Ecosystem
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                Three Connected Portals in One System
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Each hospital stakeholder interacts with a tailored interface built specifically for their operational responsibilities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Portal 1: Patient */}
              <div className="bg-slate-50 p-7 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Patient Care Portal</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Self-service appointment booking, live token radar, TomTom traffic arrival planning, and prescription visit records.
                  </p>
                </div>
                <Link
                  to="/login"
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1 pt-2 border-t border-slate-200/70"
                >
                  Access Patient Portal &rarr;
                </Link>
              </div>

              {/* Portal 2: Reception Desk */}
              <div className="bg-slate-50 p-7 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Front Desk Workstation</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Walk-in patient registration, instant token issuance, 1-click arrival check-in, and real-time doctor room dispatching.
                  </p>
                </div>
                <Link
                  to="/staff-login"
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1 pt-2 border-t border-slate-200/70"
                >
                  Access Reception Station &rarr;
                </Link>
              </div>

              {/* Portal 3: Administration */}
              <div className="bg-slate-50 p-7 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Hospital Command Center</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Hospital-wide queue telemetry, doctor shift rosters, clinical department utilization, and operational analytics.
                  </p>
                </div>
                <Link
                  to="/admin-login"
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1 pt-2 border-t border-slate-200/70"
                >
                  Access Command Suite &rarr;
                </Link>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 4. FINAL CALL TO ACTION */}
      <section className="py-20 sm:py-28 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold shadow-2xs">
            <HeartPulse className="w-3.5 h-3.5 text-teal-600" />
            Modern Hospital Navigation
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
            Ready for a Smarter Hospital Visit?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Reserve your consultation slot online or check real-time OPD queue status before leaving home.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleAppointmentClick}
              className="w-full sm:w-auto px-8 py-4 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-sm rounded-2xl shadow-sm hover:shadow-md transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-teal-200" />
              Book Specialist Appointment
            </button>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-2xl border border-slate-200/90 shadow-2xs transition-all inline-flex items-center justify-center gap-2"
            >
              Sign In to Patient Portal &rarr;
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
