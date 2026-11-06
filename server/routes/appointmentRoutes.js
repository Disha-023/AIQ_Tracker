const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Appointment REST routes
router.get('/', appointmentController.getAllAppointments);
router.get('/:appointmentId', appointmentController.getAppointmentById);
router.post('/', appointmentController.createAppointment);
router.put('/:appointmentId', appointmentController.updateAppointment);
router.delete('/:appointmentId', appointmentController.deleteAppointment);

module.exports = router;
