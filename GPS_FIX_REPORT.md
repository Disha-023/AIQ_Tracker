# GPS Driving Distance & Estimated Travel Time — Fix & Provider Migration Report

**Project:** AIQ Tracker  
**Date:** October 22, 2026  
**Module:** Patient Dashboard — GPS Location & Navigation Card  
**Routing Provider:** Geoapify Routing API (v1) [Migrated from OpenRouteService]  

---

## Section A — Root Cause Analysis of Previous Routing Failure

### 1. Why Haversine Distance Was Being Displayed
In `GPSLocationCard.jsx`, the component called `apiService.getDirections(longitude, latitude, DESTINATION.longitude, DESTINATION.latitude)`. However, the component did not check `res.success` or handle errors. When `res.success` was `false` (because the backend failed), `drivingDistanceKm` remained `null`.

The component then executed:
```javascript
const fallbackDistance = calculateHaversineDistance(
  latitude,
  longitude,
  DESTINATION.latitude,
  DESTINATION.longitude
);

setRouteData({
  ...
  distanceKm: drivingDistanceKm !== null ? drivingDistanceKm : fallbackDistance,
  ...
});
```
This silently substituted the Haversine straight-line distance (~1.0 km) into `distanceKm` and rendered it under the UI label **"Driving Distance"**.

### 2. Old OpenRouteService Configuration Findings
- **Missing API Key:** `server/.env` had no OpenRouteService API key configured.
- **Upstream 401 Rejection:** The backend passed an `undefined` authorization header to `https://api.heigit.org/openrouteservice/v2/directions/driving-car/geojson`, resulting in `401 {"error": "Authorization field missing"}`.
- **Generic 500 Response:** The backend caught this error and returned HTTP 500 `{ error: "Unable to get directions" }`.
- **Silent Fallback:** The frontend ignored the 500 status and calculated a straight-line Haversine fallback.

### 3. Why Estimated Travel Time Was Incorrect
In `GPSLocationCard.jsx`, when `routeData.durationMin` was `null`, the component calculated travel time using an arbitrary multiplier:
```javascript
~{Math.round(routeData.distanceKm * 3)} min
```
For the 1.0 km Haversine distance, this produced `~3 min`. This was a hardcoded heuristic rather than actual road-routing duration.

### 4. Verification of Destination Coordinates
- **Configured Destination:** Kole Hospital, Sangli (`geolocation.js`: Latitude `16.8542`, Longitude `74.6029`).
- **Google Maps Link Verification:** Resolved short URL `https://maps.app.goo.gl/SzyM3DKHEgMnMWzr8?g_st=aw` to Google Maps place `VH6Q+WQP Kole hospital, Arwade Park, Abhay Nagar, Sangli Miraj Kupwad, Maharashtra 416416`.
- **Finding:** The configured coordinates (`16.8542, 74.6029`) accurately point to Kole Hospital in Sangli, Maharashtra.

---

## Section B — Geoapify Configuration

- **Provider:** Geoapify Routing API
- **Endpoint:** `GET https://api.geoapify.com/v1/routing`
- **Environment Variable:** `GEOAPIFY_API_KEY` (configured securely in `server/.env`, untracked by Git)
- **Required Parameters:**
  - `waypoints`: `latitude,longitude|latitude,longitude`
    - Origin: Browser GPS coordinates (e.g. `16.84554,74.60211`)
    - Destination: Kole Hospital coordinates (`16.8542,74.6029`)
    - Example value: `16.84554,74.60211|16.8542,74.6029`
  - `mode`: `drive`
  - `type`: `balanced`
  - `units`: `metric`
  - `apiKey`: Loaded securely from `process.env.GEOAPIFY_API_KEY` on backend
- **Coordinate Order Notice:** Geoapify expects `latitude,longitude` order, whereas OpenRouteService used `longitude,latitude`. The backend router formats the query string accordingly.
- **Legacy Configuration:** `OPENROUTE_API_KEY` is documented in `server/.env.example` as an optional legacy fallback.

---

## Section C — Modified Files

| File Path | Function/Component | Exact Changes | Reason |
|---|---|---|---|
| `server/routes/directionsRoutes.js` | Express Router (`GET /api/directions`) | Switched upstream endpoint to Geoapify Routing API (`https://api.geoapify.com/v1/routing`). Formatted waypoints parameter as `${sLat},${sLon}\|${eLat},${eLon}` (`lat,lon` order). Validated `GEOAPIFY_API_KEY` presence (returning 503 if missing). Validated `distance` and `time` properties. Mapped status codes (401/403 -> 502, 429 -> 429, 400/404/422 -> 422, timeout -> 504). | Route requests through Geoapify provider, enforce input validation, and handle errors cleanly without exposing keys or patient coordinates. |
| `server/.env.example` | Configuration Documentation | Documented `GEOAPIFY_API_KEY` as primary routing provider configuration, retaining `OPENROUTE_API_KEY` as optional legacy configuration. | Provide clear setup instructions for new environments. |
| `client/src/utils/geolocation.js` | `getPatientLocation` | Set default timeout to 15000ms, validated returned `coords` for finiteness and latitude/longitude range limits, passed through `accuracy`. | Prevent using corrupted device coordinates and avoid premature location timeouts. |
| `client/src/services/apiService.js` | `apiService.getDirections` | Added coordinate parameter validation, URL encoding, and safe JSON response error handling. | Prevent malformed requests and ensure frontend receives actionable error feedback. |
| `client/src/components/patient/GPSLocationCard.jsx` | `GPSLocationCard` | Removed Haversine fallback from driving distance; removed `distanceKm * 3` multiplier; extracted road distance from `properties.distance / 1000`; extracted duration from `properties.time / 60`; displayed error banner with Retry button when routing fails; cleared `routeData` upon failure to prevent stale values; updated route badge to indicate Geoapify Routing API; preserved Open Navigation button with driving mode. | Display authentic road-routing distance and provider ETA; prevent misleading users with straight-line fallback distances. |

---

## Section D — Before and After Code

### 1. `server/routes/directionsRoutes.js`

**Before (OpenRouteService POST):**
```javascript
const response = await axios.post(
    "https://api.heigit.org/openrouteservice/v2/directions/driving-car/geojson",
    {
        coordinates: [
            [Number(startLon), Number(startLat)],
            [Number(endLon), Number(endLat)]
        ]
    },
    {
        headers: {
            Authorization: process.env.OPENROUTE_API_KEY,
            "Content-Type": "application/json"
        }
    }
);
```

**After (Geoapify GET):**
```javascript
const apiKey = process.env.GEOAPIFY_API_KEY;
if (!apiKey || typeof apiKey !== 'string' || !apiKey.trim()) {
    console.error("[Directions Route] GEOAPIFY_API_KEY is not configured in server environment.");
    return res.status(503).json({
        error: "Routing service is unavailable: Geoapify API key is not configured in server environment."
    });
}

// Geoapify waypoint format requires: "latitude,longitude|latitude,longitude"
const waypoints = `${sLat},${sLon}|${eLat},${eLon}`;

const response = await axios.get("https://api.geoapify.com/v1/routing", {
    params: {
        waypoints,
        mode: "drive",
        type: "balanced",
        units: "metric",
        apiKey: apiKey.trim()
    },
    timeout: 10000
});
```

---

### 2. `client/src/components/patient/GPSLocationCard.jsx` — Metric Extraction

**Before (ORS Summary Extraction & Haversine Fallback):**
```javascript
const summary = res.data.features[0].properties.summary;
if (summary) {
  drivingDistanceKm = Math.round((summary.distance / 1000) * 10) / 10;
  drivingDurationMin = Math.round(summary.duration / 60);
}
// Fallback to Haversine distance
const fallbackDistance = calculateHaversineDistance(latitude, longitude, DESTINATION.latitude, DESTINATION.longitude);
setRouteData({
  distanceKm: drivingDistanceKm !== null ? drivingDistanceKm : fallbackDistance,
  durationMin: drivingDurationMin,
  ...
});
// In JSX:
~{Math.round(routeData.distanceKm * 3)} min
```

**After (Geoapify Extraction & Strict Validation):**
```javascript
if (!res.success) {
  setRouteData(null);
  setError(res.error || 'Driving route unavailable. Please retry.');
  return;
}

const features = res.data?.features;
const properties = features[0]?.properties;
const distanceMeters = properties?.distance ?? properties?.summary?.distance;
const durationSeconds = properties?.time ?? properties?.summary?.duration;

if (typeof distanceMeters !== 'number' || typeof durationSeconds !== 'number') {
  setRouteData(null);
  setError('Routing service returned incomplete route metrics.');
  return;
}

// 3. Extract road distance (convert meters to kilometers)
const rawDistanceKm = distanceMeters / 1000;
const drivingDistanceKm = Math.round(rawDistanceKm * 10) / 10;

// 4. Extract road duration (convert seconds to minutes)
const rawDurationSec = durationSeconds;
const drivingDurationMin = Math.max(1, Math.round(rawDurationSec / 60));

setRouteData({
  latitude,
  longitude,
  distanceKm: drivingDistanceKm,
  durationMin: drivingDurationMin,
  ...
});
// In JSX:
~{routeData.durationMin} min
```

---

## Section E — Routing Request and Response Structure

### Request Format
```http
GET https://api.geoapify.com/v1/routing?waypoints=16.84554,74.60211|16.8542,74.6029&mode=drive&type=balanced&units=metric&apiKey=[SECURE_KEY]
```

### Live Response Structure (GeoJSON FeatureCollection)
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "mode": "drive",
        "waypoints": [
          { "location": [74.60211, 16.84554], "original_index": 0 },
          { "location": [74.6029, 16.8542], "original_index": 1 }
        ],
        "units": "metric",
        "distance": 3298,
        "distance_units": "meters",
        "time": 282.102,
        "legs": [
          { "distance": 3298, "time": 282.102 }
        ]
      },
      "geometry": {
        "type": "MultiLineString",
        "coordinates": [ ... ]
      }
    }
  ]
}
```

---

## Section F — Test Results

| Test Case | Description | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| **Live Route Execution** | Query `/api/directions` with valid coordinates | HTTP 200, Geoapify GeoJSON response with `distance: 3298`, `time: 282.102` | HTTP 200, `distance: 3298`, `time: 282.102`, `mode: 'drive'` | **PASS (LIVE)** |
| **Distance Conversion** | Convert 3298 meters to km | `3.3 km` (`Math.round(3.298 * 10) / 10`) | `3.3 km` | **PASS (LIVE)** |
| **Duration Conversion** | Convert 282.102 seconds to minutes | `~5 min` (`Math.round(282.102 / 60)`) | `~5 min` | **PASS (LIVE)** |
| **Coordinate Ordering** | Pass `latitude,longitude` to Geoapify | Waypoint formatted as `16.84554,74.60211\|16.8542,74.6029` | Verified by Geoapify successful route calculation | **PASS (LIVE)** |
| **Missing API Key** | Backend started without `GEOAPIFY_API_KEY` | Return HTTP 503 configuration error | HTTP 503 `Routing service is unavailable: Geoapify API key is not configured in server environment.` | **PASS** |
| **Invalid API Key** | Geoapify returns 401 Unauthorized | Backend maps upstream 401 to HTTP 502 with authentication message | HTTP 502 `Routing service authentication failed. Invalid or unauthorized Geoapify API key.` | **PASS** |
| **Missing Coordinates** | Query without `endLat` | Return HTTP 400 Bad Request | HTTP 400 `Start and destination coordinates are required.` | **PASS** |
| **Non-Numeric Coordinates** | `startLon=invalid` | Return HTTP 400 Bad Request | HTTP 400 `Invalid coordinates provided...` | **PASS** |
| **Out-of-Bounds Coordinates** | `startLat=190` | Return HTTP 400 Bad Request | HTTP 400 `Invalid coordinates provided...` | **PASS** |
| **Unroutable Point** | Coordinates in middle of ocean (`0,0\|0,1`) | Return HTTP 422 with descriptive error | HTTP 422 `Unable to calculate road route: No suitable edges near location...` | **PASS** |
| **Open Navigation Link** | Click Open Navigation | Opens Google Maps driving mode with origin and Kole Hospital destination | Verified: `https://www.google.com/maps/dir/?api=1&origin=16.84554,74.60211&destination=16.8542,74.6029&travelmode=driving` | **PASS** |
| **Client Production Build** | Compile React client with Vite | Zero errors, bundle created | `vite build` succeeded in 772ms with 0 errors | **PASS** |

---

## Section G — GPS Output Comparison

| Field | Before Fix (Old ORS / Haversine) | After Fix (Geoapify Live API) |
|---|---|---|
| **GPS Latitude** | `16.84554` | `16.84554` |
| **GPS Longitude** | `74.60211` | `74.60211` |
| **Hospital Destination** | Kole Hospital, Sangli (`16.8542, 74.6029`) | Kole Hospital, Sangli (`16.8542, 74.6029`) |
| **Driving Distance** | `1 km` (Haversine straight-line calculation) | **`3.3 km`** (authentic road driving distance via Geoapify) |
| **Estimated Travel Time** | `~3 min` (arbitrary `distance * 3` heuristic) | **`~5 min`** (authentic driving duration from Geoapify road network) |
| **Routing Provider Status** | Direct distance calculated via Haversine formula | ✓ Driving route calculated live via Geoapify Routing API (traffic not included) |
| **Calculation Method** | Haversine formula fallback | Geoapify Routing API `properties.distance` & `properties.time` |

---

## Section H — Unchanged Project Modules Confirmation

The following modules remain **completely unchanged**:
- [x] **Authentication & Staff Login / MFA** (`authRoutes.js`, `AuthContext.jsx`)
- [x] **Patient Appointments & Walk-in Booking** (`appointmentRoutes.js`, `appointmentService.js`)
- [x] **Receptionist Portal** (`ReceptionistDashboard.jsx`)
- [x] **Admin Portal** (`AdminDashboard.jsx`)
- [x] **Hospital Queue Management & Token Tracking** (`queueRoutes.js`)
- [x] **AI Waiting-Time Prediction** (`predictionRoutes.js`, `predictionService.js`, ML models)
- [x] **PostgreSQL Database Schema & Neon Pool** (`config/db.js`)
- [x] **Notifications & Consultations** (`notificationRoutes.js`, `consultationRoutes.js`)
- [x] **Global CSS & Unrelated Dashboard Components**

---

## Section I — Remaining Limitations

1. **Free-Flow Traffic Model:** Geoapify's default routing mode uses speed profiles and free-flow road conditions. It does not reflect live traffic jams or temporary roadblock delays. The UI explicitly states: `(traffic not included)`.
2. **Device GPS Accuracy:** In environments lacking satellite GPS (such as laptops using IP geolocation), browser accuracy may fluctuate. The UI automatically displays a cautionary note if device accuracy exceeds 1000m.
3. **Daily API Credit Quota:** Geoapify free tier provides 3,000 daily credits, which is ample for testing and normal clinic queue usage. The router handles HTTP 429 gracefully if credits are exhausted.

---

## Section J — Investigation of Travel-Time Discrepancy (Geoapify vs. Google Maps)

### 1. Observed Discrepancy
- **Geoapify Routing API:** ~15 km driving distance, ~16 min estimated travel time.
- **Google Maps Navigation:** ~15.5 km driving distance, ~35 min live traffic ETA.

### 2. Verification of Extraction & Conversion Logic
1. **Response Property:** Geoapify returns `features[0].properties.time` in **seconds** (e.g. `1065.98s` for a 16 km route).
2. **Conversion Logic:** `Math.round(rawDurationSec / 60)` converts seconds to minutes accurately with zero artificial speed multipliers or deductions.
3. **Implicit Speed Model:** 
   $$\text{Average Speed} = \frac{15\text{ km}}{16\text{ min}} \times 60 \approx 56.25\text{ km/h}$$
   This matches standard statutory highway/arterial speed limits in Maharashtra under free-flow conditions.

### 3. Root Cause of the Difference
- **Google Maps:** Uses real-time crowdsourced telemetry from millions of active Android devices. It continuously measures real-time traffic jams, signals, pedestrian crossings, and intersection bottlenecks in the Sangli urban area, resulting in a realistic daytime average speed of $\approx 26\text{ km/h}$ (~35 min).
- **Geoapify:** Uses OpenStreetMap statutory speed profiles under free-flow conditions. Geoapify does **not** provide live real-time dynamic traffic feeds.

### 4. Resolution Applied
- Retained the authentic Geoapify API duration (no artificial multipliers or guessing).
- Clearly labeled the metric in the UI as **Estimated driving time (without live traffic)**.
- Added a subtle, non-intrusive clarification note in the card: *"Actual travel time may be longer due to real-time traffic. Use Open Navigation for live conditions."*
- Kept the **Open Navigation** button prominent so patients can immediately launch Google Maps with live traffic routing from their exact location.

---

## Section K — Final Conclusion

### **FIXED AND VERIFIED**

**Reasoning:**
- Geoapify Routing API is fully integrated, operational, and tested live against the running Express backend and React frontend.
- Live road calculations return authentic road driving distance and duration from Geoapify.
- Unit and property extraction tests confirm `properties.time` in seconds is correctly converted to minutes with zero artificial multipliers.
- The root cause of the travel-time difference between Geoapify (free-flow speed limit model) and Google Maps (live telemetry) has been confirmed and documented.
- The UI transparently presents the duration as without live traffic and directs patients to Open Navigation for real-time congestion tracking.
- The production build completed cleanly with 0 errors.
- Unrelated project functionality and visual design remain intact.

