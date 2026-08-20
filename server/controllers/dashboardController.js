const { pool } = require('../config/db');

/**
 * GET /api/dashboard/stats
 * Aggregate key metrics from all database tables
 */
async function getStats(req, res) {
  try {
    // 1. Total registered patients
    const patientRes = await pool.query(`SELECT COUNT(*) AS count FROM patients`);
    
    // 2. Active doctors today
    const doctorRes = await pool.query(`SELECT COUNT(*) AS count FROM doctors WHERE status = 'Active'`);
    
    // 3. Today's waiting patients
    const waitingRes = await pool.query(`SELECT COUNT(*) AS count FROM queue_entries WHERE queue_date = CURRENT_DATE AND status = 'WAITING'`);
    
    // 4. Today's completed consultations
    const completedRes = await pool.query(`SELECT COUNT(*) AS count FROM queue_entries WHERE queue_date = CURRENT_DATE AND status = 'COMPLETED'`);

    // 5. Average wait time predicted today
    const avgWaitRes = await pool.query(`SELECT COALESCE(AVG(predicted_wait_minutes), 0) AS avg_wait FROM wait_time_predictions WHERE DATE(prediction_time) = CURRENT_DATE`);

    const stats = {
      totalPatients: parseInt(patientRes.rows[0].count, 10),
      activeDoctors: parseInt(doctorRes.rows[0].count, 10),
      waitingPatients: parseInt(waitingRes.rows[0].count, 10),
      completedVisits: parseInt(completedRes.rows[0].count, 10),
      averageWaitMin: Math.round(parseFloat(avgWaitRes.rows[0].avg_wait)) || (parseInt(waitingRes.rows[0].count, 10) * 8)
    };

    return res.json({
      success: true,
      data: stats
    });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Internal server error aggregating statistics.' }
    });
  }
}

async function getReports(req, res) {
  try {
    // 1. Weekly appointments volume
    const weeklyRes = await pool.query(
      `SELECT COUNT(*) AS count FROM appointments WHERE appointment_date >= CURRENT_DATE - INTERVAL '7 days'`
    );
    
    // 2. Average wait time trend (last 7 days average predicted wait time)
    const avgWaitRes = await pool.query(
      `SELECT COALESCE(ROUND(AVG(predicted_wait_minutes)), 0) AS avg_wait FROM wait_time_predictions WHERE prediction_time >= CURRENT_DATE - INTERVAL '7 days'`
    );

    // 3. Completion rate
    const completionRes = await pool.query(
      `SELECT COALESCE(ROUND(COUNT(*) FILTER (WHERE status = 'Completed') * 100.0 / NULLIF(COUNT(*), 0)), 100) AS rate FROM appointments`
    );

    // 4. Cancellation rate
    const cancellationRes = await pool.query(
      `SELECT COALESCE(ROUND(COUNT(*) FILTER (WHERE status = 'Cancelled') * 100.0 / NULLIF(COUNT(*), 0)), 0) AS rate FROM appointments`
    );

    // 5. Doctor-wise performance stats
    const doctorStatsRes = await pool.query(
      `SELECT 
        d.name,
        COUNT(c.consultation_id)::integer AS consultations,
        COALESCE(ROUND(AVG(c.consultation_duration)), 10) || ' mins' AS avg_duration
      FROM doctors d
      LEFT JOIN consultations c ON d.doctor_id = c.doctor_id
      GROUP BY d.doctor_id, d.name
      ORDER BY consultations DESC`
    );

    // 6. Department patient load distribution
    const deptLoadRes = await pool.query(
      `SELECT 
        dep.department_name AS department,
        COUNT(q.queue_id)::integer AS count
      FROM departments dep
      LEFT JOIN doctors doc ON dep.department_id = doc.department_id
      LEFT JOIN queue_entries q ON doc.doctor_id = q.doctor_id AND q.queue_date >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY dep.department_id, dep.department_name`
    );

    const totalLoad = deptLoadRes.rows.reduce((sum, r) => sum + r.count, 0);
    const departmentStats = deptLoadRes.rows.map(r => ({
      department: r.department,
      percentage: totalLoad > 0 ? Math.round((r.count * 100) / totalLoad) : 0
    }));

    // If there is no load data, set a default percentage distribution so page isn't blank
    if (totalLoad === 0 && departmentStats.length > 0) {
      const equalShare = Math.round(100 / departmentStats.length);
      departmentStats.forEach(d => d.percentage = equalShare);
    }

    const reportsData = {
      weeklyAppointments: parseInt(weeklyRes.rows[0].count, 10),
      avgWaitTimeTrend: `${avgWaitRes.rows[0].avg_wait} mins average`,
      completionRate: `${completionRes.rows[0].rate}%`,
      cancellationRate: `${cancellationRes.rows[0].rate}%`,
      doctorStats: doctorStatsRes.rows,
      departmentStats
    };

    return res.json({
      success: true,
      data: reportsData
    });
  } catch (err) {
    console.error('Error compiling hospital reports analytics:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Internal server error compiling hospital reports.' }
    });
  }
}

module.exports = {
  getStats,
  getReports
};
