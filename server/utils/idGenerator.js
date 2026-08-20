const { pool } = require('../config/db');

/**
 * Generates a unique 9-to-10 character alphanumeric ID for a database table.
 * e.g., PAT-12345. Ensures the generated ID does not already exist.
 *
 * @param {string} prefix - The ID prefix (e.g., 'PAT-', 'APT-'). Must be 4 characters or fewer.
 * @param {string} tableName - The target database table name (e.g., 'patients').
 * @param {string} idColumnName - The primary key column name (e.g., 'patient_id').
 * @returns {Promise<string>} The unique ID.
 */
async function generateUniqueId(prefix, tableName, idColumnName) {
  let isUnique = false;
  let newId = '';
  
  while (!isUnique) {
    // Generate 5 random digits. With a 4-char prefix, total length is 9 chars (e.g. PAT-12345)
    const randomDigits = Math.floor(10000 + Math.random() * 90000).toString();
    newId = `${prefix}${randomDigits}`;
    
    const queryText = `SELECT 1 FROM ${tableName} WHERE ${idColumnName} = $1`;
    const res = await pool.query(queryText, [newId]);
    if (res.rows.length === 0) {
      isUnique = true;
    }
  }
  
  return newId;
}

module.exports = {
  generateUniqueId
};
