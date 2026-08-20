const { pool } = require('../config/db');

/**
 * GET /api/consultations
 * Retrieve past consultation records (visits history)
 */
async function getAllConsultations(req, res) {
  try {
    const { patientId, doctorId } = req.query;
    let queryText = `
      SELECT 
        c.consultation_id,
        c.patient_id,
        c.doctor_id,
        d.name AS doctor_name,
        d.specialization,
        c.appointment_id,
        a.reason AS notes,
        c.queue_id,
        c.scheduled_start_time,
        c.actual_start_time,
        c.actual_end_time,
        c.consultation_duration,
        c.status,
        c.created_at
      FROM consultations c
      LEFT JOIN doctors d ON c.doctor_id = d.doctor_id
      LEFT JOIN appointments a ON c.appointment_id = a.appointment_id
    `;
    const values = [];

    const conditions = [];
    if (patientId) {
      conditions.push(`c.patient_id = $${conditions.length + 1}`);
      values.push(patientId);
    }
    if (doctorId) {
      conditions.push(`c.doctor_id = $${conditions.length + 1}`);
      values.push(doctorId);
    }

    if (conditions.length > 0) {
      queryText += ' WHERE ' + conditions.join(' AND ');
    }

    queryText += ' ORDER BY c.created_at DESC;';

    const result = await pool.query(queryText, values);
    return res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error('Error fetching consultations:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Internal server error fetching clinical history.' }
    });
  }
}

module.exports = {
  getAllConsultations
};
