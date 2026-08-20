const { pool } = require('../config/db');
const { generateUniqueId } = require('../utils/idGenerator');

/**
 * GET /api/departments
 */
async function getAllDepartments(req, res) {
  try {
    const queryText = `
      SELECT 
        d.department_id,
        d.department_name,
        d.description,
        COALESCE((SELECT COUNT(*) FROM doctors WHERE department_id = d.department_id), 0) AS assigned_doctors,
        COALESCE(
          (SELECT COUNT(*) FROM queue_entries q 
           JOIN doctors doc ON q.doctor_id = doc.doctor_id 
           WHERE doc.department_id = d.department_id AND q.status = 'WAITING' AND q.queue_date = CURRENT_DATE), 
          0
        ) AS active_queue_count
      FROM departments d
      ORDER BY d.department_name ASC;
    `;
    const result = await pool.query(queryText);
    return res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error('Error fetching departments:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Internal server error fetching departments.' }
    });
  }
}

/**
 * GET /api/departments/:departmentId
 */
async function getDepartmentById(req, res) {
  try {
    const { departmentId } = req.params;
    const result = await pool.query('SELECT * FROM departments WHERE department_id = $1;', [departmentId]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: `Department with ID ${departmentId} not found.` }
      });
    }
    return res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error fetching department:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Internal server error fetching department.' }
    });
  }
}

/**
 * POST /api/departments
 */
async function createDepartment(req, res) {
  try {
    const { department_name, description } = req.body;

    if (!department_name || department_name.trim() === '') {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Department name is required.' }
      });
    }

    // Check for duplicates
    const dupRes = await pool.query('SELECT 1 FROM departments WHERE LOWER(department_name) = $1', [department_name.trim().toLowerCase()]);
    if (dupRes.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: { code: 'CONFLICT', message: `Department with name '${department_name}' already exists.` }
      });
    }

    const departmentId = await generateUniqueId('DEP-', 'departments', 'department_id');

    const queryText = `
      INSERT INTO departments (department_id, department_name, description)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const result = await pool.query(queryText, [departmentId, department_name.trim(), description || null]);
    return res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error creating department:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Internal server error creating department.' }
    });
  }
}

/**
 * PUT /api/departments/:departmentId
 */
async function updateDepartment(req, res) {
  try {
    const { departmentId } = req.params;
    const { department_name, description } = req.body;

    // Check if exists
    const checkRes = await pool.query('SELECT 1 FROM departments WHERE department_id = $1', [departmentId]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: `Department with ID ${departmentId} not found.` }
      });
    }

    // Check duplicate name if changing name
    if (department_name) {
      const dupRes = await pool.query(
        'SELECT 1 FROM departments WHERE LOWER(department_name) = $1 AND department_id != $2', 
        [department_name.trim().toLowerCase(), departmentId]
      );
      if (dupRes.rows.length > 0) {
        return res.status(409).json({
          success: false,
          error: { code: 'CONFLICT', message: `Another department with name '${department_name}' already exists.` }
        });
      }
    }

    const queryText = `
      UPDATE departments
      SET 
        department_name = COALESCE($1, department_name),
        description = COALESCE($2, description)
      WHERE department_id = $3
      RETURNING *;
    `;
    const result = await pool.query(queryText, [
      department_name ? department_name.trim() : null,
      description || null,
      departmentId
    ]);

    return res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error updating department:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Internal server error updating department.' }
    });
  }
}

/**
 * DELETE /api/departments/:departmentId
 */
async function deleteDepartment(req, res) {
  try {
    const { departmentId } = req.params;

    // Check if exists
    const checkRes = await pool.query('SELECT 1 FROM departments WHERE department_id = $1', [departmentId]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: `Department with ID ${departmentId} not found.` }
      });
    }

    // Check foreign key references in doctors
    const docRes = await pool.query('SELECT 1 FROM doctors WHERE department_id = $1 LIMIT 1', [departmentId]);
    if (docRes.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'FOREIGN_KEY_CONFLICT',
          message: 'Cannot delete department because doctors are currently assigned to it.'
        }
      });
    }

    await pool.query('DELETE FROM departments WHERE department_id = $1', [departmentId]);
    return res.json({
      success: true,
      message: 'Department deleted successfully.'
    });
  } catch (err) {
    console.error('Error deleting department:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Internal server error deleting department.' }
    });
  }
}

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
};
