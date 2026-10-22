/**
 * AIQ Tracker REST API Client Service
 * Connects React frontend to Node/Express backend at http://localhost:5000/api
 */

const API_BASE_URL = 'http://localhost:5000/api';

export const apiService = {
  /**
   * Health Check
   */
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return await res.json();
    } catch (err) {
      return { status: 'offline', message: 'Backend server unavailable' };
    }
  },

  /**
   * General Login
   */
  async login(identifier, password) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: 'Unable to connect to backend server' };
    }
  },

  /**
   * Staff MFA Initiate
   */
  async initiateStaffLogin(identifier, password) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/initiate-staff-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: 'Unable to connect to backend server' };
    }
  },

  /**
   * Staff OTP Verification
   */
  async verifyStaffOtp(sessionId, otpCode) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify-staff-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, otpCode })
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: 'Unable to connect to backend server' };
    }
  },

  /**
   * Patient Self-Registration
   */
  async registerPatient(patientData) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register-patient`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData)
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: 'Unable to connect to backend server' };
    }
  },

  /**
   * GPS Driving Directions (TomTom Primary with Geoapify Fallback)
   * Calls Express GET /api/directions?startLon=...&startLat=...&endLon=...&endLat=...
   */
  async getDirections(startLon, startLat, endLon, endLat) {
    try {
      const sLon = Number(startLon);
      const sLat = Number(startLat);
      const eLon = Number(endLon);
      const eLat = Number(endLat);

      if (
        !Number.isFinite(sLon) || !Number.isFinite(sLat) ||
        !Number.isFinite(eLon) || !Number.isFinite(eLat)
      ) {
        return { success: false, error: 'Invalid coordinates provided for route calculation.' };
      }

      const url = `${API_BASE_URL}/directions?startLon=${encodeURIComponent(sLon)}&startLat=${encodeURIComponent(sLat)}&endLon=${encodeURIComponent(eLon)}&endLat=${encodeURIComponent(eLat)}`;
      const res = await fetch(url);

      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        return { success: false, error: `Directions server returned invalid response format (HTTP ${res.status}).` };
      }

      if (!res.ok) {
        return { success: false, error: data?.error || `Failed to fetch directions from server (HTTP ${res.status}).` };
      }

      return { success: true, data };
    } catch (err) {
      return { success: false, error: 'Unable to connect to directions server. Please check your network connection.' };
    }
  }
};


export default apiService;
