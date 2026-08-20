const { pool } = require('../config/db');
const { generateUniqueId } = require('../utils/idGenerator');

/**
 * Parses date string (e.g., '13 August 2026' or '2026-08-13') into YYYY-MM-DD
 */
function parseDate(dateStr) {
  if (!dateStr) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  
  const parsed = Date.parse(dateStr);
  if (!isNaN(parsed)) {
    const d = new Date(parsed);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  return dateStr;
}

/**
 * Parses time string (e.g., '04:00 PM' or '16:00') into 24-hour HH:MM:SS
 */
function parseTime(timeStr) {
  if (!timeStr) return null;
  // If already in 24-hour format
  if (/^\d{2}:\d{2}(:\d{2})?$/.test(timeStr)) {
    return timeStr.length === 5 ? `${timeStr}:00` : timeStr;
  }
  
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match) {
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const ampm = match[3].toUpperCase();
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    return `${String(hours).padStart(2, '0')}:${minutes}:00`;
  }
  return timeStr;
}

/**
 * GET /api/appointments
 */
async function getAllAppointments(req, res) {
  try {
    const { patientId, doctorId } = req.query;
    let queryText = `
      SELECT 
        a.appointment_id,
        a.patient_id,
        p.name AS patient_name,
        p.mobile AS patient_mobile,
        a.doctor_id,
        d.name AS doctor_name,
        d.specialization,
        dep.department_name AS department,
        a.appointment_date,
        a.appointment_time,
        a.booking_type,
        a.visit_type,
        a.reason,
        a.token_number,
        a.status,
        a.payment_status,
        a.consultation_fee,
        a.booked_at,
        a.checked_in_at
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.patient_id
      LEFT JOIN doctors d ON a.doctor_id = d.doctor_id
      LEFT JOIN departments dep ON d.department_id = dep.department_id
    `;

    const conditions = [];
    const values = [];
    
    if (patientId) {
      conditions.push(`a.patient_id = $${conditions.length + 1}`);
      values.push(patientId);
    }
    if (doctorId) {
      conditions.push(`a.doctor_id = $${conditions.length + 1}`);
      values.push(doctorId);
    }

    if (conditions.length > 0) {
      queryText += ' WHERE ' + conditions.join(' AND ');
    }
    
    queryText += ' ORDER BY a.appointment_date DESC, a.appointment_time DESC;';

    const result = await pool.query(queryText, values);
    return res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error('Error fetching appointments:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Internal server error fetching appointments.' }
    });
  }
}

/**
 * GET /api/appointments/:appointmentId
 */
async function getAppointmentById(req, res) {
  try {
    const { appointmentId } = req.params;
    const queryText = `
      SELECT 
        a.appointment_id,
        a.patient_id,
        p.name AS patient_name,
        p.mobile AS patient_mobile,
        a.doctor_id,
        d.name AS doctor_name,
        d.specialization,
        dep.department_name AS department,
        a.appointment_date,
        a.appointment_time,
        a.booking_type,
        a.visit_type,
        a.reason,
        a.token_number,
        a.status,
        a.payment_status,
        a.consultation_fee,
        a.booked_at,
        a.checked_in_at
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.patient_id
      LEFT JOIN doctors d ON a.doctor_id = d.doctor_id
      LEFT JOIN departments dep ON d.department_id = dep.department_id
      WHERE a.appointment_id = $1;
    `;
    const result = await pool.query(queryText, [appointmentId]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: `Appointment with ID ${appointmentId} not found.` }
      });
    }
    return res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error fetching appointment:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Internal server error fetching appointment record.' }
    });
  }
}

/**
 * POST /api/appointments
 */
async function createAppointment(req, res) {
  const client = await pool.connect();
  try {
    const { 
      patient_id, 
      doctor_id, 
      appointment_date, 
      appointment_time, 
      booking_type, 
      visit_type,
      reason 
    } = req.body;

    // Validation
    if (!patient_id || !doctor_id || !appointment_date || !appointment_time) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Patient reference, Doctor reference, appointment date and time are required.' }
      });
    }

    const cleanDate = parseDate(appointment_date);
    const cleanTime = parseTime(appointment_time);

    // Verify patient and doctor exist
    const pCheck = await client.query('SELECT 1 FROM patients WHERE patient_id = $1', [patient_id]);
    if (pCheck.rows.length === 0) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: `Patient '${patient_id}' does not exist.` } });
    }

    const dCheck = await client.query('SELECT consultation_fee FROM doctors WHERE doctor_id = $1', [doctor_id]);
    if (dCheck.rows.length === 0) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: `Doctor '${doctor_id}' does not exist.` } });
    }

    const consultationFee = dCheck.rows[0].consultation_fee || 0;

    await client.query('BEGIN');

    // Calculate token number for the day
    const tokenRes = await client.query(
      'SELECT COALESCE(MAX(token_number), 0) + 1 AS next_token FROM appointments WHERE doctor_id = $1 AND appointment_date = $2',
      [doctor_id, cleanDate]
    );
    const nextToken = tokenRes.rows[0].next_token;

    const appointmentId = await generateUniqueId('APT-', 'appointments', 'appointment_id');

    const queryText = `
      INSERT INTO appointments (
        appointment_id, patient_id, doctor_id, appointment_date, appointment_time, 
        booking_type, visit_type, reason, token_number, status, payment_status, consultation_fee
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *;
    `;
    
    const values = [
      appointmentId,
      patient_id,
      doctor_id,
      cleanDate,
      cleanTime,
      booking_type || 'Online',
      visit_type || 'Consultation',
      reason || null,
      nextToken,
      'Confirmed',
      'Pending',
      consultationFee
    ];

    const result = await client.query(queryText, values);
    
    await client.query('COMMIT');

    return res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating appointment:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Internal server error creating appointment.' }
    });
  } finally {
    client.release();
  }
}

/**
 * PUT /api/appointments/:appointmentId
 */
async function updateAppointment(req, res) {
  try {
    const { appointmentId } = req.params;
    const { 
      appointment_date, 
      appointment_time, 
      status, 
      payment_status, 
      reason,
      checked_in_at
    } = req.body;

    const checkRes = await pool.query('SELECT 1 FROM appointments WHERE appointment_id = $1', [appointmentId]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: `Appointment with ID ${appointmentId} not found.` }
      });
    }

    const cleanDate = appointment_date ? parseDate(appointment_date) : null;
    const cleanTime = appointment_time ? parseTime(appointment_time) : null;

    const queryText = `
      UPDATE appointments
      SET 
        appointment_date = COALESCE($1, appointment_date),
        appointment_time = COALESCE($2, appointment_time),
        status = COALESCE($3, status),
        payment_status = COALESCE($4, payment_status),
        reason = COALESCE($5, reason),
        checked_in_at = COALESCE($6, checked_in_at)
      WHERE appointment_id = $7
      RETURNING *;
    `;
    const values = [
      cleanDate,
      cleanTime,
      status || null,
      payment_status || null,
      reason || null,
      checked_in_at || null,
      appointmentId
    ];

    const result = await pool.query(queryText, values);
    return res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error updating appointment:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Internal server error updating appointment.' }
    });
  }
}

/**
 * DELETE /api/appointments/:appointmentId
 */
async function deleteAppointment(req, res) {
  try {
    const { appointmentId } = req.params;

    const checkRes = await pool.query('SELECT 1 FROM appointments WHERE appointment_id = $1', [appointmentId]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: `Appointment with ID ${appointmentId} not found.` }
      });
    }

    // Manual foreign key check
    const tablesToCheck = [
      { name: 'queue_entries', label: 'live queues' },
      { name: 'consultations', label: 'consultations' },
      { name: 'notifications', label: 'notifications' }
    ];

    for (const table of tablesToCheck) {
      const q = `SELECT 1 FROM ${table.name} WHERE appointment_id = $1 LIMIT 1`;
      const refRes = await pool.query(q, [appointmentId]);
      if (refRes.rows.length > 0) {
        return res.status(409).json({
          success: false,
          error: {
            code: 'FOREIGN_KEY_CONFLICT',
            message: `Cannot delete appointment because it is referenced in active ${table.label} records.`
          }
        });
      }
    }

    await pool.query('DELETE FROM appointments WHERE appointment_id = $1', [appointmentId]);
    return res.json({
      success: true,
      message: 'Appointment deleted successfully.'
    });
  } catch (err) {
    console.error('Error deleting appointment:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Internal server error deleting appointment.' }
    });
  }
}

module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment
};
