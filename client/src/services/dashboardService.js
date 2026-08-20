/**
 * AIQ Tracker Dashboard Service Layer
 * Connects frontend dashboard metrics to backend /api/dashboard REST API
 */

const API_BASE_URL = 'http://localhost:5000/api/dashboard';

export const dashboardService = {
  /**
   * Fetch aggregated statistics for Admin and Receptionist dashboards
   */
  async getStats() {
    try {
      const res = await fetch(`${API_BASE_URL}/stats`);
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || 'Failed to fetch dashboard metrics.');
      }
      return json.data;
    } catch (err) {
      console.error('dashboardService.getStats error:', err);
      throw err;
    }
  },

  /**
   * Fetch aggregate reports data for reports dashboards
   */
  async getReports() {
    try {
      const res = await fetch(`${API_BASE_URL}/reports`);
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || 'Failed to fetch reports metrics.');
      }
      return json.data;
    } catch (err) {
      console.error('dashboardService.getReports error:', err);
      throw err;
    }
  }
};

export default dashboardService;
