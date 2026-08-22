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
  ExternalLink
} from 'lucide-react';
import {
  DESTINATION,
  calculateHaversineDistance,
  getPatientLocation
} from '../../utils/geolocation';
import { apiService } from '../../services/apiService';

export default function GPSLocationCard({ className = '' }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [routeData, setRouteData] = useState(null);

  const handleGetLocationAndDirections = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Get browser GPS coordinates
      const position = await getPatientLocation({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });

      const { latitude, longitude } = position;

      // 2. Call backend /api/directions (OpenRouteService via Express)
      const res = await apiService.getDirections(
        longitude,
        latitude,
        DESTINATION.longitude,
        DESTINATION.latitude
      );

      let drivingDistanceKm = null;
      let drivingDurationMin = null;
      let isRouteServiceLive = false;

      if (res.success && res.data && res.data.features && res.data.features.length > 0) {
        const summary = res.data.features[0].properties.summary;
        if (summary) {
          drivingDistanceKm = Math.round((summary.distance / 1000) * 10) / 10;
          drivingDurationMin = Math.round(summary.duration / 60);
          isRouteServiceLive = true;
        }
      }

      // Fallback to Haversine distance if driving route summary is unavailable
      const fallbackDistance = calculateHaversineDistance(
        latitude,
        longitude,
        DESTINATION.latitude,
        DESTINATION.longitude
      );

      setRouteData({
        latitude,
        longitude,
        distanceKm: drivingDistanceKm !== null ? drivingDistanceKm : fallbackDistance,
        durationMin: drivingDurationMin,
        isRouteServiceLive,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } catch (err) {
      console.error('GPS Directions Error:', err);
      setError(err.message || 'Unable to retrieve location or directions.');
      setRouteData(null);
    } finally {
      setLoading(false);
    }
  };

  const googleMapsDirectionsUrl = routeData
    ? `https://www.google.com/maps/dir/?api=1&origin=${routeData.latitude},${routeData.longitude}&destination=${DESTINATION.latitude},${DESTINATION.longitude}`
    : DESTINATION.googleMapsUrl;

  return (
    <div className={`bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between ${className}`}>
      <div>
        {/* Card Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-200 mb-4">
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-base">Plan Your Arrival (GPS Directions)</h3>
          </div>
          <span className="px-2.5 py-1 bg-teal-50 text-teal-800 text-xs font-bold rounded-full border border-teal-200 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-teal-600" />
            {DESTINATION.name}
          </span>
        </div>

        {/* Hospital Fixed Destination Info */}
        <div className="mb-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Fixed Destination</span>
              <span className="font-bold text-slate-900 text-sm">{DESTINATION.name}</span>
            </div>
            <a
              href={DESTINATION.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
            >
              Maps Link
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="text-[11px] text-slate-500">{DESTINATION.address}</p>
          <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Coordinates:</span>
            <span>{DESTINATION.latitude}, {DESTINATION.longitude}</span>
          </div>
        </div>

        {/* Error State Banner */}
        {error && (
          <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block">Location or Directions Error</strong>
                <span>{error}</span>
              </div>
            </div>
            <div className="text-right pt-1">
              <button
                onClick={handleGetLocationAndDirections}
                disabled={loading}
                className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-[11px] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Successful Directions Output */}
        {routeData && (
          <div className="space-y-3 mb-4">
            <div className="p-4 bg-teal-50/80 rounded-xl border border-teal-200 text-teal-900 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Your Current GPS Position
                </span>
                <span className="text-[10px] text-teal-600 font-semibold">
                  Updated at {routeData.timestamp}
                </span>
              </div>

              {/* Patient Coordinates Display */}
              <div className="grid grid-cols-2 gap-2 bg-white/80 p-2.5 rounded-lg border border-teal-100 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-sans font-bold">Latitude</span>
                  <span className="font-semibold text-slate-800">{routeData.latitude.toFixed(5)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-sans font-bold">Longitude</span>
                  <span className="font-semibold text-slate-800">{routeData.longitude.toFixed(5)}</span>
                </div>
              </div>

              {/* Driving Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-xl border border-teal-200 text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center justify-center gap-1">
                    <Car className="w-3.5 h-3.5 text-teal-600" />
                    Driving Distance
                  </span>
                  <div className="text-xl font-extrabold text-teal-700 mt-1">
                    {routeData.distanceKm} <span className="text-xs font-semibold text-teal-900">km</span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-teal-200 text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center justify-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    Est. Travel Time
                  </span>
                  <div className="text-xl font-extrabold text-teal-700 mt-1">
                    {routeData.durationMin !== null ? (
                      <>{routeData.durationMin} <span className="text-xs font-semibold text-teal-900">min</span></>
                    ) : (
                      <span className="text-xs font-medium text-slate-500">~{Math.round(routeData.distanceKm * 3)} min</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Route Engine Badge */}
              <div className="text-[10px] text-center text-teal-700 font-semibold pt-1">
                {routeData.isRouteServiceLive ? (
                  <span>✓ Driving route calculated live via OpenRouteService backend API</span>
                ) : (
                  <span>Direct distance calculated via Haversine formula</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-2 space-y-2">
        {!routeData && !loading && (
          <button
            onClick={handleGetLocationAndDirections}
            className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Locate className="w-4 h-4" />
            Get My Location & Directions
          </button>
        )}

        {loading && (
          <button
            disabled
            className="w-full py-3 px-4 bg-teal-100 text-teal-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-wait"
          >
            <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
            Getting location & fetching directions...
          </button>
        )}

        {routeData && !loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={handleGetLocationAndDirections}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Recalculate
            </button>

            <a
              href={googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
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
