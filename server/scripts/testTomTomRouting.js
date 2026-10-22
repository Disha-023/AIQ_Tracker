/**
 * TomTom vs Geoapify Traffic-Aware Routing Accuracy Test
 * 
 * Compares live routing results for AIQ Tracker between:
 * - Geoapify Routing API (free-flow speed limit model)
 * - TomTom Routing API v1 (traffic-aware model)
 * - Google Maps (historical reference)
 */

require('dotenv').config();
const axios = require('axios');

async function runRoutingComparison() {
  const originLat = 16.76732;
  const originLon = 74.56393;
  const destLat = 16.8542;
  const destLon = 74.6029;

  console.log('================================================================');
  console.log('AIQ TRACKER — GPS ROUTING ACCURACY EVALUATION TEST');
  console.log('================================================================');
  console.log(`Test Execution Time : ${new Date().toISOString()} (IST: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })})`);
  console.log(`Origin Coordinates  : ${originLat}, ${originLon}`);
  console.log(`Destination (Kole)  : ${destLat}, ${destLon} (Kole Hospital, Sangli)`);
  console.log('----------------------------------------------------------------\n');

  // 1. Check TomTom API Key
  const tomtomKey = process.env.TOMTOM_API_KEY;
  if (!tomtomKey || !tomtomKey.trim()) {
    console.error('ERROR: TOMTOM_API_KEY is not configured in server/.env');
    process.exit(1);
  }
  console.log('[OK] TOMTOM_API_KEY is present in server/.env (value securely masked)');

  // 2. Query TomTom Calculate Route API (v1)
  let tomtomResult = null;
  try {
    const tomtomUrl = `https://api.tomtom.com/routing/1/calculateRoute/${originLat},${originLon}:${destLat},${destLon}/json`;
    const response = await axios.get(tomtomUrl, {
      params: {
        key: tomtomKey.trim(),
        travelMode: 'car',
        routeType: 'fastest',
        traffic: 'true',
        departAt: 'now',
        computeTravelTimeFor: 'all'
      },
      timeout: 10000
    });

    const route = response.data?.routes?.[0];
    const summary = route?.summary;

    if (summary) {
      tomtomResult = {
        status: response.status,
        lengthInMeters: summary.lengthInMeters,
        distanceKm: (summary.lengthInMeters / 1000).toFixed(2),
        travelTimeInSeconds: summary.travelTimeInSeconds,
        travelTimeMin: (summary.travelTimeInSeconds / 60).toFixed(1),
        noTrafficTravelTimeInSeconds: summary.noTrafficTravelTimeInSeconds,
        noTrafficTravelTimeMin: summary.noTrafficTravelTimeInSeconds ? (summary.noTrafficTravelTimeInSeconds / 60).toFixed(1) : 'N/A',
        historicTrafficTravelTimeInSeconds: summary.historicTrafficTravelTimeInSeconds,
        historicTrafficTravelTimeMin: summary.historicTrafficTravelTimeInSeconds ? (summary.historicTrafficTravelTimeInSeconds / 60).toFixed(1) : 'N/A',
        liveTrafficIncidentsTravelTimeInSeconds: summary.liveTrafficIncidentsTravelTimeInSeconds,
        liveTrafficIncidentsTravelTimeMin: summary.liveTrafficIncidentsTravelTimeInSeconds ? (summary.liveTrafficIncidentsTravelTimeInSeconds / 60).toFixed(1) : 'N/A',
        trafficDelayInSeconds: summary.trafficDelayInSeconds ?? 0,
        departureTime: summary.departureTime,
        arrivalTime: summary.arrivalTime
      };
      console.log('[OK] TomTom Routing API v1 call successful (HTTP 200)');
    }
  } catch (err) {
    console.error('[FAIL] TomTom Routing API call failed:', err.response?.status, err.response?.data || err.message);
  }

  // 3. Query Geoapify Routing API (for simultaneous comparison on identical coordinates)
  let geoapifyResult = null;
  const geoapifyKey = process.env.GEOAPIFY_API_KEY;
  if (geoapifyKey) {
    try {
      const geoResponse = await axios.get('https://api.geoapify.com/v1/routing', {
        params: {
          waypoints: `${originLat},${originLon}|${destLat},${destLon}`,
          mode: 'drive',
          type: 'balanced',
          units: 'metric',
          apiKey: geoapifyKey.trim()
        },
        timeout: 10000
      });

      const prop = geoResponse.data?.features?.[0]?.properties;
      if (prop) {
        geoapifyResult = {
          status: geoResponse.status,
          distanceMeters: prop.distance,
          distanceKm: (prop.distance / 1000).toFixed(2),
          timeSeconds: prop.time,
          timeMin: (prop.time / 60).toFixed(1)
        };
        console.log('[OK] Geoapify Routing API call successful (HTTP 200)');
      }
    } catch (err) {
      console.error('[FAIL] Geoapify Routing API call failed:', err.response?.status, err.response?.data || err.message);
    }
  }

  // 4. Comparison Summary
  console.log('\n================================================================');
  console.log('SIDE-BY-SIDE ROUTING PROVIDER COMPARISON');
  console.log('================================================================');
  console.table([
    {
      Metric: 'Driving Distance',
      Geoapify: geoapifyResult ? `${geoapifyResult.distanceKm} km` : 'N/A',
      TomTom: tomtomResult ? `${tomtomResult.distanceKm} km` : 'N/A',
      'Google Maps (Historical)': '15.5 km'
    },
    {
      Metric: 'Estimated Travel Time',
      Geoapify: geoapifyResult ? `~${geoapifyResult.timeMin} min` : 'N/A',
      TomTom: tomtomResult ? `~${tomtomResult.travelTimeMin} min` : 'N/A',
      'Google Maps (Historical)': '35 min'
    },
    {
      Metric: 'Live / Dynamic Traffic Included',
      Geoapify: 'No (Free-flow speed limit model)',
      TomTom: 'Yes (Live incidents & historic traffic)',
      'Google Maps (Historical)': 'Yes (Real-time probe telemetry)'
    },
    {
      Metric: 'No-Traffic Baseline Duration',
      Geoapify: geoapifyResult ? `~${geoapifyResult.timeMin} min` : 'N/A',
      TomTom: tomtomResult ? `~${tomtomResult.noTrafficTravelTimeMin} min` : 'N/A',
      'Google Maps (Historical)': 'Not recorded'
    },
    {
      Metric: 'Traffic Delay Overhead',
      Geoapify: 'Not supported',
      TomTom: tomtomResult ? `${tomtomResult.trafficDelayInSeconds} s` : 'N/A',
      'Google Maps (Historical)': 'Integrated in ETA'
    }
  ]);

  if (tomtomResult) {
    console.log('Detailed TomTom Summary Metrics:');
    console.log(`- Departure Time                   : ${tomtomResult.departureTime}`);
    console.log(`- Arrival Time                     : ${tomtomResult.arrivalTime}`);
    console.log(`- Length in Meters                 : ${tomtomResult.lengthInMeters} m`);
    console.log(`- Total Travel Time                : ${tomtomResult.travelTimeInSeconds} s (${tomtomResult.travelTimeMin} min)`);
    console.log(`- No-Traffic Travel Time           : ${tomtomResult.noTrafficTravelTimeInSeconds} s (${tomtomResult.noTrafficTravelTimeMin} min)`);
    console.log(`- Historic Traffic Travel Time     : ${tomtomResult.historicTrafficTravelTimeInSeconds} s (${tomtomResult.historicTrafficTravelTimeMin} min)`);
    console.log(`- Live Incidents Travel Time       : ${tomtomResult.liveTrafficIncidentsTravelTimeInSeconds} s (${tomtomResult.liveTrafficIncidentsTravelTimeMin} min)`);
    console.log(`- Specific Traffic Delay           : ${tomtomResult.trafficDelayInSeconds} s`);
  }
}

runRoutingComparison();
