// Comprehensive Hospital Administration Mock Dataset for AIQ Tracker

export const adminMockData = {
  admin: {
    name: "Dr. Robert Vance",
    staffId: "ADM001",
    email: "admin@aiqtracker.com",
    mobile: "+91 98765 43212",
    department: "Hospital Administration",
    hospital: "AIQ Super Specialty Hospital",
    role: "Administrator",
    lastLogin: "Today at 08:30 AM"
  },

  stats: {
    totalPatients: 1248,
    todaysAppointments: 86,
    activeDoctors: 24,
    activeReceptionists: 8,
    patientsWaiting: 18,
    completedToday: 52,
    queueEfficiency: "96%",
    avgWaitMin: "12 min"
  },

  doctors: [
    {
      id: "DOC001",
      name: "Dr. Rahul Mehta",
      specialization: "General Physician",
      department: "General Medicine",
      room: "OPD Room 202",
      experience: "12 years",
      availability: "Available",
      patientsToday: 18,
      status: "Active"
    },
    {
      id: "DOC002",
      name: "Dr. Anjali Sharma",
      specialization: "Cardiologist",
      department: "Cardiology",
      room: "OPD Room 104",
      experience: "15 years",
      availability: "Available",
      patientsToday: 14,
      status: "Active"
    },
    {
      id: "DOC003",
      name: "Dr. Vikram Shah",
      specialization: "Pediatrician",
      department: "Pediatrics",
      room: "OPD Room 305",
      experience: "8 years",
      availability: "On Break",
      patientsToday: 10,
      status: "Active"
    },
    {
      id: "DOC004",
      name: "Dr. Priya Nair",
      specialization: "Orthopedic Surgeon",
      department: "Orthopedics",
      room: "OPD Room 108",
      experience: "10 years",
      availability: "Available",
      patientsToday: 16,
      status: "Active"
    },
    {
      id: "DOC005",
      name: "Dr. Rajesh Gupta",
      specialization: "Dermatologist",
      department: "Dermatology",
      room: "OPD Room 210",
      experience: "14 years",
      availability: "Unavailable",
      patientsToday: 0,
      status: "On Leave"
    }
  ],

  staffMembers: [
    {
      id: "REC001",
      name: "Sarah Jenkins",
      employeeId: "EMP-901",
      email: "receptionist@aiqtracker.com",
      department: "OPD Front Desk",
      role: "Receptionist",
      status: "Active",
      lastLogin: "Today at 08:15 AM"
    },
    {
      id: "REC002",
      name: "Amit Deshmukh",
      employeeId: "EMP-902",
      email: "amit.rec@aiqtracker.com",
      department: "Emergency Front Desk",
      role: "Receptionist",
      status: "Active",
      lastLogin: "Today at 07:45 AM"
    },
    {
      id: "REC003",
      name: "Meera Kulkarni",
      employeeId: "EMP-903",
      email: "meera.k@aiqtracker.com",
      department: "Pediatrics Desk",
      role: "Receptionist",
      status: "Active",
      lastLogin: "Yesterday at 04:30 PM"
    },
    {
      id: "NRS001",
      name: "Pooja Patil",
      employeeId: "EMP-801",
      email: "pooja.nrs@aiqtracker.com",
      department: "OPD Ward 2",
      role: "Head Nurse",
      status: "Active",
      lastLogin: "Today at 08:00 AM"
    }
  ],

  patients: [
    {
      id: "AIQ-P8942",
      name: "Nisha Sharma",
      age: 29,
      gender: "Female",
      mobile: "+91 98765 43210",
      email: "nisha.sharma@example.com",
      lastVisit: "28 July 2026",
      status: "Active"
    },
    {
      id: "AIQ-P101",
      name: "Rahul Sharma",
      age: 36,
      gender: "Male",
      mobile: "+91 98111 22233",
      email: "rahul.sharma@example.com",
      lastVisit: "15 June 2026",
      status: "In OPD Queue"
    },
    {
      id: "AIQ-P102",
      name: "Priya Patil",
      age: 31,
      gender: "Female",
      mobile: "+91 98222 33344",
      email: "priya.patil@example.com",
      lastVisit: "01 Aug 2026",
      status: "Confirmed"
    },
    {
      id: "AIQ-P103",
      name: "Neha Gupta",
      age: 27,
      gender: "Female",
      mobile: "+91 98333 44455",
      email: "neha.gupta@example.com",
      lastVisit: "10 May 2026",
      status: "In OPD Queue"
    },
    {
      id: "AIQ-P104",
      name: "Suresh Kumar",
      age: 45,
      gender: "Male",
      mobile: "+91 98444 55566",
      email: "suresh.k@example.com",
      lastVisit: "12 Aug 2026",
      status: "Active"
    }
  ],

  appointments: [
    {
      id: "APT-801",
      patient: "Rahul Sharma",
      doctor: "Dr. Rahul Mehta",
      department: "General Medicine",
      date: "2026-08-15",
      time: "10:30 AM",
      status: "Completed"
    },
    {
      id: "APT-802",
      patient: "Priya Patil",
      doctor: "Dr. Anjali Sharma",
      department: "Cardiology",
      date: "2026-08-15",
      time: "11:00 AM",
      status: "In Progress"
    },
    {
      id: "APT-803",
      patient: "Neha Gupta",
      doctor: "Dr. Anjali Sharma",
      department: "Cardiology",
      date: "2026-08-15",
      time: "11:30 AM",
      status: "Waiting"
    },
    {
      id: "APT-804",
      patient: "Nisha Sharma",
      doctor: "Dr. Rahul Mehta",
      department: "General Medicine",
      date: "2026-08-15",
      time: "04:00 PM",
      status: "Upcoming"
    },
    {
      id: "APT-805",
      patient: "Vikram Malhotra",
      doctor: "Dr. Vikram Shah",
      department: "Pediatrics",
      date: "2026-08-15",
      time: "02:00 PM",
      status: "Cancelled"
    }
  ],

  departments: [
    {
      id: "DEP-01",
      name: "General Medicine",
      assignedDoctors: 6,
      room: "OPD Rooms 201-205",
      queueStatus: "Normal Flow",
      status: "Active"
    },
    {
      id: "DEP-02",
      name: "Cardiology",
      assignedDoctors: 4,
      room: "OPD Rooms 101-105",
      queueStatus: "High Volume",
      status: "Active"
    },
    {
      id: "DEP-03",
      name: "Orthopedics",
      assignedDoctors: 5,
      room: "OPD Rooms 106-110",
      queueStatus: "Normal Flow",
      status: "Active"
    },
    {
      id: "DEP-04",
      name: "Dermatology",
      assignedDoctors: 3,
      room: "OPD Rooms 208-210",
      queueStatus: "Low Volume",
      status: "Active"
    },
    {
      id: "DEP-05",
      name: "ENT & Ophthalmic",
      assignedDoctors: 4,
      room: "OPD Rooms 301-304",
      queueStatus: "Normal Flow",
      status: "Active"
    }
  ],

  queues: [
    {
      department: "General Medicine",
      doctor: "Dr. Rahul Mehta",
      currentToken: "#24",
      patientsWaiting: 18,
      avgWaitTime: "12 min",
      status: "Active"
    },
    {
      department: "Cardiology",
      doctor: "Dr. Anjali Sharma",
      currentToken: "#15",
      patientsWaiting: 12,
      avgWaitTime: "18 min",
      status: "Active"
    },
    {
      department: "Pediatrics",
      doctor: "Dr. Vikram Shah",
      currentToken: "#09",
      patientsWaiting: 5,
      avgWaitTime: "8 min",
      status: "Paused"
    },
    {
      department: "Orthopedics",
      doctor: "Dr. Priya Nair",
      currentToken: "#19",
      patientsWaiting: 14,
      avgWaitTime: "15 min",
      status: "Active"
    }
  ],

  reports: {
    dailyPatients: [45, 52, 60, 58, 65, 86],
    weeklyAppointments: 420,
    completionRate: "92%",
    cancellationRate: "4%",
    avgWaitTimeTrend: "12 mins (Down by 3 mins)",
    doctorStats: [
      { name: "Dr. Rahul Mehta", consultations: 142, avgDuration: "7 min" },
      { name: "Dr. Anjali Sharma", consultations: 118, avgDuration: "10 min" },
      { name: "Dr. Priya Nair", consultations: 96, avgDuration: "9 min" },
      { name: "Dr. Vikram Shah", consultations: 84, avgDuration: "6 min" }
    ],
    departmentStats: [
      { department: "General Medicine", percentage: 38 },
      { department: "Cardiology", percentage: 26 },
      { department: "Orthopedics", percentage: 20 },
      { department: "Pediatrics", percentage: 16 }
    ]
  },

  auditLogs: [
    {
      id: "LOG-501",
      dateTime: "2026-08-15 08:30:12",
      user: "Dr. Robert Vance (ADM001)",
      role: "Admin",
      action: "Admin system login",
      module: "Authentication"
    },
    {
      id: "LOG-502",
      dateTime: "2026-08-15 08:15:45",
      user: "Sarah Jenkins (REC001)",
      role: "Receptionist",
      action: "Staff portal login",
      module: "Authentication"
    },
    {
      id: "LOG-503",
      dateTime: "2026-08-15 07:50:00",
      user: "Dr. Robert Vance (ADM001)",
      role: "Admin",
      action: "Updated OPD Room 202 doctor assignment",
      module: "Doctor Management"
    },
    {
      id: "LOG-504",
      dateTime: "2026-08-14 16:40:22",
      user: "Dr. Robert Vance (ADM001)",
      role: "Admin",
      action: "Activated staff account REC003",
      module: "Staff Management"
    }
  ],

  notifications: [
    {
      id: 1,
      title: "Queue Congestion Alert",
      message: "Cardiology OPD queue waiting count exceeded 10 patients.",
      time: "15 min ago",
      type: "warning"
    },
    {
      id: 2,
      title: "Doctor Schedule Update",
      message: "Dr. Rajesh Gupta marked as On Leave for today.",
      time: "1 hour ago",
      type: "info"
    },
    {
      id: 3,
      title: "System Audit Alert",
      message: "New receptionist account REC001 accessed front desk portal.",
      time: "2 hours ago",
      type: "security"
    }
  ],

  settings: {
    hospitalName: "AIQ Super Specialty Hospital",
    address: "Central Healthcare Hub, City Center",
    contactEmail: "admin@aiqtracker.com",
    contactPhone: "+91 98765 43212",
    opdStartTime: "08:00 AM",
    opdEndTime: "08:00 PM",
    tokenPrefix: "OPD-",
    autoAssignTokens: true,
    emailNotifications: true,
    smsAlerts: true
  }
};
