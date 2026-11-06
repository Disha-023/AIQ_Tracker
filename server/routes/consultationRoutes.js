const express = require('express');
const router = express.Router();
const consultationController = require('../controllers/consultationController');

// Consultation REST routes
router.get('/', consultationController.getAllConsultations);

module.exports = router;
