// Admin Hospital Administration Mock Dataset for AIQ Tracker

export const adminMockData = {
  admin: {
    name: "Dr. Robert Vance",
    staffId: "ADM001",
    email: "admin@aiqtracker.com",
    mobile: "+91 98765 43212",
    department: "Hospital Administration",
    hospital: "AIQ Super Specialty Hospital",
    role: "Administrator"
  },

  stats: {
    totalStaff: 24,
    activeDoctors: 12,
    totalPatients: 1480,
    todaysAppointments: 42,
    queueEfficiency: "94%",
    avgWaitMin: "14 min"
  },

  staffMembers: [
    {
      id: "REC001",
      name: "Sarah Jenkins",
      role: "Receptionist",
      department: "OPD Front Desk",
      email: "receptionist@aiqtracker.com",
      status: "Active"
    },
    {
      id: "REC002",
      name: "Amit Deshmukh",
      role: "Receptionist",
      department: "Emergency Desk",
      email: "amit.rec@aiqtracker.com",
      status: "Active"
    },
    {
      id: "NRS001",
      name: "Pooja Patil",
      role: "Head Nurse",
      department: "OPD Ward 2",
      email: "pooja.nrs@aiqtracker.com",
      status: "Active"
    }
  ],

  doctors: [
    {
      id: "DOC001",
      name: "Dr. Rahul Mehta",
      specialization: "General Physician",
      room: "OPD Room 202",
      patientsToday: 18,
      status: "Active in OPD"
    },
    {
      id: "DOC002",
      name: "Dr. Anjali Sharma",
      specialization: "Cardiologist",
      room: "OPD Room 104",
      patientsToday: 14,
      status: "Active in OPD"
    },
    {
      id: "DOC003",
      name: "Dr. Vikram Shah",
      specialization: "Pediatrician",
      room: "OPD Room 305",
      patientsToday: 10,
      status: "On Break"
    }
  ],

  notifications: [
    {
      id: 1,
      title: "System Audit Log",
      message: "New receptionist account REC001 accessed front desk portal.",
      time: "10 min ago",
      type: "audit"
    },
    {
      id: 2,
      title: "Queue Efficiency Peak",
      message: "Average OPD wait time decreased by 18% during peak morning hours.",
      time: "1 hour ago",
      type: "analytics"
    }
  ]
};
