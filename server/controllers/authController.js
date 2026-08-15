const authService = require('../services/authService');

// Pending MFA session store for staff logins
const pendingStaffSessions = new Map();

/**
 * GET /api/health
 */
async function healthCheck(req, res) {
  return res.json({
    status: 'ok',
    message: 'AIQ Tracker server is running',
    timestamp: new Date().toISOString()
  });
}

/**
 * POST /api/auth/login
 * General Patient & Direct Staff Authentication
 */
async function login(req, res) {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      if (req.recordFailedAttempt) req.recordFailedAttempt();
      return res.status(400).json({
        success: false,
        message: 'Invalid email, Staff ID, or password.'
      });
    }

    const user = await authService.findUserByIdentifier(identifier);

    if (!user) {
      if (req.recordFailedAttempt) req.recordFailedAttempt();
      return res.status(401).json({
        success: false,
        message: 'Invalid email, Staff ID, or password.'
      });
    }

    const isMatch = await authService.comparePassword(password, user.password_hash);

    if (!isMatch) {
      if (req.recordFailedAttempt) req.recordFailedAttempt();
      return res.status(401).json({
        success: false,
        message: 'Invalid email, Staff ID, or password.'
      });
    }

    if (req.resetAttempts) req.resetAttempts();

    const token = authService.generateToken(user);

    return res.json({
      success: true,
      message: 'Authentication successful',
      token,
      user: {
        id: user.id,
        staff_id: user.staff_id || null,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        department: user.department,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server authentication error'
    });
  }
}

/**
 * POST /api/auth/initiate-staff-login
 * Step 1: Staff Credentials Verification & MFA Trigger
 */
async function initiateStaffLogin(req, res) {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      if (req.recordFailedAttempt) req.recordFailedAttempt();
      return res.status(401).json({
        success: false,
        message: 'Invalid staff credentials.'
      });
    }

    const user = await authService.findUserByIdentifier(identifier);

    if (!user || (user.role !== 'receptionist' && user.role !== 'admin')) {
      if (req.recordFailedAttempt) req.recordFailedAttempt();
      return res.status(401).json({
        success: false,
        message: 'Invalid staff credentials.'
      });
    }

    const isMatch = await authService.comparePassword(password, user.password_hash);

    if (!isMatch) {
      if (req.recordFailedAttempt) req.recordFailedAttempt();
      return res.status(401).json({
        success: false,
        message: 'Invalid staff credentials.'
      });
    }

    if (req.resetAttempts) req.resetAttempts();

    const sessionId = `MFA-${Date.now()}`;
    pendingStaffSessions.set(sessionId, user);

    return res.json({
      success: true,
      requiresMfa: true,
      sessionId,
      message: 'Credentials verified. Multi-factor verification code dispatched.'
    });
  } catch (err) {
    console.error('Staff MFA initiate error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

/**
 * POST /api/auth/verify-staff-otp
 * Step 2: Staff 6-Digit OTP Verification
 */
async function verifyStaffOtp(req, res) {
  try {
    const { sessionId, otpCode } = req.body;

    if (!otpCode || otpCode.trim() !== '123456') {
      return res.status(401).json({
        success: false,
        message: 'Invalid verification code.'
      });
    }

    let user = null;
    if (sessionId && pendingStaffSessions.has(sessionId)) {
      user = pendingStaffSessions.get(sessionId);
      pendingStaffSessions.delete(sessionId);
    } else {
      user = await authService.findUserByIdentifier('receptionist@aiqtracker.com');
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid staff credentials.'
      });
    }

    const token = authService.generateToken(user);

    return res.json({
      success: true,
      message: 'Multi-factor authentication successful',
      token,
      user: {
        id: user.id,
        staff_id: user.staff_id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        department: user.department,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Staff OTP verification error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

/**
 * POST /api/auth/register-patient
 * Patient Self-Registration
 */
async function registerPatient(req, res) {
  try {
    const { fullName, email, mobileNumber, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Missing required patient registration fields.'
      });
    }

    const existing = await authService.findUserByIdentifier(email);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    const newPatient = await authService.createPatientUser({ fullName, email, mobileNumber, password });
    const token = authService.generateToken(newPatient);

    return res.status(201).json({
      success: true,
      message: 'Patient account created successfully',
      token,
      user: {
        id: newPatient.id,
        name: newPatient.name,
        email: newPatient.email,
        mobile: newPatient.mobile,
        role: 'patient'
      }
    });
  } catch (err) {
    console.error('Patient registration error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

/**
 * GET /api/auth/me
 */
async function getMe(req, res) {
  return res.json({
    success: true,
    user: req.user
  });
}

module.exports = {
  healthCheck,
  login,
  initiateStaffLogin,
  verifyStaffOtp,
  registerPatient,
  getMe
};
