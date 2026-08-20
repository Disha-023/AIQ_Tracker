const { pool } = require('../config/db');
const { generateUniqueId } = require('../utils/idGenerator');

/**
 * Helper to compute age from Date of Birth string
 */
function calculateAge(dobString) {
  if (!dobString) return null;
  const birthDate = new Date(dobString);
  if (isNaN(birthDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

/**
 * GET /api/patients
 * Retrieve all registered patient records with derived columns:
 * - last_visit: Derived from maximum completed appointment date
 * - upcoming_appointment: Derived from next scheduled appointment
 * - status: 'In OPD Queue' / 'Confirmed' / 'Active'
 */
async function getAllPatients(req, res) {
  try {
    const queryText = `
      SELECT 
        p.patient_id,
        p.name,
        p.age,
        p.gender,
        p.mobile,
        p.address,
        p.blood_group,
        p.aadhaar_last4,
        p.created_at,
        p.pincode,
        p.email,
        p.emergency_contact,
        (SELECT MAX(appointment_date) FROM appointments WHERE patient_id = p.patient_id AND status = 'Completed') AS last_visit,
        (SELECT MIN(CONCAT(appointment_date, ' ', appointment_time)) FROM appointments WHERE patient_id = p.patient_id AND appointment_date >= CURRENT_DATE AND status = 'Confirmed') AS upcoming_appointment,
        (CASE 
          WHEN EXISTS (SELECT 1 FROM queue_entries WHERE patient_id = p.patient_id AND status IN ('WAITING', 'SERVING')) THEN 'In OPD Queue'
          WHEN EXISTS (SELECT 1 FROM appointments WHERE patient_id = p.patient_id AND appointment_date >= CURRENT_DATE AND status = 'Confirmed') THEN 'Confirmed'
          ELSE 'Active'
        END) AS status
      FROM patients p
      ORDER BY p.created_at DESC;
    `;
    const result = await pool.query(queryText);
    return res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error('Error fetching patients:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Internal server error fetching patient records.' }
    });
  }
}

/**
 * GET /api/patients/:patientId
 * Retrieve a single patient by ID
 */
async function getPatientById(req, res) {
  try {
    const { patientId } = req.params;
    const queryText = `
      SELECT 
        p.patient_id,
        p.name,
        p.age,
        p.gender,
        p.mobile,
        p.address,
        p.blood_group,
        p.aadhaar_last4,
        p.created_at,
        p.pincode,
        p.email,
        p.emergency_contact,
        (SELECT MAX(appointment_date) FROM appointments WHERE patient_id = p.patient_id AND status = 'Completed') AS last_visit,
        (SELECT MIN(CONCAT(appointment_date, ' ', appointment_time)) FROM appointments WHERE patient_id = p.patient_id AND appointment_date >= CURRENT_DATE AND status = 'Confirmed') AS upcoming_appointment,
        (CASE 
          WHEN EXISTS (SELECT 1 FROM queue_entries WHERE patient_id = p.patient_id AND status IN ('WAITING', 'SERVING')) THEN 'In OPD Queue'
          WHEN EXISTS (SELECT 1 FROM appointments WHERE patient_id = p.patient_id AND appointment_date >= CURRENT_DATE AND status = 'Confirmed') THEN 'Confirmed'
          ELSE 'Active'
        END) AS status
      FROM patients p
      WHERE p.patient_id = $1;
    `;
    const result = await pool.query(queryText, [patientId]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: `Patient with ID ${patientId} not found.` }
      });
    }
    return res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error fetching patient:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Internal server error fetching patient record.' }
    });
  }
}

/**
 * POST /api/patients
 * Create a new Patient record
 */
async function createPatient(req, res) {
  try {
    const { 
      name, 
      dob, 
      age, 
      gender, 
      mobile, 
      address, 
      blood_group, 
      aadhaar_last4, 
      pincode, 
      email, 
      emergency_contact 
    } = req.body;

    // Backend Validation
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Name is a required field.' }
      });
    }

    if (!mobile || mobile.trim() === '') {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Mobile number is a required field.' }
      });
    }

    // Determine age
    let finalAge = age;
    if (dob) {
      finalAge = calculateAge(dob);
    }

    // Generate unique patient_id
    const patientId = await generateUniqueId('PAT-', 'patients', 'patient_id');

    const queryText = `
      INSERT INTO patients (
        patient_id, name, age, gender, mobile, address, blood_group, aadhaar_last4, pincode, email, emergency_contact
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;
    `;
    const values = [
      patientId,
      name.trim(),
      finalAge || null,
      gender || null,
      mobile.trim(),
      address || null,
      blood_group || null,
      aadhaar_last4 || null,
      pincode || null,
      email || null,
      emergency_contact || null
    ];

    const result = await pool.query(queryText, values);
    return res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error creating patient:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Internal server error registering new patient.' }
    });
  }
}

/**
 * PUT /api/patients/:patientId
 * Update an existing Patient record
 */
async function updatePatient(req, res) {
  try {
    const { patientId } = req.params;
    const { 
      name, 
      dob, 
      age, 
      gender, 
      mobile, 
      address, 
      blood_group, 
      aadhaar_last4, 
      pincode, 
      email, 
      emergency_contact 
    } = req.body;

    // Check if patient exists
    const checkRes = await pool.query('SELECT 1 FROM patients WHERE patient_id = $1', [patientId]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: `Patient with ID ${patientId} not found.` }
      });
    }

    // Determine age
    let finalAge = age;
    if (dob) {
      finalAge = calculateAge(dob);
    }

    const queryText = `
      UPDATE patients
      SET 
        name = COALESCE($1, name),
        age = COALESCE($2, age),
        gender = COALESCE($3, gender),
        mobile = COALESCE($4, mobile),
        address = COALESCE($5, address),
        blood_group = COALESCE($6, blood_group),
        aadhaar_last4 = COALESCE($7, aadhaar_last4),
        pincode = COALESCE($8, pincode),
        email = COALESCE($9, email),
        emergency_contact = COALESCE($10, emergency_contact)
      WHERE patient_id = $11
      RETURNING *;
    `;
    const values = [
      name ? name.trim() : null,
      finalAge || null,
      gender || null,
      mobile ? mobile.trim() : null,
      address || null,
      blood_group || null,
      aadhaar_last4 || null,
      pincode || null,
      email || null,
      emergency_contact || null,
      patientId
    ];

    const result = await pool.query(queryText, values);
    return res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error updating patient:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Internal server error updating patient record.' }
    });
  }
}

/**
 * DELETE /api/patients/:patientId
 * Remove a patient record (Blocked if referenced by dependent records)
 */
async function deletePatient(req, res) {
  try {
    const { patientId } = req.params;

    // Check if patient exists
    const checkRes = await pool.query('SELECT 1 FROM patients WHERE patient_id = $1', [patientId]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: `Patient with ID ${patientId} not found.` }
      });
    }

    // Enforce foreign key checks manually before deletion to return explicit 409 responses
    const tablesToCheck = [
      { name: 'appointments', label: 'appointments' },
      { name: 'queue_entries', label: 'live queues' },
      { name: 'consultations', label: 'consultation logs' },
      { name: 'notifications', label: 'notifications' },
      { name: 'wait_time_predictions', label: 'predictions' }
    ];

    for (const table of tablesToCheck) {
      const q = `SELECT 1 FROM ${table.name} WHERE patient_id = $1 LIMIT 1`;
      const refRes = await pool.query(q, [patientId]);
      if (refRes.rows.length > 0) {
        return res.status(409).json({
          success: false,
          error: {
            code: 'FOREIGN_KEY_CONFLICT',
            message: `Cannot delete patient because they are currently referenced by active ${table.label} records.`
          }
        });
      }
    }

    // If safe, delete patient record
    await pool.query('DELETE FROM patients WHERE patient_id = $1', [patientId]);
    return res.json({
      success: true,
      message: 'Patient record deleted successfully.'
    });
  } catch (err) {
    console.error('Error deleting patient:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Internal server error deleting patient record.' }
    });
  }
}

module.exports = {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient
};
