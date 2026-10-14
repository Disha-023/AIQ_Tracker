const { pool } = require('../config/db');
const { generateUniqueId } = require('../utils/idGenerator');
const { spawn } = require('child_process');
const path = require('path');

const pythonScript = path.join(
  __dirname,
  '..',
  'ml-model',
  'predict_wait_time.py'
);

function runWaitTimeModel(features) {
  return new Promise((resolve, reject) => {
    const python = spawn(
      process.env.PYTHON_PATH || 'python',
      [pythonScript],
      { windowsHide: true }
    );

    let stdout = '';
    let stderr = '';

    python.stdout.setEncoding('utf8');
    python.stderr.setEncoding('utf8');

    python.stdout.on('data', chunk => { stdout += chunk; });
    python.stderr.on('data', chunk => { stderr += chunk; });

    python.on('error', reject);

    python.on('close', code => {
      if (code !== 0) {
        return reject(new Error(stderr || `Python exited with code ${code}`));
      }

      try {
        const result = JSON.parse(stdout);
        if (!Number.isFinite(result.predicted_wait_minutes)) {
          throw new Error('Model returned an invalid prediction.');
        }
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });

    python.stdin.end(JSON.stringify(features));
  });
}

/**
 * GET /api/predictions/:queueEntryId
 */
async function getPrediction(req, res) {
  try {
    const { queueEntryId } = req.params;

    const queueRes = await pool.query(
  `SELECT
     qe.*,
     d.average_consultation_time
   FROM queue_entries qe
   LEFT JOIN doctors d ON d.doctor_id = qe.doctor_id
   WHERE qe.queue_id = $1`,
  [queueEntryId]
);





    if (queueRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Queue entry with ID ${queueEntryId} not found.`
        }
      });
    }

    const queueEntry = queueRes.rows[0];

if (queueEntry.status !== 'WAITING') {
  return res.status(409).json({
    success: false,
    error: {
      code: 'QUEUE_NOT_WAITING',
      message: 'Predictions are only available for waiting queue entries.'
    }
  });
}

    // Reuse only recent predictions.
const checkRes = await pool.query(
  `SELECT *
   FROM wait_time_predictions
   WHERE queue_id = $1
   ORDER BY prediction_time DESC NULLS LAST
   LIMIT 1`,
  [queueEntryId]
);

const existingPrediction = checkRes.rows[0];

if (
  existingPrediction &&
  existingPrediction.prediction_time &&
  Date.now() - new Date(existingPrediction.prediction_time).getTime()
    < 2 * 60 * 1000
) {
  return res.json({
    success: true,
    data: existingPrediction
  });
}
    const aheadRes = await pool.query(
      `SELECT
         COUNT(*)::int AS patients_ahead,
         COUNT(*) FILTER (
           WHERE UPPER(priority) = 'EMERGENCY'
         )::int AS priority_patients_ahead
       FROM queue_entries
       WHERE doctor_id = $1
         AND queue_date = $2::date
         AND status = 'WAITING'
         AND queue_id <> $3
         AND queue_position < $4`,
      [
        queueEntry.doctor_id,
        queueEntry.queue_date,
        queueEntryId,
        queueEntry.queue_position
      ]
    );

    const patientsAhead = aheadRes.rows[0].patients_ahead;
    const priorityPatientsAhead = aheadRes.rows[0].priority_patients_ahead;

    const now = new Date();
    const hourOfDay = now.getHours();
    const dayOfWeek = (now.getDay() + 6) % 7; // Monday=0

  const averageConsultationTime = Math.max(
  1,
  Number(queueEntry.average_consultation_time) || 8
);

const features = {
  patients_ahead: patientsAhead,
  avg_consultation_time_ahead: averageConsultationTime,
  total_consultation_time_ahead:
    patientsAhead * averageConsultationTime,
  max_consultation_time_ahead: Math.max(
    averageConsultationTime,
    12
  ),
  long_cases_ahead: 0,
  priority_patients_ahead: priorityPatientsAhead,
  hour_of_day: hourOfDay,
  day_of_week: dayOfWeek,
  doctor_busy: 0,
  current_consultation_remaining: 0
};

    const prediction = await runWaitTimeModel(features);
    const predictedMinutes = Math.max(
      0,
      Math.round(prediction.predicted_wait_minutes)
    );

    const predictionId = await generateUniqueId(
      'PRD-',
      'wait_time_predictions',
      'prediction_id'
    );

    let result;

if (existingPrediction) {
  result = await pool.query(
    `UPDATE wait_time_predictions
     SET minimum_wait_minutes = $1,
         maximum_wait_minutes = $2,
         confidence_score = $3,
         prediction_time = CURRENT_TIMESTAMP,
         predicted_wait_minutes = $4,
         model_version = $5
     WHERE prediction_id = $6
     RETURNING *`,
    [
      predictedMinutes,
      predictedMinutes + 8,
      null,
      predictedMinutes,
      prediction.model_version || 'RF-1.0',
      existingPrediction.prediction_id
    ]
  );
} else {
  result = await pool.query(
    `INSERT INTO wait_time_predictions (
       prediction_id, queue_id, patient_id, doctor_id,
       minimum_wait_minutes, maximum_wait_minutes, confidence_score,
       prediction_time, predicted_wait_minutes, model_version
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, $8, $9)
     RETURNING *`,
    [
      predictionId,
      queueEntryId,
      queueEntry.patient_id,
      queueEntry.doctor_id,
      predictedMinutes,
      predictedMinutes + 8,
      null,
      predictedMinutes,
      prediction.model_version || 'RF-1.0'
    ]
  );
}
 return res.status(existingPrediction ? 200 : 201).json({
  success: true,
  data: result.rows[0]
});
  } catch (err) {
    console.error('Error in wait-time prediction:', err);
    return res.status(500).json({
      success: false,
      error: {
        code: 'PREDICTION_ERROR',
        message: 'Unable to calculate wait-time prediction.'
      }
    });
  }
}

module.exports = { getPrediction };
