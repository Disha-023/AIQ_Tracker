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

    queryText += ` ORDER BY
  CASE WHEN UPPER(q.priority) = 'EMERGENCY' THEN 0 ELSE 1 END ASC,
  q.queue_position ASC,
  q.token_number ASC;`;

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
    // Determine the next queue position for this doctor today.
    // Emergency patients are placed before normal waiting patients.
    const normalizedPriority = String(priority || 'NORMAL').toUpperCase();

    const waitingRes = await client.query(
      `SELECT queue_id, priority, queue_position, token_number
       FROM queue_entries
       WHERE doctor_id = $1
         AND queue_date = CURRENT_DATE
         AND status = 'WAITING'
       ORDER BY
         CASE WHEN UPPER(priority) = 'EMERGENCY' THEN 0 ELSE 1 END,
         queue_position ASC,
         token_number ASC
       FOR UPDATE`,
      [doctor_id]
    );

    const queuePosition = normalizedPriority === 'EMERGENCY'
      ? 1
      : waitingRes.rows.length + 1;

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
      normalizedPriority
    ];

    const result = await client.query(insertText, insertValues);



    // Rebuild waiting positions: emergencies first, then normal patients.
    await client.query(
      `WITH ranked AS (
     SELECT
       queue_id,
       ROW_NUMBER() OVER (
         ORDER BY
           CASE WHEN UPPER(priority) = 'EMERGENCY' THEN 0 ELSE 1 END,
           token_number ASC,
           joined_at ASC,
           queue_id ASC
       ) AS new_position
     FROM queue_entries
     WHERE doctor_id = $1
       AND queue_date = CURRENT_DATE
       AND status = 'WAITING'
   )
   UPDATE queue_entries AS q
   SET queue_position = ranked.new_position
   FROM ranked
   WHERE q.queue_id = ranked.queue_id`,
      [doctor_id]
    );

    const refreshed = await client.query(
      'SELECT * FROM queue_entries WHERE queue_id = $1',
      [result.rows[0].queue_id]
    );

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
      data: refreshed.rows[0]
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
  let transactionStarted = false;

  try {
    const { queueId } = req.params;
    const { status, priority } = req.body;

    await client.query('BEGIN');
    transactionStarted = true;

    const checkRes = await client.query(
      'SELECT * FROM queue_entries WHERE queue_id = $1 FOR UPDATE',
      [queueId]
    );

    if (checkRes.rows.length === 0) {
      await client.query('ROLLBACK');
      transactionStarted = false;

      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Queue entry with ID ${queueId} not found.`
        }
      });
    }

    const currentEntry = checkRes.rows[0];

    const allowedStatuses = [
      'WAITING',
      'SERVING',
      'COMPLETED',
      'CANCELLED'
    ];

    const allowedPriorities = ['NORMAL', 'EMERGENCY'];

    if (status && !allowedStatuses.includes(String(status).toUpperCase())) {
      await client.query('ROLLBACK');
      transactionStarted = false;

      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_STATUS', message: 'Invalid queue status.' }
      });
    }

    if (
      priority &&
      !allowedPriorities.includes(String(priority).toUpperCase())
    ) {
      await client.query('ROLLBACK');
      transactionStarted = false;

      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_PRIORITY',
          message: 'Priority must be NORMAL or EMERGENCY.'
        }
      });
    }

    const newStatus = status
      ? String(status).toUpperCase()
      : currentEntry.status;

    const newPriority = priority
      ? String(priority).toUpperCase()
      : currentEntry.priority;

    const isWaiting = newStatus === 'WAITING';

    await client.query(
      `UPDATE queue_entries
       SET priority = $1,
           status = $2,
           queue_position = CASE WHEN $3 THEN queue_position ELSE 0 END,
           check_in_time = CASE
             WHEN $2 = 'SERVING'
             THEN COALESCE(check_in_time, CURRENT_TIMESTAMP)
             ELSE check_in_time
           END,
           completed_at = CASE
             WHEN $2 IN ('COMPLETED', 'CANCELLED')
             THEN COALESCE(completed_at, CURRENT_TIMESTAMP)
             ELSE completed_at
           END
       WHERE queue_id = $4`,
      [newPriority, newStatus, isWaiting, queueId]
    );

    // Recalculate positions for this doctor's queue on this entry's date.
    await client.query(
      `WITH ranked AS (
         SELECT
           queue_id,
           ROW_NUMBER() OVER (
             ORDER BY
               CASE WHEN UPPER(priority) = 'EMERGENCY' THEN 0 ELSE 1 END,
               token_number ASC,
               joined_at ASC,
               queue_id ASC
           ) AS new_position
         FROM queue_entries
         WHERE doctor_id = $1
           AND queue_date = $2::date
           AND status = 'WAITING'
       )
       UPDATE queue_entries AS q
       SET queue_position = ranked.new_position
       FROM ranked
       WHERE q.queue_id = ranked.queue_id`,
      [currentEntry.doctor_id, currentEntry.queue_date]
    );

    // Log a consultation only on the first transition to COMPLETED.
    if (newStatus === 'COMPLETED' && currentEntry.status !== 'COMPLETED') {
      const consultationId = await generateUniqueId(
        'CON-',
        'consultations',
        'consultation_id'
      );

      await client.query(
        `INSERT INTO consultations (
           consultation_id,
           patient_id,
           doctor_id,
           appointment_id,
           queue_id,
           scheduled_start_time,
           actual_start_time,
           actual_end_time,
           consultation_duration,
           status
         ) VALUES (
           $1, $2, $3, $4, $5,
           CURRENT_TIMESTAMP - INTERVAL '10 minutes',
           CURRENT_TIMESTAMP - INTERVAL '10 minutes',
           CURRENT_TIMESTAMP,
           $6,
           'Completed'
         )`,
        [
          consultationId,
          currentEntry.patient_id,
          currentEntry.doctor_id,
          currentEntry.appointment_id || null,
          queueId,
          10
        ]
      );

      if (currentEntry.appointment_id) {
        await client.query(
          `UPDATE appointments
           SET status = 'Completed'
           WHERE appointment_id = $1`,
          [currentEntry.appointment_id]
        );
      }
    }

    const refreshed = await client.query(
      'SELECT * FROM queue_entries WHERE queue_id = $1',
      [queueId]
    );

    await client.query('COMMIT');
    transactionStarted = false;

    return res.json({
      success: true,
      data: refreshed.rows[0]
    });
  } catch (err) {
    if (transactionStarted) {
      await client.query('ROLLBACK');
    }

    console.error('Error updating queue:', err);

    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Internal server error updating live queue.'
      }
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
