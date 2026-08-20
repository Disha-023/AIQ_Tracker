/**
 * AIQ Tracker Department Service Layer
 * Connects React frontend components to backend /api/departments route
 */

const API_BASE_URL = 'http://localhost:5000/api/departments';

const mapDepartment = (d) => {
  if (!d) return null;
  const activeQueueCount = parseInt(d.active_queue_count || 0, 10);
  return {
    ...d,
    id: d.department_id,
    departmentId: d.department_id,
    name: d.department_name,
    room: d.description || 'OPD Room',
    assignedDoctors: parseInt(d.assigned_doctors || 0, 10),
    queueStatus: activeQueueCount > 5 ? 'High Volume' : 'Normal',
    status: 'Active'
  };
};

export const departmentService = {
  async getAll() {
    try {
      const res = await fetch(API_BASE_URL);
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || 'Failed to fetch departments list.');
      }
      return json.data.map(mapDepartment);
    } catch (err) {
      console.error('departmentService.getAll error:', err);
      throw err;
    }
  },

  async getById(departmentId) {
    try {
      const res = await fetch(`${API_BASE_URL}/${departmentId}`);
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || `Failed to fetch department record for ${departmentId}.`);
      }
      return mapDepartment(json.data);
    } catch (err) {
      console.error(`departmentService.getById error for ${departmentId}:`, err);
      throw err;
    }
  },

  async create(departmentData) {
    try {
      const res = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(departmentData)
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || 'Failed to create department.');
      }
      return mapDepartment(json.data);
    } catch (err) {
      console.error('departmentService.create error:', err);
      throw err;
    }
  },

  async update(departmentId, departmentData) {
    try {
      const res = await fetch(`${API_BASE_URL}/${departmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(departmentData)
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || `Failed to update department record for ${departmentId}.`);
      }
      return mapDepartment(json.data);
    } catch (err) {
      console.error(`departmentService.update error for ${departmentId}:`, err);
      throw err;
    }
  },

  async delete(departmentId) {
    try {
      const res = await fetch(`${API_BASE_URL}/${departmentId}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || `Failed to delete department record for ${departmentId}.`);
      }
      return json;
    } catch (err) {
      console.error(`departmentService.delete error for ${departmentId}:`, err);
      throw err;
    }
  }
};

export default departmentService;
