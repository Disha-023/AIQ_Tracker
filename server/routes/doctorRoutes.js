const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

// Doctor REST routes
router.get('/', doctorController.getAllDoctors);
router.get('/:doctorId', doctorController.getDoctorById);
router.post('/', doctorController.createDoctor);
router.put('/:doctorId', doctorController.updateDoctor);
router.delete('/:doctorId', doctorController.deleteDoctor);

module.exports = router;
