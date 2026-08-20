const { pool } = require('../config/db');
const { generateUniqueId } = require('../utils/idGenerator');

/**
 * GET /api/queues
 * Fetch active queue entries for today
 */
async function getAllQueues(req, res) {
  try {
    const { doctorId } = req.query;
    let queryText = `
      SELECT 
        q.queue_id,
        q.patient_id,
        p.name AS patient_name,
        p.mobile AS patient_mobile,
        q.doctor_id,
        d.name AS doctor_name,
        dep.department_name AS department_name,
        q.appointment_id,
        q.queue_date,
        q.token_number,
        q.queue_position,
        q.queue_type,
        q.priority,
        q.status,
        q.joined_at,
        q.check_in_time,
        q.completed_at
      FROM queue_entries q
      LEFT JOIN patients p ON q.patient_id = p.patient_id
      LEFT JOIN doctors d ON q.doctor_id = d.doctor_id
      LEFT JOIN departments dep ON d.department_id = dep.department_id
      WHERE q.queue_date = CURRENT_DATE
    `;
    const values = [];

    if (doctorId) {
      queryText += ` AND q.doctor_id = $1`;
      values.push(doctorId);
    }

    queryText += ` ORDER BY q.queue_position ASC, q.token_number ASC;`;

    const result = await pool.query(queryText, values);
    return res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error('Error fetching queues:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Internal server error fetching live queues.' }
    });
  }
}

/**
 * POST /api/queues
 * Join the live OPD queue (Walk-in or check-in an appointment)
 */
async function createQueueEntry(req, res) {
  const client = await pool.connect();
  try {
    const { patient_id, doctor_id, appointment_id, queue_type, priority } = req.body;

    if (!patient_id || !doctor_id) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Patient and Doctor references are required.' }
      });
    }

    await client.query('BEGIN');

    // Check if patient is already in queue today with status 'WAITING' or 'SERVING'
    const activeQ = await client.query(
      `SELECT 1 FROM queue_entries WHERE patient_id = $1 AND queue_date = CURRENT_DATE AND status IN ('WAITING', 'SERVING')`,
      [patient_id]
    );
    if (activeQ.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        success: false,
        error: { code: 'ALREADY_IN_QUEUE', message: 'Patient is already waiting in an active queue today.' }
      });
    }

    // Determine token number
    const tokenRes = await client.query(
      `SELECT COALESCE(MAX(token_number), 0) + 1 AS next_token FROM queue_entries WHERE doctor_id = $1 AND queue_date = CURRENT_DATE`,
      [doctor_id]
    );
    const tokenNumber = tokenRes.rows[0].next_token;

    // Determine queue position
    const posRes = await client.query(
      `SELECT COALESCE(MAX(queue_position), 0) + 1 AS next_pos FROM queue_entries WHERE doctor_id = $1 AND queue_date = CURRENT_DATE AND status = 'WAITING'`,
      [doctor_id]
    );
    const queuePosition = posRes.rows[0].next_pos;

    const queueId = await generateUniqueId('QUE-', 'queue_entries', 'queue_id');

    const insertText = `
      INSERT INTO queue_entries (
        queue_id, patient_id, appointment_id, doctor_id, queue_date, token_number, 
        queue_position, queue_type, priority, status, joined_at
      ) VALUES ($1, $2, $3, $4, CURRENT_DATE, $5, $6, $7, $8, 'WAITING', CURRENT_TIMESTAMP)
      RETURNING *;
    `;
    const insertValues = [
      queueId,
      patient_id,
      appointment_id || null,
      doctor_id,
      tokenNumber,
      queuePosition,
      queue_type || 'Walk-in',
      priority || 'NORMAL'
    ];

    const result = await client.query(insertText, insertValues);

    // If linked to an appointment, change appointment status to 'Checked-in'
    if (appointment_id) {
      await client.query(
        `UPDATE appointments SET status = 'Checked-in', checked_in_at = CURRENT_TIMESTAMP WHERE appointment_id = $1`,
        [appointment_id]
      );
    }

    await client.query('COMMIT');
    return res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating queue entry:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Internal server error joining queue.' }
    });
  } finally {
    client.release();
  }
}

/**
 * PUT /api/queues/:queueId
 * Update queue status (WAITING, SERVING, COMPLETED, CANCELLED)
 */
async function updateQueueEntry(req, res) {
  const client = await pool.connect();
  try {
    const { queueId } = req.params;
    const { status, priority } = req.body;

    const checkRes = await client.query('SELECT * FROM queue_entries WHERE queue_id = $1', [queueId]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: `Queue entry with ID ${queueId} not found.` }
      });
    }

    const currentEntry = checkRes.rows[0];

    await client.query('BEGIN');

    let updateText = `UPDATE queue_entries SET priority = COALESCE($1, priority)`;
    const values = [priority || null];

    if (status) {
      updateText += `, status = $2`;
      values.push(status);

      if (status === 'SERVING') {
        updateText += `, check_in_time = COALESCE(check_in_time, CURRENT_TIMESTAMP), queue_position = 0`;
        
        // Re-order remaining waiting patients' positions
        await client.query(
          `UPDATE queue_entries 
           SET queue_position = queue_position - 1 
           WHERE doctor_id = $1 AND queue_date = CURRENT_DATE AND status = 'WAITING' AND queue_position > $2`,
          [currentEntry.doctor_id, currentEntry.queue_position]
        );
      } else if (status === 'COMPLETED' || status === 'CANCELLED') {
        updateText += `, completed_at = CURRENT_TIMESTAMP, queue_position = 0`;

        if (currentEntry.status === 'WAITING') {
          // Re-order remaining waiting patients' positions
          await client.query(
            `UPDATE queue_entries 
             SET queue_position = queue_position - 1 
             WHERE doctor_id = $1 AND queue_date = CURRENT_DATE AND status = 'WAITING' AND queue_position > $2`,
            [currentEntry.doctor_id, currentEntry.queue_position]
          );
        }

        // If completed, create consultation log record automatically
        if (status === 'COMPLETED') {
          const consultationId = await generateUniqueId('CON-', 'consultations', 'consultation_id');
          const duration = 10; // Default consultation length estimate in minutes

          await client.query(
            `INSERT INTO consultations (
              consultation_id, patient_id, doctor_id, appointment_id, queue_id, 
              scheduled_start_time, actual_start_time, actual_end_time, consultation_duration, status
            ) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP - INTERVAL '10 minutes', CURRENT_TIMESTAMP - INTERVAL '10 minutes', CURRENT_TIMESTAMP, $6, 'Completed')`,
            [consultationId, currentEntry.patient_id, currentEntry.doctor_id, currentEntry.appointment_id || null, queueId, duration]
          );

          // Update appointment status to Completed if linked
          if (currentEntry.appointment_id) {
            await client.query(
              `UPDATE appointments SET status = 'Completed' WHERE appointment_id = $1`,
              [currentEntry.appointment_id]
            );
          }
        }
      }
    }

    updateText += ` WHERE queue_id = $${values.length + 1} RETURNING *;`;
    values.push(queueId);

    const result = await client.query(updateText, values);

    await client.query('COMMIT');
    return res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error updating queue:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Internal server error updating live queue.' }
    });
  } finally {
    client.release();
  }
}

/**
 * DELETE /api/queues/:queueId
 */
async function deleteQueueEntry(req, res) {
  try {
    const { queueId } = req.params;
    const checkRes = await pool.query('SELECT 1 FROM queue_entries WHERE queue_id = $1', [queueId]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: `Queue entry with ID ${queueId} not found.` }
      });
    }

    // Check if referenced in consultations or predictions
    const refRes = await pool.query('SELECT 1 FROM consultations WHERE queue_id = $1 LIMIT 1', [queueId]);
    if (refRes.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: { code: 'FOREIGN_KEY_CONFLICT', message: 'Cannot delete queue entry because it is referenced in consultation records.' }
      });
    }

    await pool.query('DELETE FROM queue_entries WHERE queue_id = $1', [queueId]);
    return res.json({
      success: true,
      message: 'Queue entry deleted successfully.'
    });
  } catch (err) {
    console.error('Error deleting queue entry:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Internal server error deleting queue record.' }
    });
  }
}

module.exports = {
  getAllQueues,
  createQueueEntry,
  updateQueueEntry,
  deleteQueueEntry
};
