require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { pool } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const queueRoutes = require('./routes/queueRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const predictionRoutes = require('./routes/predictionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const directionsRoutes = require('./routes/directionsRoutes');

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

// Patient Directory Routes
app.use('/api/patients', patientRoutes);

// Doctor and Department Routes
app.use('/api/doctors', doctorRoutes);
app.use('/api/departments', departmentRoutes);

// Appointment Routes
app.use('/api/appointments', appointmentRoutes);

// Queue Routes
app.use('/api/queues', queueRoutes);

// Consultation Routes
app.use('/api/consultations', consultationRoutes);

// Notification Routes
app.use('/api/notifications', notificationRoutes);

// Prediction Routes
app.use('/api/predictions', predictionRoutes);

// Dashboard Routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/directions', directionsRoutes);


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
      me: 'GET /api/auth/me',
      patients: 'GET /api/patients',
      doctors: 'GET /api/doctors',
      departments: 'GET /api/departments',
      appointments: 'GET /api/appointments',
      queues: 'GET /api/queues',
      consultations: 'GET /api/consultations',
      notifications: 'GET /api/notifications',
      predictions: 'GET /api/predictions/:queueEntryId',
      dashboard: 'GET /api/dashboard/stats'
    }
  });
});

app.listen(PORT, () => {
  console.log(`AIQ Tracker server listening on port ${PORT}`);

  // Test database connection on startup using the existing pool
  pool.query('SELECT NOW()')
    .then(res => {
      console.log('SUCCESS:');
      console.log('PostgreSQL connected successfully');
      console.log(`Database time: ${res.rows[0].now}`);
    })
    .catch(err => {
  console.error('FAILURE:');
  console.error('PostgreSQL connection failed');
  console.error(err);
});
});
