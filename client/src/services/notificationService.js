/**
 * AIQ Tracker Notification Service Layer
 * Connects frontend view states to backend /api/notifications route
 */

const API_BASE_URL = 'http://localhost:5000/api/notifications';

const mapNotification = (n) => {
  if (!n) return null;
  const isWarning = n.notification_type?.toLowerCase().includes('warning') || n.notification_type?.toLowerCase().includes('threshold');
  const isSecurity = n.notification_type?.toLowerCase().includes('security') || n.notification_type?.toLowerCase().includes('audit');
  
  return {
    ...n,
    id: n.notification_id,
    patientId: n.patient_id,
    patientName: n.patient_name,
    appointmentId: n.appointment_id,
    type: isWarning ? 'warning' : isSecurity ? 'security' : 'info',
    title: n.notification_type || 'OPD Dispatch Alert',
    message: n.message || 'OPD token check-in notification sent.',
    time: n.sent_at ? new Date(n.sent_at).toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }) : 'Pending'
  };
};

export const notificationService = {
  /**
   * Fetch all notifications with filters (e.g. patientId)
   */
  async getAll(filters = {}) {
    try {
      const url = new URL(API_BASE_URL);
      if (filters.patientId) url.searchParams.append('patientId', filters.patientId);

      const res = await fetch(url.toString());
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || 'Failed to fetch notifications.');
      }
      return json.data.map(mapNotification);
    } catch (err) {
      console.error('notificationService.getAll error:', err);
      throw err;
    }
  }
};

export default notificationService;
