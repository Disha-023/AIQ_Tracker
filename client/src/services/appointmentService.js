// Centralized Appointment and Queue Service for AIQ Tracker

const BOOKING_STORAGE_KEY = 'aiq_tracker_active_booking';
const TOKEN_COUNTER_KEY = 'aiq_tracker_token_counter';

const INITIAL_DEFAULT_BOOKING = {
  id: 'APT-2701',
  patientId: 'AIQ-P8942',
  patientName: 'Nisha Sharma',
  doctorId: 'DOC-1',
  doctorName: 'Dr. Anjali Sharma',
  specialization: 'General Physician',
  department: 'OPD Room 104',
  date: '13 August 2026',
  time: '4:00 PM',
  token: '#27',
  currentToken: '#22',
  patientsAhead: 5,
  estimatedWait: '38–45 min',
  estimatedTurn: '4:05 PM',
  type: 'appointment',
  status: 'Confirmed', // Confirmed | Waiting | Cancelled
  createdAt: new Date().toISOString()
};

export const appointmentService = {
  // Get active booking from localStorage
  getActiveBooking: () => {
    try {
      const data = localStorage.getItem(BOOKING_STORAGE_KEY);
      if (!data) {
        // Seed initial default booking if empty
        localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(INITIAL_DEFAULT_BOOKING));
        return INITIAL_DEFAULT_BOOKING;
      }
      const booking = JSON.parse(data);
      return booking;
    } catch {
      return INITIAL_DEFAULT_BOOKING;
    }
  },

  // Generate next sequential token
  generateNextToken: () => {
    try {
      const counter = localStorage.getItem(TOKEN_COUNTER_KEY);
      let nextNum = counter ? parseInt(counter, 10) + 1 : 28;
      localStorage.setItem(TOKEN_COUNTER_KEY, nextNum.toString());
      return `#${nextNum}`;
    } catch {
      return `#28`;
    }
  },

  // Create new scheduled appointment
  createAppointment: (data) => {
    const token = appointmentService.generateNextToken();
    const newBooking = {
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: data.patientId || 'AIQ-P8942',
      patientName: data.patientName || 'Nisha Sharma',
      doctorId: data.doctor.id,
      doctorName: data.doctor.name,
      specialization: data.doctor.specialization,
      department: data.doctor.room,
      date: data.date,
      time: data.time,
      token,
      currentToken: data.doctor.currentToken || '#22',
      patientsAhead: data.doctor.patientsWaiting || 5,
      estimatedWait: `${data.doctor.estimatedWaitMinutes || 40} min`,
      estimatedTurn: data.time,
      type: 'appointment',
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(newBooking));
    return newBooking;
  },

  // Create new walk-in queue token
  createWalkIn: (data) => {
    const token = appointmentService.generateNextToken();
    const newWalkIn = {
      id: `WLK-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: data.patientId || 'AIQ-P8942',
      patientName: data.patientName || 'Nisha Sharma',
      doctorId: data.doctor.id,
      doctorName: data.doctor.name,
      specialization: data.doctor.specialization,
      department: data.doctor.room,
      date: 'Today (Walk-in)',
      time: 'Immediate',
      token,
      currentToken: data.doctor.currentToken || '#22',
      patientsAhead: data.doctor.patientsWaiting || 5,
      estimatedWait: `${data.doctor.estimatedWaitMinutes || 40} min`,
      estimatedTurn: 'Soon',
      type: 'walk-in',
      status: 'Waiting',
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(newWalkIn));
    return newWalkIn;
  },

  // Cancel active booking
  cancelBooking: () => {
    try {
      const data = localStorage.getItem(BOOKING_STORAGE_KEY);
      if (data) {
        const booking = JSON.parse(data);
        booking.status = 'Cancelled';
        localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(booking));
        return booking;
      }
    } catch (err) {
      console.error('Failed to cancel booking', err);
    }
    return null;
  }
};
