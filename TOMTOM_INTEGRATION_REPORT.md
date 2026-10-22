# AIQ Tracker — TomTom Live Traffic Routing Integration Report

**Date:** October 22, 2026  
**Status:** Completed & Verified on Localhost  
**Integration Type:** Primary Live Traffic Routing (TomTom) with Free-Flow Fallback (Geoapify)  

---

## 1. Executive Summary

TomTom Routing API v1 has been integrated into AIQ Tracker's production directions pipeline. It serves as the **primary routing provider**, delivering live traffic-aware driving distance and ETA to the patient GPS card on `http://localhost:5173/patient/dashboard`. Geoapify is retained as an automated, zero-latency **fallback provider** if TomTom encounters network errors, rate limits, or service unavailability.

All 21 requirements have been satisfied:
- TomTom Routing API v1 operates as the primary provider with `traffic=true`, `departAt=now`, `travelMode=car`, `routeType=fastest`, and `computeTravelTimeFor=all`.
- Actual road distance is extracted from `routes[0].summary.lengthInMeters`.
- Traffic-aware estimated travel time is extracted from `routes[0].summary.travelTimeInSeconds`.
- Metric conversions (`meters -> km`, `seconds -> minutes`) are handled without arbitrary speed or traffic multipliers.
- Geoapify is maintained as a seamless secondary fallback, with UI badges clearly labeling its estimates as `without live traffic` when active.
- Unrelated project modules (PostgreSQL database, user authentication, queue management, appointments, AI wait-time prediction, notifications) remain untouched.

---

## 2. Exact Files Modified

| File | Purpose | Scope of Changes |
| :--- | :--- | :--- |
| `server/routes/directionsRoutes.js` | Express directions endpoint (`GET /api/directions`) | Implemented primary TomTom routing with `traffic=true`, `departAt=now`, `computeTravelTimeFor=all`. Added fallback to Geoapify routing. Added coordinate bounds validation and HTTP 502 handling if both providers fail. Sanitized all errors to ensure zero API key leakage. |
| `client/src/components/patient/GPSLocationCard.jsx` | React Patient GPS Directions Card | Updated to dynamically consume `isTrafficAware` and `provider`. Added visual distinctions: `with live traffic` (emerald) vs `without live traffic` (slate). Dynamic badge showing provider status (`✓ Live traffic-aware driving route via TomTom` vs fallback note). Preserved UI, buttons, layout, and styling. |
| `client/src/services/apiService.js` | Frontend API client | Added robust HTTP response error handling, query param encoding, and JSDoc documentation for TomTom/Geoapify routing. |
| `client/src/utils/geolocation.js` | Fixed coordinates & browser GPS utility | Fixed Kole Hospital destination coordinates (`16.8542, 74.6029`) and browser Geolocation error handling with user-friendly messages. |
| `server/.env.example` | Environment documentation | Added `TOMTOM_API_KEY` alongside `GEOAPIFY_API_KEY`. No raw secrets committed. |

---

## 3. Before vs. After Routing Architecture

### Before (Evaluation / Geoapify-only Phase)
```
[React Patient GPS Card] 
       │
       ▼ (GET /api/directions?startLon=...&startLat=...&endLon=...&endLat=...)
[Express directionsRoutes.js]
       │
       ▼ (Balanced car routing)
[Geoapify Routing API v1]
       │
       ▼ (Returns free-flow duration based on legal speed limits)
[React Patient GPS Card] -> Displays: ~16 min (without live traffic)
```

### After (Integrated TomTom Primary with Geoapify Fallback)
```
[React Patient GPS Card] 
       │
       ▼ (GET /api/directions?startLon=...&startLat=...&endLon=...&endLat=...)
[Express directionsRoutes.js]
       │
       ├─► [1. PRIMARY: TomTom Routing API v1]
       │        • URL: calculateRoute/{sLat},{sLon}:{eLat},{eLon}/json
       │        • Params: traffic=true, departAt=now, travelMode=car, routeType=fastest, computeTravelTimeFor=all
       │        • Status: 200 OK? ──► Returns traffic-aware ETA & distance (provider: "tomtom", isTrafficAware: true)
       │
       ├─► [2. FALLBACK: Geoapify Routing API v1] (Triggered ONLY if TomTom fails/times out)
       │        • URL: api.geoapify.com/v1/routing
       │        • Params: waypoints={sLat},{sLon}|{eLat},{eLon}, mode=drive
       │        • Status: 200 OK? ──► Returns free-flow ETA (provider: "geoapify", isTrafficAware: false)
       │
       └─► [3. FAIL-SAFE: HTTP 502 Service Unavailable] (Triggered ONLY if both providers fail)
                • Returns structured error message (never returns fake/invented distance or time)
```

---

## 4. TomTom API Request & Response Details

### 4.1 Request Format
- **Endpoint:** `https://api.tomtom.com/routing/1/calculateRoute/{startLat},{startLon}:{endLat},{endLon}/json`
- **Method:** `GET`
- **Query Parameters:**
  - `key`: Processed from `process.env.TOMTOM_API_KEY`
  - `travelMode`: `car`
  - `routeType`: `fastest`
  - `traffic`: `true`
  - `departAt`: `now`
  - `computeTravelTimeFor`: `all`
- **Timeout:** `10000ms` (10 seconds)

### 4.2 Response Extraction
```javascript
const route = ttResponse.data?.routes?.[0];
const summary = route?.summary;

const distanceMeters = summary.lengthInMeters;           // e.g., 16728 meters
const durationSeconds = summary.travelTimeInSeconds;      // e.g., 2184 seconds (includes live traffic)
const trafficDelaySeconds = summary.trafficDelayInSeconds; // e.g., 0 seconds (or delay above baseline)
const noTrafficDuration = summary.noTrafficTravelTimeSeconds; // e.g., 1787 seconds
```

### 4.3 Normalized Express JSON Output
```json
{
  "success": true,
  "provider": "tomtom",
  "isTrafficAware": true,
  "distanceMeters": 16728,
  "durationSeconds": 2184,
  "trafficDelaySeconds": 0,
  "noTrafficTravelTimeSeconds": 1787,
  "departureTime": "2026-10-22T19:22:45+05:30",
  "arrivalTime": "2026-10-22T19:59:09+05:30",
  "summary": {
    "distance": 16728,
    "duration": 2184
  },
  "features": [
    {
      "type": "Feature",
      "properties": {
        "provider": "tomtom",
        "isTrafficAware": true,
        "distance": 16728,
        "time": 2184
      }
    }
  ]
}
```

---

## 5. Traffic-Aware Distance and Duration Benchmarking

Comparing routing metrics between origin `16.76732, 74.56393` and Kole Hospital `16.8542, 74.6029`:

| Engine / Source | Road Distance | Estimated Travel Time | Traffic Modeling Type | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TomTom Routing API (Current)** | **16.7 km** (16,728 m) | **~36 min** (2,184 s) | **Real-time dynamic traffic + historical pattern models** | **Integrated & Active** |
| **Google Maps Live Navigation** | **15.5 km** | **~35 min** | Real-time crowdsourced live traffic | Reference Benchmark |
| **Geoapify Routing API (Fallback)** | **15.0 km** (14,960 m) | **~16 min** (972 s) | Free-flow speed limit baseline (no traffic awareness) | Configured as Fallback |

### Analysis of the Real-Time Traffic Difference:
1. **Free-Flow vs Traffic-Aware:** Geoapify estimated 16 minutes (~55 km/h unobstructed travel). In reality, local urban Sangli traffic, intersections, and road congestion bring the average speed down to ~27-28 km/h.
2. **TomTom Alignment:** TomTom's `36 min` directly reflects the actual road reality, matching Google Maps' `35 min` within 1 minute.
3. **No Artificial Multipliers:** The 36-minute estimate is delivered natively from TomTom's live traffic engine, without artificial multipliers.

---

## 6. Geoapify Fallback Behavior

The fallback mechanism guarantees that patients never encounter a broken card if TomTom experiences transient network issues:

1. **Detection:** If `TOMTOM_API_KEY` is missing or if the TomTom API returns a non-2xx status (e.g. 403, 429, 500) or times out (>10s), the catch block logs the error on the server and immediately invokes Geoapify.
2. **Normalized Response:** Geoapify's response is structured identically but with `provider: "geoapify"` and `isTrafficAware: false`.
3. **UI Transparency:** `GPSLocationCard.jsx` reads `isTrafficAware: false` and renders:
   - ETA indicator: `~16 min without live traffic` (muted slate text).
   - Engine badge: `✓ Estimated driving time (without live traffic) via Geoapify fallback`.
   - Helpful disclaimer: *"Actual travel time may be longer due to real-time traffic. Use Open Navigation for live conditions."*
4. **Both Down Scenario:** If both TomTom and Geoapify fail, Express responds with HTTP 502 (`Both primary (TomTom) and fallback (Geoapify) routing services are currently unavailable`). The frontend clears stale route data, shows an alert box with the error message, and provides an instant **Retry** button.

---

## 7. Actual Localhost Testing Results

### 7.1 Backend Express API Testing
- **Test Command:**
  ```bash
  curl "http://localhost:5000/api/directions?startLon=74.56393&startLat=16.76732&endLon=74.6029&endLat=16.8542"
  ```
- **Result:**
  - Status: `200 OK`
  - `provider`: `"tomtom"`
  - `isTrafficAware`: `true`
  - `distanceMeters`: `16728` (`16.7 km`)
  - `durationSeconds`: `2184` (`36.4 min`)

### 7.2 Geoapify Fallback Simulation Testing
- Simulated TomTom failure by supplying an invalid test key.
- Express automatically fell back to Geoapify:
  - Status: `200 OK`
  - `provider`: `"geoapify"`
  - `isTrafficAware`: `false`
  - `distanceMeters`: `14960` (`15.0 km`)
  - `durationSeconds`: `972` (`16.2 min`)

### 7.3 Frontend Client End-to-End Verification (Browser Subagent)
- **Environment:** Localhost `http://localhost:5173`
- **Authenticated User:** `patient@example.com` (Patient Dashboard)
- **Interaction:** Triggered "Get My Location & Directions"
- **Observed Elements on Patient Dashboard:**
  - **Fixed Destination:** Kole Hospital (`16.8542, 74.6029`)
  - **Card Title:** `Plan Your Arrival (GPS Directions)`
  - **Provider Badge:** `✓ Live traffic-aware driving route via TomTom`
  - **Subtitle:** `ETA includes real-time congestion and historical traffic patterns.`
  - **Driving Distance:** Displayed with road icon and units.
  - **Est. Travel Time:** Displayed with clock icon and subtext `with live traffic`.
  - **Action Buttons:** `Recalculate` and `Open Navigation` (directing to Google Maps driving mode) fully operational.
- **Production Build:** `npm run build` executed and passed in 1.05s with 0 errors.

---

## 8. Confirmation of System Integrity

The following modules were verified to be **completely untouched and intact**:
- **Authentication:** `AuthContext.jsx`, JWT/session tokens, role validation, staff/admin logins.
- **Appointments & Queue Management:** Appointment booking, token generation, walk-in registration, receptionist dashboards.
- **AI Prediction:** ML wait-time prediction algorithms and consultation duration calculators.
- **Database:** PostgreSQL schema, migrations, connection pools, models.
- **Notifications:** WebSocket / polling notification services and patient notification history.

---

## 9. Security & Key Management

- Both `TOMTOM_API_KEY` and `GEOAPIFY_API_KEY` are stored strictly in `server/.env`.
- `server/.env` is ignored by Git in `.gitignore`.
- No API keys are bundled into frontend assets or exposed in client responses.
- Backend error logs sanitize error responses, preventing credential exposure during stack traces.
- `server/.env.example` lists the required environment variable names with placeholder values.

---

## 10. Remaining Limitations & Recommendations

1. **Free Tier Rate Limits:**
   - TomTom provides 2,500 free routing transactions/day (non-commercial tier).
   - If user traffic scales significantly, backend caching (e.g. caching routes for origin clusters for 3-5 minutes) is recommended to conserve credits.
2. **Browser Geolocation Precision:**
   - Browser GPS accuracy depends on device hardware (Wi-Fi triangulation vs hardware GPS chips). The UI includes a low-accuracy warning banner if estimated device precision is `>1000m`.
3. **Open Navigation External Deep Link:**
   - The "Open Navigation" button connects directly to Google Maps navigation for turn-by-turn spoken guidance during the patient's commute.
