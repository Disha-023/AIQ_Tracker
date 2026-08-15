// Centralized Doctor Mock Dataset for AIQ Tracker

export const doctorsMockData = [
  {
    id: "DOC-1",
    name: "Dr. Anjali Sharma",
    specialization: "General Physician",
    availability: "Available Today",
    isAvailableToday: true,
    room: "OPD Room 104",
    experience: "12+ Years",
    rating: "4.9",
    currentToken: "#22",
    patientsWaiting: 5,
    estimatedWaitMinutes: 40,
    timeSlots: [
      { time: "10:00 AM", status: "Available" },
      { time: "10:30 AM", status: "Available" },
      { time: "11:00 AM", status: "Few Slots" },
      { time: "11:30 AM", status: "Unavailable" },
      { time: "04:00 PM", status: "Available" },
      { time: "04:30 PM", status: "Available" }
    ]
  },
  {
    id: "DOC-2",
    name: "Dr. Rahul Mehta",
    specialization: "Cardiologist",
    availability: "Available Today",
    isAvailableToday: true,
    room: "OPD Room 202",
    experience: "15+ Years",
    rating: "4.8",
    currentToken: "#14",
    patientsWaiting: 3,
    estimatedWaitMinutes: 25,
    timeSlots: [
      { time: "10:00 AM", status: "Available" },
      { time: "11:00 AM", status: "Available" },
      { time: "02:00 PM", status: "Few Slots" },
      { time: "03:30 PM", status: "Available" },
      { time: "05:00 PM", status: "Unavailable" }
    ]
  },
  {
    id: "DOC-3",
    name: "Dr. Priya Deshmukh",
    specialization: "Dermatologist",
    availability: "Available Tomorrow",
    isAvailableToday: false,
    room: "OPD Room 305",
    experience: "9+ Years",
    rating: "4.7",
    currentToken: "#08",
    patientsWaiting: 6,
    estimatedWaitMinutes: 50,
    timeSlots: [
      { time: "09:30 AM", status: "Available" },
      { time: "10:30 AM", status: "Available" },
      { time: "12:00 PM", status: "Available" },
      { time: "04:00 PM", status: "Few Slots" }
    ]
  }
];
