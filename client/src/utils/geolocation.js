/**
 * Geolocation Utility Module - AIQ Tracker (Phase 1 & Phase 2 GPS)
 *
 * Provides fixed hospital destination coordinates, Haversine fallback distance,
 * and browser Geolocation API handling with robust error messages.
 */

// ============================================================================
// FIXED DESTINATION CONFIGURATION - KOLE HOSPITAL, SANGLI
// Verified from Google Maps: https://maps.app.goo.gl/SzyM3DKHEgMnMWzr8?g_st=aw
// Address: Arwade Park, Abhay Nagar, Sangli, Maharashtra 416416, India
// ============================================================================
export const DESTINATION = {
  name: "Kole Hospital",
  address: "Arwade Park, Abhay Nagar, Sangli, Maharashtra 416416, India",
  googleMapsUrl: "https://maps.app.goo.gl/SzyM3DKHEgMnMWzr8?g_st=aw",
  latitude: 16.8542,   // Verified Google Maps Latitude for Kole Hospital, Sangli
  longitude: 74.6029   // Verified Google Maps Longitude for Kole Hospital, Sangli
};

export const KOLE_HOSPITAL_LOCATION = DESTINATION;

/**
 * Calculates the geographical distance between two points on Earth using the Haversine formula.
 *
 * @param {number} lat1 - Latitude of Point 1
 * @param {number} lon1 - Longitude of Point 1
 * @param {number} lat2 - Latitude of Point 2
 * @param {number} lon2 - Longitude of Point 2
 * @returns {number} Distance in kilometers (rounded to 1 decimal place)
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  if (
    lat1 === undefined || lat1 === null ||
    lon1 === undefined || lon1 === null ||
    lat2 === undefined || lat2 === null ||
    lon2 === undefined || lon2 === null
  ) {
    return 0;
  }

  const EARTH_RADIUS_KM = 6371;

  const toRadians = (degrees) => (degrees * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const radLat1 = toRadians(lat1);
  const radLat2 = toRadians(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(radLat1) * Math.cos(radLat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = EARTH_RADIUS_KM * c;
  return Math.round(distance * 10) / 10;
}

/**
 * Requests the patient's current position using browser Geolocation API.
 *
 * @param {Object} [options] - Geolocation API configuration options
 * @returns {Promise<{latitude: number, longitude: number, accuracy: number}>}
 */
export function getPatientLocation(options = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }) {
  return new Promise((resolve, reject) => {
    if (!navigator || !navigator.geolocation) {
      reject({
        code: 'UNSUPPORTED',
        message: 'Geolocation is not supported by your current browser.'
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        let userMessage = 'An unexpected error occurred while retrieving your location.';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            userMessage = 'Location permission was denied. Please allow location access in your browser settings to calculate directions.';
            break;
          case error.POSITION_UNAVAILABLE:
            userMessage = 'Location information is currently unavailable. Please check your device GPS signal or connection.';
            break;
          case error.TIMEOUT:
            userMessage = 'Location request timed out. Please try again.';
            break;
          default:
            userMessage = error.message || userMessage;
            break;
        }

        reject({
          code: error.code || 'UNKNOWN',
          message: userMessage
        });
      },
      options
    );
  });
}
