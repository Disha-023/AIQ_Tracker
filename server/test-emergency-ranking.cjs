require('dotenv').config();
const { pool } = require('./config/db');

async function main() {
  try {
    // Simulated data only — nothing is inserted into the database.
    const result = await pool.query(`
      WITH simulated_queue(queue_id, priority, token_number, joined_at) AS (
        VALUES
          ('TEST-NORMAL-1', 'NORMAL', 1, TIMESTAMP '2026-10-14 09:00:00'),
          ('TEST-EMERGENCY-1', 'EMERGENCY', 2, TIMESTAMP '2026-10-14 09:01:00'),
          ('TEST-NORMAL-2', 'NORMAL', 3, TIMESTAMP '2026-10-14 09:02:00')
      ),
      ranked AS (
        SELECT
          queue_id,
          priority,
          token_number,
          ROW_NUMBER() OVER (
            ORDER BY
              CASE WHEN UPPER(priority) = 'EMERGENCY' THEN 0 ELSE 1 END,
              token_number ASC,
              joined_at ASC,
              queue_id ASC
          ) AS new_position
        FROM simulated_queue
      )
      SELECT queue_id, priority, token_number, new_position
      FROM ranked
      ORDER BY new_position;
    `);

    console.log('Simulated emergency-priority ranking:');
    console.table(result.rows);

    const emergency = result.rows.find(
      row => row.priority === 'EMERGENCY'
    );

    if (Number(emergency?.new_position) === 1) {
      console.log('PASS: Emergency entry is ranked first.');
    } else {
      console.error('FAIL: Emergency entry is not ranked first.');
      process.exitCode = 1;
    }
  } catch (error) {
    console.error('Test failed:', error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();