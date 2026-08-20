/**
 * AIQ Tracker Doctor Service Layer
 * Connects frontend React state to backend /api/doctors route
 */

const API_BASE_URL = 'http://localhost:5000/api/doctors';

const mapDoctor = (d) => {
  if (!d) return null;
  return {
    ...d,
    id: d.doctor_id,
    doctorId: d.doctor_id,
    name: d.name,
    specialization: d.specialization,
    department: d.department_name,
    room: d.room || 'General OPD',
    availability: d.status === 'Active' ? 'Available' : 'Unavailable',
    isAvailableToday: d.status === 'Active',
    experience: '8+ Years', // Presentation-only
    rating: '4.8', // Presentation-only
    currentToken: d.current_token && d.current_token > 0 ? `#${d.current_token}` : '#0',
    patientsWaiting: parseInt(d.patients_waiting || 0, 10),
    estimatedWaitMinutes: parseInt(d.patients_waiting || 0, 10) * (d.average_consultation_time || 7)
  };
};

export const doctorService = {
  async getAll() {
    try {
      const res = await fetch(API_BASE_URL);
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || 'Failed to fetch doctors list.');
      }
      return json.data.map(mapDoctor);
    } catch (err) {
      console.error('doctorService.getAll error:', err);
      throw err;
    }
  },

  async getById(doctorId) {
    try {
      const res = await fetch(`${API_BASE_URL}/${doctorId}`);
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || `Failed to fetch doctor record for ${doctorId}.`);
      }
      return mapDoctor(json.data);
    } catch (err) {
      console.error(`doctorService.getById error for ${doctorId}:`, err);
      throw err;
    }
  },

  async create(doctorData) {
    try {
      const res = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doctorData)
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || 'Failed to create doctor record.');
      }
      return mapDoctor(json.data);
    } catch (err) {
      console.error('doctorService.create error:', err);
      throw err;
    }
  },

  async update(doctorId, doctorData) {
    try {
      const res = await fetch(`${API_BASE_URL}/${doctorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doctorData)
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || `Failed to update doctor record for ${doctorId}.`);
      }
      return mapDoctor(json.data);
    } catch (err) {
      console.error(`doctorService.update error for ${doctorId}:`, err);
      throw err;
    }
  },

  async delete(doctorId) {
    try {
      const res = await fetch(`${API_BASE_URL}/${doctorId}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || `Failed to delete doctor record for ${doctorId}.`);
      }
      return json;
    } catch (err) {
      console.error(`doctorService.delete error for ${doctorId}:`, err);
      throw err;
    }
  }
};

export default doctorService;
