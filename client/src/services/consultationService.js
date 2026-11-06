/**
 * AIQ Tracker Consultation Service Layer
 * Connects frontend clinical view states to backend /api/consultations route
 */

const API_BASE_URL = 'http://localhost:5000/api/consultations';

const mapConsultation = (c) => {
  if (!c) return null;
  return {
    ...c,
    id: c.consultation_id,
    patientId: c.patient_id,
    doctorId: c.doctor_id,
    doctor: c.doctor_name,
    specialization: c.specialization,
    notes: c.notes || 'General OPD consultation complete.',
    date: c.created_at ? new Date(c.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A',
    status: c.status
  };
};

export const consultationService = {
  /**
   * Get all past consultations (visits) with filters
   */
  async getAll(filters = {}) {
    try {
      const url = new URL(API_BASE_URL);
      if (filters.patientId) url.searchParams.append('patientId', filters.patientId);
      if (filters.doctorId) url.searchParams.append('doctorId', filters.doctorId);

      const res = await fetch(url.toString());
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || 'Failed to fetch consultations.');
      }
      return json.data.map(mapConsultation);
    } catch (err) {
      console.error('consultationService.getAll error:', err);
      throw err;
    }
  }
};

export default consultationService;
