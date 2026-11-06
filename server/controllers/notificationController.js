const { pool } = require('../config/db');

/**
 * GET /api/notifications
 */
async function getAllNotifications(req, res) {
  try {
    const { patientId } = req.query;
    let queryText = `
      SELECT 
        n.notification_id,
        n.patient_id,
        p.name AS patient_name,
        n.appointment_id,
        n.notification_type,
        n.threshold_minutes,
        n.channel,
        n.message,
        n.scheduled_at,
        n.sent_at,
        n.status
      FROM notifications n
      LEFT JOIN patients p ON n.patient_id = p.patient_id
    `;
    const values = [];

    if (patientId) {
      queryText += ` WHERE n.patient_id = $1`;
      values.push(patientId);
    }

    queryText += ` ORDER BY n.scheduled_at DESC, n.sent_at DESC;`;

    const result = await pool.query(queryText, values);
    return res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error('Error fetching notifications:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Internal server error fetching notifications.' }
    });
  }
}

module.exports = {
  getAllNotifications
};
