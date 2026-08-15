// Patient Mock Data Module for AIQ Tracker Phase 2

export const patientMockData = {
  patient: {
    name: "Nisha Sharma",
    patientId: "AIQ-P8942",
    mobile: "+91 98765 43210",
    email: "nisha.sharma@example.com",
    bloodGroup: "O+",
    dob: "14 May 1996"
  },

  appointment: {
    doctor: "Dr. Anjali Sharma",
    specialization: "General Physician",
    date: "13 August 2026",
    time: "4:00 PM",
    token: "#27",
    status: "Confirmed",
    department: "OPD Room 104"
  },

  queue: {
    yourToken: "#27",
    currentToken: "#22",
    patientsAhead: 5,
    estimatedWait: "38–45 min",
    estimatedTurn: "4:05 PM",
    status: "On Track"
  },

  travel: {
    hospital: "AIQ Care Hospital",
    distance: "7.2 km",
    travelTime: "24 min",
    recommendedDeparture: "3:30 PM",
    status: "You're on time"
  },

  notifications: [
    {
      id: 1,
      title: "Appointment Confirmed",
      message: "Your appointment with Dr. Anjali Sharma is confirmed for 4:00 PM.",
      time: "10 min ago",
      type: "appointment"
    },
    {
      id: 2,
      title: "Travel Reminder",
      message: "Your estimated travel time is 24 minutes. Recommended departure at 3:30 PM.",
      time: "25 min ago",
      type: "travel"
    },
    {
      id: 3,
      title: "Queue Update",
      message: "Your estimated waiting time is currently 38–45 minutes with 5 patients ahead.",
      time: "1 hour ago",
      type: "queue"
    }
  ],

  visits: [
    {
      id: "V-901",
      date: "13 Aug 2026",
      doctor: "Dr. Anjali Sharma",
      specialization: "General Physician",
      status: "Completed",
      notes: "Regular routine checkup & prescription issued."
    },
    {
      id: "V-842",
      date: "28 July 2026",
      doctor: "Dr. Anjali Sharma",
      specialization: "General Physician",
      status: "Completed",
      notes: "Follow-up consultation."
    },
    {
      id: "V-710",
      date: "12 July 2026",
      doctor: "Dr. Rahul Mehta",
      specialization: "Cardiologist",
      status: "Completed",
      notes: "ECG and BP examination."
    }
  ]
};
