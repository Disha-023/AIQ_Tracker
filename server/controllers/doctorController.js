const { pool } = require('../config/db');
const { generateUniqueId } = require('../utils/idGenerator');

/**
 * GET /api/doctors
 */
async function getAllDoctors(req, res) {
  try {
    const queryText = `
      SELECT 
        d.doctor_id,
        d.name,
        d.specialization,
        d.department_id,
        dep.department_name,
        dep.description AS room,
        d.mobile,
        d.email,
        d.consultation_fee,
        d.average_consultation_time,
        d.available_from,
        d.available_to,
        d.status,
        d.created_at,
        COALESCE(
          (SELECT token_number FROM queue_entries WHERE doctor_id = d.doctor_id AND status = 'SERVING' AND queue_date = CURRENT_DATE LIMIT 1), 
          0
        ) AS current_token,
        COALESCE(
          (SELECT COUNT(*) FROM queue_entries WHERE doctor_id = d.doctor_id AND status = 'WAITING' AND queue_date = CURRENT_DATE), 
          0
        ) AS patients_waiting
      FROM doctors d
      LEFT JOIN departments dep ON d.department_id = dep.department_id
      ORDER BY d.name ASC;
    `;
    const result = await pool.query(queryText);
    return res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error('Error fetching doctors:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Internal server error fetching doctors.' }
    });
  }
}

/**
 * GET /api/doctors/:doctorId
 */
async function getDoctorById(req, res) {
  try {
    const { doctorId } = req.params;
    const queryText = `
      SELECT 
        d.doctor_id,
        d.name,
        d.specialization,
        d.department_id,
        dep.department_name,
        dep.description AS room,
        d.mobile,
        d.email,
        d.consultation_fee,
        d.average_consultation_time,
        d.available_from,
        d.available_to,
        d.status,
        d.created_at,
        COALESCE(
          (SELECT token_number FROM queue_entries WHERE doctor_id = d.doctor_id AND status = 'SERVING' AND queue_date = CURRENT_DATE LIMIT 1), 
          0
        ) AS current_token,
        COALESCE(
          (SELECT COUNT(*) FROM queue_entries WHERE doctor_id = d.doctor_id AND status = 'WAITING' AND queue_date = CURRENT_DATE), 
          0
        ) AS patients_waiting
      FROM doctors d
      LEFT JOIN departments dep ON d.department_id = dep.department_id
      WHERE d.doctor_id = $1;
    `;
    const result = await pool.query(queryText, [doctorId]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: `Doctor with ID ${doctorId} not found.` }
      });
    }
    return res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error fetching doctor:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Internal server error fetching doctor record.' }
    });
  }
}

/**
 * POST /api/doctors
 */
async function createDoctor(req, res) {
  try {
    const { 
      name, 
      specialization, 
      department_id, 
      mobile, 
      email, 
      consultation_fee, 
      average_consultation_time,
      available_from,
      available_to,
      status
    } = req.body;

    // Validation
    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Doctor name is required.' } });
    }
    if (!specialization || specialization.trim() === '') {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Doctor specialization is required.' } });
    }
    if (!department_id || department_id.trim() === '') {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Department reference is required.' } });
    }

    // Verify department exists
    const depCheck = await pool.query('SELECT 1 FROM departments WHERE department_id = $1', [department_id]);
    if (depCheck.rows.length === 0) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: `Department reference '${department_id}' does not exist.` } });
    }

    const doctorId = await generateUniqueId('DOC-', 'doctors', 'doctor_id');

    const queryText = `
      INSERT INTO doctors (
        doctor_id, name, specialization, department_id, mobile, email, 
        consultation_fee, average_consultation_time, available_from, available_to, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;
    `;
    const values = [
      doctorId,
      name.trim(),
      specialization.trim(),
      department_id,
      mobile || null,
      email || null,
      consultation_fee || null,
      average_consultation_time || 10,
      available_from || null,
      available_to || null,
      status || 'Active'
    ];

    const result = await pool.query(queryText, values);
    return res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error creating doctor:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Internal server error creating doctor record.' }
    });
  }
}

/**
 * PUT /api/doctors/:doctorId
 */
async function updateDoctor(req, res) {
  try {
    const { doctorId } = req.params;
    const { 
      name, 
      specialization, 
      department_id, 
      mobile, 
      email, 
      consultation_fee, 
      average_consultation_time,
      available_from,
      available_to,
      status
    } = req.body;

    // Check exists
    const checkRes = await pool.query('SELECT 1 FROM doctors WHERE doctor_id = $1', [doctorId]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: `Doctor with ID ${doctorId} not found.` }
      });
    }

    // Verify department if updating it
    if (department_id) {
      const depCheck = await pool.query('SELECT 1 FROM departments WHERE department_id = $1', [department_id]);
      if (depCheck.rows.length === 0) {
        return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: `Department reference '${department_id}' does not exist.` } });
      }
    }

    const queryText = `
      UPDATE doctors
      SET 
        name = COALESCE($1, name),
        specialization = COALESCE($2, specialization),
        department_id = COALESCE($3, department_id),
        mobile = COALESCE($4, mobile),
        email = COALESCE($5, email),
        consultation_fee = COALESCE($6, consultation_fee),
        average_consultation_time = COALESCE($7, average_consultation_time),
        available_from = COALESCE($8, available_from),
        available_to = COALESCE($9, available_to),
        status = COALESCE($10, status)
      WHERE doctor_id = $11
      RETURNING *;
    `;
    const values = [
      name ? name.trim() : null,
      specialization ? specialization.trim() : null,
      department_id || null,
      mobile || null,
      email || null,
      consultation_fee || null,
      average_consultation_time || null,
      available_from || null,
      available_to || null,
      status || null,
      doctorId
    ];

    const result = await pool.query(queryText, values);
    return res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error updating doctor:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Internal server error updating doctor record.' }
    });
  }
}

/**
 * DELETE /api/doctors/:doctorId
 */
async function deleteDoctor(req, res) {
  try {
    const { doctorId } = req.params;

    // Check exists
    const checkRes = await pool.query('SELECT 1 FROM doctors WHERE doctor_id = $1', [doctorId]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: `Doctor with ID ${doctorId} not found.` }
      });
    }

    // Manual foreign key checks
    const tablesToCheck = [
      { name: 'appointments', label: 'appointments' },
      { name: 'queue_entries', label: 'live queues' },
      { name: 'consultations', label: 'consultations' },
      { name: 'wait_time_predictions', label: 'predictions' }
    ];

    for (const table of tablesToCheck) {
      const q = `SELECT 1 FROM ${table.name} WHERE doctor_id = $1 LIMIT 1`;
      const refRes = await pool.query(q, [doctorId]);
      if (refRes.rows.length > 0) {
        return res.status(409).json({
          success: false,
          error: {
            code: 'FOREIGN_KEY_CONFLICT',
            message: `Cannot delete doctor because they are currently referenced by active ${table.label} records.`
          }
        });
      }
    }

    await pool.query('DELETE FROM doctors WHERE doctor_id = $1', [doctorId]);
    return res.json({
      success: true,
      message: 'Doctor deleted successfully.'
    });
  } catch (err) {
    console.error('Error deleting doctor:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Internal server error deleting doctor record.' }
    });
  }
}

module.exports = {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor
};
