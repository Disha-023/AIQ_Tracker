const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// Enforce configuration variables and check for placeholders
if (!process.env.PGPASSWORD) {
  throw new Error('Database configuration error: PGPASSWORD environment variable is not defined.');
}
if (!process.env.PGDATABASE) {
  throw new Error('Database configuration error: PGDATABASE environment variable is not defined.');
}

if (process.env.PGPASSWORD === 'your_password' || process.env.PGDATABASE === 'your_database_name') {
  console.warn('\n⚠️  WARNING: Database credentials in server/.env are still set to default placeholder values ("your_password" / "your_database_name").\nPlease edit server/.env with your actual database name and password.\n');
}



const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: parseInt(process.env.PGPORT || '5432', 10),
  ssl: {
    rejectUnauthorized: true
  },
  max: 10,
  idleTimeoutMillis: 30000
});



// Pre-hashed bcrypt passwords (salt = 10) for development fallback store
const PATIENT_HASH = bcrypt.hashSync('patient123', 10);
const RECEPTIONIST_HASH = bcrypt.hashSync('reception123', 10);
const ADMIN_HASH = bcrypt.hashSync('admin123', 10);

const mockUserStore = [
  {
    id: 'PAT001',
    staff_id: null,
    name: 'Nisha Sharma',
    email: 'patient@example.com',
    mobile: '9876543210',
    department: null,
    password_hash: PATIENT_HASH,
    role: 'patient',
    status: 'active',
    mfa_enabled: false,
    created_at: new Date(),
    last_login: null
  },
  {
    id: 'REC001',
    staff_id: 'REC001',
    name: 'Sarah Jenkins',
    email: 'receptionist@aiqtracker.com',
    mobile: '9876543211',
    department: 'OPD Front Desk',
    password_hash: RECEPTIONIST_HASH,
    role: 'receptionist',
    status: 'active',
    mfa_enabled: true,
    created_at: new Date(),
    last_login: null
  },
  {
    id: 'ADM001',
    staff_id: 'ADM001',
    name: 'Dr. Robert Vance',
    email: 'admin@aiqtracker.com',
    mobile: '9876543212',
    department: 'Hospital Administration',
    password_hash: ADMIN_HASH,
    role: 'admin',
    status: 'active',
    mfa_enabled: true,
    created_at: new Date(),
    last_login: null
  },
  {
    id: 'REC003',
    staff_id: 'REC003',
    name: 'Inactive Staff User',
    email: 'inactive@aiqtracker.com',
    mobile: '9876543299',
    department: 'OPD Front Desk',
    password_hash: RECEPTIONIST_HASH,
    role: 'receptionist',
    status: 'inactive',
    mfa_enabled: false,
    created_at: new Date(),
    last_login: null
  }
];

module.exports = {
  pool,
  mockUserStore
};
