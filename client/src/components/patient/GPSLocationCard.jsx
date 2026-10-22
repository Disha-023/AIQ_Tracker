import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Locate,
  AlertCircle,
  Loader2,
  RotateCcw,
  CheckCircle2,
  Clock,
  Car,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Compass
} from 'lucide-react';
import {
  DESTINATION,
  getPatientLocation
} from '../../utils/geolocation';
import { apiService } from '../../services/apiService';

export default function GPSLocationCard({ className = '' }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [userCoords, setUserCoords] = useState(null);
  const [accuracyWarning, setAccuracyWarning] = useState(null);
  const [showGpsDetails, setShowGpsDetails] = useState(false);

  const handleGetLocationAndDirections = async () => {
    setLoading(true);
    setError(null);
    setAccuracyWarning(null);

    try {
      // 1. Get browser GPS coordinates with high accuracy and 15s timeout
      const position = await getPatientLocation({
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      });

      const { latitude, longitude, accuracy } = position;
      setUserCoords({ latitude, longitude });

      // Check GPS accuracy (warn if inaccuracy exceeds 1000m)
      if (typeof accuracy === 'number' && accuracy > 1000) {
        setAccuracyWarning(`Low GPS accuracy (±${Math.round(accuracy)}m). Estimated road distance may vary.`);
      }

      // 2. Call backend /api/directions (TomTom primary with Geoapify fallback via Express)
      const res = await apiService.getDirections(
        longitude,
        latitude,
        DESTINATION.longitude,
        DESTINATION.latitude
      );

      if (!res.success) {
        // Clear routeData to avoid displaying stale distance or travel time
        setRouteData(null);
        setError(res.error || 'Driving route unavailable. Please retry.');
        return;
      }

      const features = res.data?.features;
      if (!Array.isArray(features) || features.length === 0) {
        setRouteData(null);
        setError('No drivable road route found to the hospital destination.');
        return;
      }

      const properties = features[0]?.properties;
      const distanceMeters = res.data?.distanceMeters ?? properties?.distance ?? properties?.summary?.distance;
      const durationSeconds = res.data?.durationSeconds ?? properties?.time ?? properties?.summary?.duration;
      const provider = res.data?.provider ?? (properties?.provider || 'tomtom');
      const isTrafficAware = res.data?.isTrafficAware ?? (properties?.isTrafficAware ?? (provider === 'tomtom'));

      if (typeof distanceMeters !== 'number' || typeof durationSeconds !== 'number') {
        setRouteData(null);
        setError('Routing service returned incomplete route metrics.');
        return;
      }

      // 3. Extract road distance (convert meters to kilometers)
      const rawDistanceKm = distanceMeters / 1000;
      if (!Number.isFinite(rawDistanceKm) || rawDistanceKm < 0) {
        setRouteData(null);
        setError('Invalid road distance received from routing provider.');
        return;
      }
      const drivingDistanceKm = Math.round(rawDistanceKm * 10) / 10;

      // 4. Extract road duration (convert seconds to minutes)
      const rawDurationSec = durationSeconds;
      if (!Number.isFinite(rawDurationSec) || rawDurationSec < 0) {
        setRouteData(null);
        setError('Invalid travel duration received from routing provider.');
        return;
      }
      const drivingDurationMin = Math.max(1, Math.round(rawDurationSec / 60));

      const now = new Date();

      setRouteData({
        latitude,
        longitude,
        distanceKm: drivingDistanceKm,
        durationMin: drivingDurationMin,
        durationSeconds: rawDurationSec,
        calculatedAt: now.getTime(),
        provider,
        isTrafficAware,
        accuracy: typeof accuracy === 'number' ? Math.round(accuracy) : null,
        timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } catch (err) {
      console.error('GPS Directions Error:', err);
      setRouteData(null);
      setError(err.message || 'Unable to retrieve location or directions.');
    } finally {
      setLoading(false);
    }
  };

  const activeOrigin = routeData || userCoords;
  const googleMapsDirectionsUrl = activeOrigin
    ? `https://www.google.com/maps/dir/?api=1&origin=${activeOrigin.latitude},${activeOrigin.longitude}&destination=${DESTINATION.latitude},${DESTINATION.longitude}&travelmode=driving`
    : `https://www.google.com/maps/dir/?api=1&destination=${DESTINATION.latitude},${DESTINATION.longitude}&travelmode=driving`;

  // Calculated presentation-only estimated arrival time (synchronized with recalculation)
  const estimatedArrival = (routeData?.calculatedAt && typeof routeData?.durationSeconds === 'number')
    ? new Date(routeData.calculatedAt + routeData.durationSeconds * 1000).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    : null;

  return (
    <div className={`bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between ${className}`}>
      <div>
        {/* ==================================================================== */}
        {/* A. PREMIUM HEADER */}
        {/* ==================================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100/80 text-teal-600 flex items-center justify-center shrink-0 shadow-2xs">
              <Navigation className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base md:text-lg tracking-tight leading-snug">
                Plan Your Arrival
              </h3>
              <p className="text-xs text-slate-500 font-normal">
                Smart navigation to your hospital
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50/90 text-teal-800 text-xs font-semibold rounded-full border border-teal-200/70 shadow-2xs">
              <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              {DESTINATION.name}
            </span>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* B. VISUAL JOURNEY OVERVIEW (SCHEMATIC) */}
        {/* ==================================================================== */}
        <div className="mb-5 p-4 bg-slate-50/80 rounded-2xl border border-slate-200/70">
          <div className="flex items-center justify-between gap-2">
            {/* Origin Node */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs border ${
                routeData
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                  : 'bg-white border-slate-200 text-slate-400'
              }`}>
                <Locate className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Your Location
                </span>
                <span className="text-xs font-bold text-slate-800 truncate block">
                  {routeData ? 'Current GPS' : (userCoords ? 'Detected' : 'Tap Below')}
                </span>
              </div>
            </div>

            {/* Schematic Route Track */}
            <div className="flex-1 mx-2 sm:mx-4 relative flex items-center">
              <div className="w-full h-0.5 bg-gradient-to-r from-teal-300 via-teal-400 to-teal-500 rounded-full relative"></div>
              <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2">
                <div className="w-6 h-6 rounded-full bg-white border border-teal-300 text-teal-600 flex items-center justify-center shadow-xs">
                  <Car className="w-3.5 h-3.5 text-teal-600" />
                </div>
              </div>
            </div>

            {/* Destination Node */}
            <div className="flex items-center gap-2.5 min-w-0 text-right">
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Destination
                </span>
                <span className="text-xs font-bold text-slate-800 truncate block">
                  {DESTINATION.name}
                </span>
              </div>
              <div className="w-8 h-8 rounded-xl bg-teal-600 border border-teal-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <MapPin className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Subtext with address & Google Maps link */}
          <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 gap-1.5">
            <span className="truncate">{DESTINATION.address}</span>
            <a
              href={DESTINATION.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1 shrink-0 transition-colors"
            >
              Open in Google Maps
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* H. LOADING STATE (SKELETON EXPERIENCE) */}
        {/* ==================================================================== */}
        {loading && (
          <div className="space-y-3.5 mb-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/70 animate-pulse motion-reduce:animate-none space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-200"></div>
                  <div className="h-3 w-24 bg-slate-200 rounded"></div>
                </div>
                <div className="h-7 w-20 bg-slate-200 rounded"></div>
              </div>
              <div className="p-4 bg-teal-50/40 rounded-xl border border-teal-100 animate-pulse motion-reduce:animate-none space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-teal-200"></div>
                    <div className="h-3 w-28 bg-teal-200 rounded"></div>
                  </div>
                </div>
                <div className="h-7 w-24 bg-teal-200 rounded"></div>
              </div>
            </div>

            <div className="p-3.5 bg-teal-50/70 rounded-xl border border-teal-200/60 flex items-center justify-center gap-2.5 text-xs text-teal-800 font-medium">
              <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none text-teal-600" />
              <span>Calculating your driving route...</span>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* I. ERROR STATE BANNER */}
        {/* ==================================================================== */}
        {error && !loading && (
          <div className="mb-5 p-4 bg-red-50/80 border border-red-200 rounded-2xl text-xs text-red-800 space-y-3 shadow-2xs">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <strong className="font-bold text-red-900 block text-xs">
                  Location or Directions Error
                </strong>
                <p className="text-red-700 text-[11.5px] mt-0.5 leading-relaxed">
                  {error}
                </p>
              </div>
            </div>
            <div className="text-right pt-1 border-t border-red-100">
              <button
                type="button"
                onClick={handleGetLocationAndDirections}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-xs transition-colors shadow-2xs cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Retry
              </button>
            </div>
          </div>
        )}

        {/* ACCURACY WARNING BANNER */}
        {accuracyWarning && !error && !loading && (
          <div className="mb-4 p-3 bg-amber-50/90 border border-amber-200/80 rounded-xl text-xs text-amber-800 flex items-center gap-2.5 shadow-2xs">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-[11.5px] leading-tight">{accuracyWarning}</span>
          </div>
        )}

        {/* ==================================================================== */}
        {/* C. MODERN TRAVEL METRIC CARDS */}
        {/* ==================================================================== */}
        {routeData && !loading && (
          <div className="space-y-3.5 mb-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Distance Metric Card */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded-lg bg-teal-50 text-teal-600 border border-teal-100/70 flex items-center justify-center">
                      <Car className="w-3.5 h-3.5" />
                    </span>
                    Driving Distance
                  </span>
                </div>
                <div className="flex items-baseline mt-1">
                  <span className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {routeData.distanceKm}
                  </span>
                  <span className="text-xs font-bold text-slate-500 ml-1.5 uppercase">
                    km
                  </span>
                </div>
                <div className="text-[10.5px] text-slate-400 mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span>Fastest road corridor</span>
                </div>
              </div>

              {/* Travel Time Metric Card (Strong Visual Emphasis) */}
              <div className="p-4 bg-gradient-to-br from-teal-50/90 via-white to-emerald-50/40 rounded-2xl border-2 border-teal-200/90 shadow-2xs flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-2xs">
                      <Clock className="w-3.5 h-3.5" />
                    </span>
                    Est. Travel Time
                  </span>
                  {routeData.isTrafficAware ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200/70">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse motion-reduce:animate-none"></span>
                      Live
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                      Standard
                    </span>
                  )}
                </div>

                <div className="flex items-baseline mt-1">
                  <span className="text-2xl md:text-3xl font-extrabold text-teal-950 tracking-tight">
                    ~{routeData.durationMin}
                  </span>
                  <span className="text-xs font-bold text-teal-800 ml-1.5 uppercase">
                    min
                  </span>
                </div>

                <div className="text-[10.5px] mt-2 pt-2 border-t border-teal-100 flex items-center justify-between">
                  {routeData.isTrafficAware ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline shrink-0" />
                      with live traffic
                    </span>
                  ) : (
                    <span className="text-slate-500 font-medium">
                      without live traffic
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ==================================================================== */}
            {/* D. ESTIMATED ARRIVAL TIME BANNER */}
            {/* ==================================================================== */}
            {estimatedArrival && (
              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/70 flex items-center justify-between text-xs text-emerald-950 shadow-2xs">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Estimated arrival:{' '}
                    <strong className="font-extrabold text-emerald-900">
                      {estimatedArrival}
                    </strong>
                  </span>
                </div>
                <span className="text-[10px] text-emerald-700/80 font-medium hidden sm:inline">
                  Estimated based on current route
                </span>
              </div>
            )}

            {/* ==================================================================== */}
            {/* F. ROUTING PROVIDER STATUS */}
            {/* ==================================================================== */}
            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Routing Engine
                </span>
                {routeData.isTrafficAware ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10.5px] font-bold rounded-md border border-emerald-200/80">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    Live traffic-aware route
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-700 text-[10.5px] font-semibold rounded-md border border-slate-200">
                    Traffic data unavailable
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {routeData.isTrafficAware
                  ? 'ETA includes real-time congestion and historical traffic patterns via TomTom.'
                  : 'Estimated duration is calculated without live traffic conditions via Geoapify fallback. Actual travel time may vary.'}
              </p>
            </div>

            {/* ==================================================================== */}
            {/* E. COLLAPSIBLE GPS LOCATION DETAILS */}
            {/* ==================================================================== */}
            <div className="border border-slate-200/60 rounded-xl overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => setShowGpsDetails(!showGpsDetails)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50/60 hover:bg-slate-100/70 transition-colors text-left cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                aria-expanded={showGpsDetails}
              >
                <div className="flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 text-teal-600" />
                  <span className="text-xs font-semibold text-slate-700">
                    GPS Location Details
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                  <span className="text-[10.5px] text-slate-500 hidden sm:inline">
                    {showGpsDetails ? 'Hide coordinates' : 'View coordinates'}
                  </span>
                  {showGpsDetails ? (
                    <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </div>
              </button>

              {showGpsDetails && (
                <div className="p-3 bg-slate-50/40 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 bg-white rounded-lg border border-slate-200/60">
                    <span className="text-[9.5px] uppercase font-bold text-slate-400 block">
                      Latitude
                    </span>
                    <span className="font-mono font-semibold text-slate-800 text-[11px]">
                      {routeData.latitude.toFixed(5)}
                    </span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200/60">
                    <span className="text-[9.5px] uppercase font-bold text-slate-400 block">
                      Longitude
                    </span>
                    <span className="font-mono font-semibold text-slate-800 text-[11px]">
                      {routeData.longitude.toFixed(5)}
                    </span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200/60">
                    <span className="text-[9.5px] uppercase font-bold text-slate-400 block">
                      Accuracy
                    </span>
                    <span className="font-mono font-semibold text-slate-800 text-[11px]">
                      {routeData.accuracy ? `±${routeData.accuracy}m` : 'High'}
                    </span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200/60">
                    <span className="text-[9.5px] uppercase font-bold text-slate-400 block">
                      Updated At
                    </span>
                    <span className="font-mono font-semibold text-slate-800 text-[11px]">
                      {routeData.timestamp}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* G. PREMIUM ACTION BUTTONS */}
      {/* ==================================================================== */}
      <div className="pt-2 border-t border-slate-100">
        {!routeData && !loading && (
          <div className={userCoords ? "grid grid-cols-1 sm:grid-cols-2 gap-2.5" : ""}>
            <button
              type="button"
              onClick={handleGetLocationAndDirections}
              className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:ring-offset-1"
            >
              <Locate className="w-4 h-4" />
              {error ? "Recalculate Directions" : "Get My Location & Directions"}
            </button>
            {userCoords && (
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-slate-400 focus:ring-offset-1"
              >
                Open Navigation
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}

        {routeData && !loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Secondary Action: Recalculate */}
            <button
              type="button"
              onClick={handleGetLocationAndDirections}
              className="py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-slate-300 focus:ring-offset-1"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              Recalculate
            </button>

            {/* Primary Action: Open Navigation */}
            <a
              href={googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:ring-offset-1"
            >
              Open Navigation
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
