const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool, mockUserStore } = require('../config/db');
const { JWT_SECRET } = require('../middleware/authMiddleware');

const SALT_ROUNDS = 10;

/**
 * Hash plain text password securely using bcryptjs
 */
async function hashPassword(plainPassword) {
  return await bcrypt.hash(plainPassword, SALT_ROUNDS);
}

/**
 * Compare plain text password against bcrypt hash
 */
async function comparePassword(plainPassword, passwordHash) {
  return await bcrypt.compare(plainPassword, passwordHash);
}

/**
 * Generate signed JWT token
 */
function generateToken(user) {
  const payload = {
    id: user.id,
    staff_id: user.staff_id || null,
    email: user.email,
    name: user.name,
    role: user.role
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

/**
 * Find user by email, staff_id, or mobile number
 */
async function findUserByIdentifier(identifier) {
  const trimmed = identifier.trim().toLowerCase();

  // 1. Try PostgreSQL pool if connected
  try {
    const queryText = `
      SELECT * FROM users
      WHERE LOWER(email) = $1
         OR LOWER(staff_id) = $1
         OR mobile = $1
      LIMIT 1
    `;
    const res = await pool.query(queryText, [trimmed]);
    if (res.rows.length > 0) {
      return res.rows[0];
    }
  } catch (err) {
    // DB query fallback to mockUserStore if PostgreSQL pool is not active
  }

  // 2. Fallback to mockUserStore
  const matched = mockUserStore.find(
    (u) =>
      (u.email && u.email.trim().toLowerCase() === trimmed) ||
      (u.staff_id && u.staff_id.trim().toLowerCase() === trimmed) ||
      (u.id && u.id.trim().toLowerCase() === trimmed) ||
      (u.mobile && u.mobile.trim() === trimmed)
  );

  return matched || null;
}

/**
 * Create new Patient User Record
 */
async function createPatientUser({ fullName, email, mobileNumber, password }) {
  const passwordHash = await hashPassword(password);
  const newId = `PAT-${Math.floor(1000 + Math.random() * 9000)}`;

  const newUser = {
    id: newId,
    staff_id: null,
    name: fullName,
    email,
    mobile: mobileNumber,
    department: null,
    password_hash: passwordHash,
    role: 'patient',
    status: 'active',
    mfa_enabled: false,
    created_at: new Date(),
    last_login: null
  };

  mockUserStore.push(newUser);
  return newUser;
}

/**
 * Create new Staff User Record (Authorized Staff)
 */
async function createStaffUser({ staffId, fullName, officialEmail, mobileNumber, department, staffRole, password }) {
  const passwordHash = await hashPassword(password);
  const newStaffId = staffId || `REC-${Math.floor(100 + Math.random() * 900)}`;

  const newStaff = {
    id: newStaffId,
    staff_id: newStaffId,
    name: fullName,
    email: officialEmail,
    mobile: mobileNumber,
    department: department || 'OPD Front Desk',
    password_hash: passwordHash,
    role: staffRole || 'receptionist',
    status: 'active',
    mfa_enabled: true,
    created_at: new Date(),
    last_login: null
  };

  mockUserStore.push(newStaff);
  return newStaff;
}

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  findUserByIdentifier,
  createPatientUser,
  createStaffUser
};
