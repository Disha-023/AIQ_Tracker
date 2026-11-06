const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');

// Department REST routes
router.get('/', departmentController.getAllDepartments);
router.get('/:departmentId', departmentController.getDepartmentById);
router.post('/', departmentController.createDepartment);
router.put('/:departmentId', departmentController.updateDepartment);
router.delete('/:departmentId', departmentController.deleteDepartment);

module.exports = router;
