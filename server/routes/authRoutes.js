const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateJWT } = require('../middleware/authMiddleware');
const rateLimiter = require('../middleware/rateLimiter');

// Public Health Endpoint
router.get('/health', authController.healthCheck);

// Authentication Endpoints
router.post('/login', rateLimiter, authController.login);
router.post('/initiate-staff-login', rateLimiter, authController.initiateStaffLogin);
router.post('/verify-staff-otp', authController.verifyStaffOtp);
router.post('/register-patient', authController.registerPatient);

// Protected Auth Endpoint
router.get('/me', authenticateJWT, authController.getMe);

module.exports = router;
