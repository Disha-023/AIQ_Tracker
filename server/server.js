const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'AIQ Tracker server is running'
  });
});

// Authentication Routes
app.use('/api/auth', authRoutes);

// Root API Index
app.get('/api', (req, res) => {
  res.json({
    name: 'AIQ Tracker Express API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      login: 'POST /api/auth/login',
      initiateStaffLogin: 'POST /api/auth/initiate-staff-login',
      verifyStaffOtp: 'POST /api/auth/verify-staff-otp',
      registerPatient: 'POST /api/auth/register-patient',
      me: 'GET /api/auth/me'
    }
  });
});

app.listen(PORT, () => {
  console.log(`AIQ Tracker server listening on port ${PORT}`);
});
