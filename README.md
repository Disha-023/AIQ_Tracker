# AIQ Tracker - Smart Hospital Appointment & Queue Management System

AIQ Tracker is a smart hospital appointment and queue management application featuring AI-driven waiting time estimations, walk-in token generation, and multi-portal role access for Patients, Receptionists, and Administrators.

## Project Structure

```
AIQ-Tracker/
│
├── client/          # React + Vite Frontend Application
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── context/
│   │   ├── data/
│   │   └── utils/
│   ├── public/
│   ├── vite.config.js
│   └── package.json
│
├── server/          # Express.js Backend Foundation
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── services/
│   ├── utils/
│   ├── config/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## Running the Application

### 1. Frontend (React / Vite)

```bash
cd client
npm install
npm run dev
```

The frontend will run locally on `http://localhost:5173/`.

### 2. Backend (Node / Express)

```bash
cd server
npm install
npm run dev
```

The backend server will run locally on `http://localhost:5000/`.

Health Check Endpoint:
`GET http://localhost:5000/api/health`
