const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');

// Prediction REST routes
router.get('/:queueEntryId', predictionController.getPrediction);

module.exports = router;
