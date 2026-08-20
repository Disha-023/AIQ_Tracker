/**
 * AIQ Tracker Appointment Service Layer
 * Connects frontend React components to backend /api/appointments REST API
 */

const API_BASE_URL = 'http://localhost:5000/api/appointments';

function formatTime12h(timeStr) {
  if (!timeStr) return 'N/A';
  const parts = timeStr.split(':');
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  return `${hours}:${minutes} ${ampm}`;
}

const mapAppointment = (a) => {
  if (!a) return null;
  return {
    ...a,
    id: a.appointment_id,
    appointmentId: a.appointment_id,
    patientId: a.patient_id,
    patientName: a.patient_name,
    patient: a.patient_name,
    doctorId: a.doctor_id,
    doctorName: a.doctor_name,
    doctor: a.doctor_name,
    specialization: a.specialization,
    department: a.department,
    // Format YYYY-MM-DD -> DD Month YYYY
    date: a.appointment_date ? new Date(a.appointment_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A',
    // Format 16:00:00 -> 4:00 PM
    time: a.appointment_time ? formatTime12h(a.appointment_time) : 'N/A',
    token: a.token_number ? `#${a.token_number}` : '#0',
    type: a.booking_type === 'Walk-in' ? 'walk-in' : 'appointment',
    status: a.status,
    createdAt: a.booked_at
  };
};

export const appointmentService = {
  /**
   * Get all appointments (with optional filters: patientId, doctorId)
   */
  async getAll(filters = {}) {
    try {
      const url = new URL(API_BASE_URL);
      if (filters.patientId) url.searchParams.append('patientId', filters.patientId);
      if (filters.doctorId) url.searchParams.append('doctorId', filters.doctorId);

      const res = await fetch(url.toString());
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || 'Failed to fetch appointments list.');
      }
      return json.data.map(mapAppointment);
    } catch (err) {
      console.error('appointmentService.getAll error:', err);
      throw err;
    }
  },

  /**
   * Get appointment by ID
   */
  async getById(appointmentId) {
    try {
      const res = await fetch(`${API_BASE_URL}/${appointmentId}`);
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || `Failed to fetch appointment ${appointmentId}.`);
      }
      return mapAppointment(json.data);
    } catch (err) {
      console.error(`appointmentService.getById error for ${appointmentId}:`, err);
      throw err;
    }
  },

  /**
   * Create a scheduled appointment or walk-in booking
   */
  async create(data) {
    try {
      // Map frontend camelCase to backend snake_case
      const payload = {
        patient_id: data.patientId,
        doctor_id: data.doctorId || data.doctor?.id,
        appointment_date: data.date,
        appointment_time: data.time,
        booking_type: data.type === 'walk-in' ? 'Walk-in' : 'Online',
        reason: data.reason || 'Routine Checkup'
      };

      const res = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || 'Failed to create appointment.');
      }
      return mapAppointment(json.data);
    } catch (err) {
      console.error('appointmentService.create error:', err);
      throw err;
    }
  },

  /**
   * Update appointment details/status
   */
  async update(appointmentId, appointmentData) {
    try {
      const res = await fetch(`${API_BASE_URL}/${appointmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData)
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || `Failed to update appointment ${appointmentId}.`);
      }
      return mapAppointment(json.data);
    } catch (err) {
      console.error(`appointmentService.update error for ${appointmentId}:`, err);
      throw err;
    }
  },

  /**
   * Delete an appointment record
   */
  async delete(appointmentId) {
    try {
      const res = await fetch(`${API_BASE_URL}/${appointmentId}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || `Failed to delete appointment ${appointmentId}.`);
      }
      return json;
    } catch (err) {
      console.error(`appointmentService.delete error for ${appointmentId}:`, err);
      throw err;
    }
  },

  /**
   * Fetch the most recent active booking (Confirmed/Waiting) for a specific patient
   */
  async getActiveBooking(patientId) {
    if (!patientId) return null;
    try {
      const appointments = await this.getAll({ patientId });
      const active = appointments.find(a => a.status === 'Confirmed' || a.status === 'Waiting' || a.status === 'Checked-in');
      return active || null;
    } catch (err) {
      console.error(`appointmentService.getActiveBooking error for ${patientId}:`, err);
      return null;
    }
  }
};

export default appointmentService;
