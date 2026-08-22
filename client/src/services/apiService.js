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
   * OpenRouteService GPS Driving Directions
   * Calls Express GET /api/directions?startLon=...&startLat=...&endLon=...&endLat=...
   */
  async getDirections(startLon, startLat, endLon, endLat) {
    try {
      const url = `${API_BASE_URL}/directions?startLon=${startLon}&startLat=${startLat}&endLon=${endLon}&endLat=${endLat}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to fetch directions from server' };
      }
      return { success: true, data };
    } catch (err) {
      return { success: false, error: 'Unable to connect to directions server' };
    }
  }
};


export default apiService;
