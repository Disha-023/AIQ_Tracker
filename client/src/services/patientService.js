/**
 * AIQ Tracker Patient Service Layer
 * Connects frontend client React state to backend /api/patients Express route
 */

const API_BASE_URL = 'http://localhost:5000/api/patients';

const mapPatient = (p) => {
  if (!p) return null;
  return {
    ...p,
    id: p.patient_id,
    patientId: p.patient_id,
    mobile: p.mobile,
    phone: p.mobile,
    lastVisit: p.last_visit ? new Date(p.last_visit).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A',
    upcomingAppointment: p.upcoming_appointment ? new Date(p.upcoming_appointment).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'None',
    bloodGroup: p.blood_group,
    emergencyContact: p.emergency_contact
  };
};

export const patientService = {
  /**
   * Fetch all registered patients
   */
  async getAll() {
    try {
      const res = await fetch(API_BASE_URL);
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || 'Failed to fetch patients directory.');
      }
      return json.data.map(mapPatient);
    } catch (err) {
      console.error('patientService.getAll error:', err);
      throw err;
    }
  },

  /**
   * Fetch details of a single patient
   */
  async getById(patientId) {
    try {
      const res = await fetch(`${API_BASE_URL}/${patientId}`);
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || `Failed to fetch patient record for ${patientId}.`);
      }
      return mapPatient(json.data);
    } catch (err) {
      console.error(`patientService.getById error for ${patientId}:`, err);
      throw err;
    }
  },

  /**
   * Register a new patient
   */
  async create(patientData) {
    try {
      const res = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData)
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || 'Failed to register patient record.');
      }
      return mapPatient(json.data);
    } catch (err) {
      console.error('patientService.create error:', err);
      throw err;
    }
  },

  /**
   * Update an existing patient details
   */
  async update(patientId, patientData) {
    try {
      const res = await fetch(`${API_BASE_URL}/${patientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData)
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || `Failed to update patient record for ${patientId}.`);
      }
      return mapPatient(json.data);
    } catch (err) {
      console.error(`patientService.update error for ${patientId}:`, err);
      throw err;
    }
  },

  /**
   * Delete a patient record
   */
  async delete(patientId) {
    try {
      const res = await fetch(`${API_BASE_URL}/${patientId}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || `Failed to delete patient record for ${patientId}.`);
      }
      return json;
    } catch (err) {
      console.error(`patientService.delete error for ${patientId}:`, err);
      throw err;
    }
  }
};

export default patientService;
