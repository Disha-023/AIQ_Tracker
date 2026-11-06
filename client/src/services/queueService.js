/**
 * AIQ Tracker Queue Service Layer
 * Connects frontend React components to backend /api/queues REST API
 */

const API_BASE_URL = 'http://localhost:5000/api/queues';

const mapQueueEntry = (q) => {
  if (!q) return null;
  return {
    ...q,
    id: q.queue_id,
    queueId: q.queue_id,
    patientId: q.patient_id,
    patientName: q.patient_name,
    mobile: q.patient_mobile,
    doctorId: q.doctor_id,
    doctorName: q.doctor_name,
    department: q.department_name,
    token: q.token_number ? `#${q.token_number}` : '#0',
    position: q.queue_position,
    type: q.queue_type === 'Appointment' ? 'appointment' : 'walk-in',
    status: q.status,
    joinedAt: q.joined_at
  };
};

export const queueService = {
  /**
   * Fetch today's live queues
   */
  async getAll(filters = {}) {
    try {
      const url = new URL(API_BASE_URL);
      if (filters.doctorId) url.searchParams.append('doctorId', filters.doctorId);

      const res = await fetch(url.toString());
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || 'Failed to fetch active queue entries.');
      }
      return json.data.map(mapQueueEntry);
    } catch (err) {
      console.error('queueService.getAll error:', err);
      throw err;
    }
  },

  /**
   * Join the live queue (Walk-in or check-in an appointment)
   */
  async join(data) {
    try {
      const payload = {
        patient_id: data.patientId,
        doctor_id: data.doctorId,
        appointment_id: data.appointmentId || null,
        queue_type: data.type === 'appointment' ? 'Appointment' : 'Walk-in',
        priority: data.priority || 'NORMAL'
      };

      const res = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || 'Failed to join queue.');
      }
      return mapQueueEntry(json.data);
    } catch (err) {
      console.error('queueService.join error:', err);
      throw err;
    }
  },

  /**
   * Update queue entry status/priority
   */
  async update(queueId, data) {
    try {
      const res = await fetch(`${API_BASE_URL}/${queueId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || `Failed to update queue entry ${queueId}.`);
      }
      return mapQueueEntry(json.data);
    } catch (err) {
      console.error(`queueService.update error for ${queueId}:`, err);
      throw err;
    }
  },

  /**
   * Delete a queue entry
   */
  async delete(queueId) {
    try {
      const res = await fetch(`${API_BASE_URL}/${queueId}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || `Failed to delete queue entry ${queueId}.`);
      }
      return json;
    } catch (err) {
      console.error(`queueService.delete error for ${queueId}:`, err);
      throw err;
    }
  }
};

export default queueService;
