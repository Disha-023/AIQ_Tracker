const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Notification REST routes
router.get('/', notificationController.getAllNotifications);

module.exports = router;
