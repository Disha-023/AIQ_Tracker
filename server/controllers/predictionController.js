const { pool } = require('../config/db');
const { generateUniqueId } = require('../utils/idGenerator');

/**
 * GET /api/predictions/:queueEntryId
 * Retrieve or generate wait-time prediction for a queue entry
 */
async function getPrediction(req, res) {
  try {
    const { queueEntryId } = req.params;

    // Check if prediction already exists in the database
    const checkRes = await pool.query(
      `SELECT * FROM wait_time_predictions WHERE queue_id = $1`,
      [queueEntryId]
    );

    if (checkRes.rows.length > 0) {
      return res.json({
        success: true,
        data: checkRes.rows[0]
      });
    }

    // Otherwise, find the queue entry to get state
    const queueRes = await pool.query(
      `SELECT * FROM queue_entries WHERE queue_id = $1`,
      [queueEntryId]
    );

    if (queueRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: `Queue entry with ID ${queueEntryId} not found.` }
      });
    }

    const queueEntry = queueRes.rows[0];
    
    // Count active patients ahead in the doctor's queue today
    const aheadRes = await pool.query(
      `SELECT COUNT(*) AS count FROM queue_entries 
       WHERE doctor_id = $1 AND queue_date = CURRENT_DATE AND status = 'WAITING' AND queue_position < $2`,
      [queueEntry.doctor_id, queueEntry.queue_position]
    );
    const patientsAhead = parseInt(aheadRes.rows[0].count, 10);

    // Calculate prediction: 8 minutes per patient ahead + 5 minutes base buffer
    const predictedMinutes = Math.max(5, patientsAhead * 8 + 5);

    const predictionId = await generateUniqueId('PRD-', 'wait_time_predictions', 'prediction_id');

    const insertText = `
      INSERT INTO wait_time_predictions (
        prediction_id, queue_id, patient_id, doctor_id, 
        minimum_wait_minutes, maximum_wait_minutes, confidence_score, 
        prediction_time, predicted_wait_minutes, model_version
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, $8, $9)
      RETURNING *;
    `;
    const insertValues = [
      predictionId,
      queueEntryId,
      queueEntry.patient_id,
      queueEntry.doctor_id,
      predictedMinutes,          // minimum_wait_minutes
      predictedMinutes + 8,      // maximum_wait_minutes
      88.50,                     // confidence_score
      predictedMinutes,          // predicted_wait_minutes
      'V1.0-DB'                  // model_version
    ];

    const result = await pool.query(insertText, insertValues);

    return res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error in wait-time prediction:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Internal server error calculating waiting-time prediction.' }
    });
  }
}

module.exports = {
  getPrediction
};
