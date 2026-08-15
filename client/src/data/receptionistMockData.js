// Receptionist Hospital Operations Mock Dataset for AIQ Tracker

export const receptionistMockData = {
  receptionist: {
    name: "Sarah Jenkins",
    staffId: "REC001",
    email: "receptionist@aiqtracker.com",
    mobile: "+91 98765 43211",
    department: "OPD / Front Desk",
    role: "Receptionist"
  },

  stats: {
    todaysAppointments: 42,
    patientsWaiting: 18,
    currentlyServingToken: "#24",
    completedVisits: 31
  },

  liveQueue: {
    currentToken: "#24",
    nextToken: "#25",
    patientsWaiting: 18,
    averageWait: "12 min",
    doctor: "Dr. Rahul Mehta (OPD Room 202)",
    status: "Active"
  },

  todayAppointments: [
    {
      id: "APT-201",
      patientName: "Rahul Sharma",
      patientId: "AIQ-P101",
      mobile: "+91 98111 22233",
      doctor: "Dr. Rahul Mehta",
      time: "10:30 AM",
      token: "#24",
      type: "Walk-in",
      status: "Waiting"
    },
    {
      id: "APT-202",
      patientName: "Priya Patil",
      patientId: "AIQ-P102",
      mobile: "+91 98222 33344",
      doctor: "Dr. Anjali Sharma",
      time: "11:00 AM",
      token: "#25",
      type: "Online Booking",
      status: "Confirmed"
    },
    {
      id: "APT-203",
      patientName: "Neha Gupta",
      patientId: "AIQ-P103",
      mobile: "+91 98333 44455",
      doctor: "Dr. Anjali Sharma",
      time: "11:30 AM",
      token: "#26",
      type: "Walk-in",
      status: "Waiting"
    },
    {
      id: "APT-204",
      patientName: "Nisha Sharma",
      patientId: "AIQ-P8942",
      mobile: "+91 98765 43210",
      doctor: "Dr. Anjali Sharma",
      time: "04:00 PM",
      token: "#27",
      type: "Online Booking",
      status: "Confirmed"
    }
  ],

  patients: [
    {
      id: "AIQ-P8942",
      name: "Nisha Sharma",
      mobile: "+91 98765 43210",
      email: "nisha.sharma@example.com",
      gender: "Female",
      dob: "14 May 1996",
      lastVisit: "28 July 2026",
      upcomingAppointment: "13 Aug 2026 at 4:00 PM",
      status: "Active"
    },
    {
      id: "AIQ-P101",
      name: "Rahul Sharma",
      mobile: "+91 98111 22233",
      email: "rahul.sharma@example.com",
      gender: "Male",
      dob: "10 Jan 1990",
      lastVisit: "15 June 2026",
      upcomingAppointment: "Today (Token #24)",
      status: "Waiting in OPD"
    },
    {
      id: "AIQ-P102",
      name: "Priya Patil",
      mobile: "+91 98222 33344",
      email: "priya.patil@example.com",
      gender: "Female",
      dob: "22 Aug 1994",
      lastVisit: "01 Aug 2026",
      upcomingAppointment: "Today at 11:00 AM",
      status: "Confirmed"
    },
    {
      id: "AIQ-P103",
      name: "Neha Gupta",
      mobile: "+91 98333 44455",
      email: "neha.gupta@example.com",
      gender: "Female",
      dob: "05 Nov 1998",
      lastVisit: "10 May 2026",
      upcomingAppointment: "Today (Token #26)",
      status: "Waiting in OPD"
    }
  ],

  tokens: [
    { token: "#22", patient: "Vikas Verma", doctor: "Dr. Rahul Mehta", status: "Completed", waitTime: "18 min" },
    { token: "#23", patient: "Sunita Rao", doctor: "Dr. Rahul Mehta", status: "Completed", waitTime: "14 min" },
    { token: "#24", patient: "Rahul Sharma", doctor: "Dr. Rahul Mehta", status: "Serving", waitTime: "Currently In Consultation" },
    { token: "#25", patient: "Priya Patil", doctor: "Dr. Anjali Sharma", status: "Waiting", waitTime: "12 min" },
    { token: "#26", patient: "Neha Gupta", doctor: "Dr. Anjali Sharma", status: "Waiting", waitTime: "18 min" },
    { token: "#27", patient: "Nisha Sharma", doctor: "Dr. Anjali Sharma", status: "Confirmed", waitTime: "Scheduled 4:00 PM" }
  ],

  visits: [
    {
      id: "VST-901",
      patient: "Vikas Verma",
      patientId: "AIQ-P088",
      doctor: "Dr. Rahul Mehta",
      token: "#22",
      arrivalTime: "09:45 AM",
      consultationStatus: "Completed",
      visitStatus: "Discharged"
    },
    {
      id: "VST-902",
      patient: "Sunita Rao",
      patientId: "AIQ-P092",
      doctor: "Dr. Rahul Mehta",
      token: "#23",
      arrivalTime: "10:10 AM",
      consultationStatus: "Completed",
      visitStatus: "Discharged"
    },
    {
      id: "VST-903",
      patient: "Rahul Sharma",
      patientId: "AIQ-P101",
      doctor: "Dr. Rahul Mehta",
      token: "#24",
      arrivalTime: "10:20 AM",
      consultationStatus: "In Progress",
      visitStatus: "Checked-in"
    }
  ],

  notifications: [
    {
      id: 1,
      title: "Queue Alert",
      message: "Dr. Rahul Mehta's queue currently has 18 waiting patients.",
      time: "5 min ago",
      type: "queue"
    },
    {
      id: 2,
      title: "Wait Time Warning",
      message: "Token #27 patient requested travel time calculation.",
      time: "15 min ago",
      type: "system"
    },
    {
      id: 3,
      title: "Appointment Update",
      message: "Online booking confirmed for Priya Patil at 11:00 AM.",
      time: "30 min ago",
      type: "appointment"
    }
  ]
};
