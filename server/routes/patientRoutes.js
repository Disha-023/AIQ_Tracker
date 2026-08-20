const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// Patient Directory Endpoints
router.get('/', patientController.getAllPatients);
router.get('/:patientId', patientController.getPatientById);
router.post('/', patientController.createPatient);
router.put('/:patientId', patientController.updatePatient);
router.delete('/:patientId', patientController.deletePatient);

module.exports = router;
