import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'aiq_tracker_auth_user';
const REGISTERED_USERS_KEY = 'aiq_tracker_registered_users';

// Development Mock Accounts with Strict Roles & Account Statuses
const MOCK_ACCOUNTS = [
  {
    id: 'PAT001',
    email: 'patient@example.com',
    mobile: '9876543210',
    name: 'Nisha Sharma',
    role: 'patient',
    status: 'active',
    password: 'patient123'
  },
  {
    id: 'REC001',
    email: 'receptionist@aiqtracker.com',
    mobile: '9876543211',
    name: 'Sarah Jenkins',
    role: 'receptionist',
    status: 'active',
    password: 'reception123'
  },
  {
    id: 'ADM001',
    email: 'admin@aiqtracker.com',
    mobile: '9876543212',
    name: 'Dr. Robert Vance',
    role: 'admin',
    status: 'active',
    password: 'admin123'
  },
  {
    id: 'REC003',
    email: 'inactive@aiqtracker.com',
    mobile: '9876543299',
    name: 'Inactive Staff User',
    role: 'receptionist',
    status: 'inactive',
    password: 'reception123'
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [pendingStaffMfa, setPendingStaffMfa] = useState(null);
  const [failedAttempts, setFailedAttempts] = useState(0);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (err) {
      console.error('Failed to save auth state to localStorage', err);
    }
  }, [user]);

  const getRegisteredUsers = () => {
    try {
      const stored = localStorage.getItem(REGISTERED_USERS_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error('Failed to read registered users from localStorage', err);
      return [];
    }
  };

  /**
   * Account-driven Login (Role comes strictly from authenticated record)
   */
  const login = async (identifier = '', password = '') => {
    const trimmed = identifier ? String(identifier).trim().toLowerCase() : '';

    if (!trimmed || !password) {
      return { success: false, message: 'Please enter both your email/mobile and password.' };
    }

    const registeredUsers = getRegisteredUsers();

    const matchesUser = (u) => {
      if (!u) return false;
      const uEmail = u.email ? String(u.email).trim().toLowerCase() : '';
      const uId = u.id ? String(u.id).trim().toLowerCase() : '';
      const uStaffId = u.staff_id ? String(u.staff_id).trim().toLowerCase() : '';
      const uMobile = u.mobile ? String(u.mobile).trim() : '';

      return uEmail === trimmed || uId === trimmed || uStaffId === trimmed || uMobile === trimmed;
    };

    let matchedAccount = registeredUsers.find(matchesUser);

    if (!matchedAccount) {
      matchedAccount = MOCK_ACCOUNTS.find(matchesUser);
    }

    if (!matchedAccount) {
      return { success: false, message: 'Invalid credentials. Please check your details and try again.' };
    }

    if (matchedAccount.password && matchedAccount.password !== password) {
      return { success: false, message: 'Invalid credentials. Please check your details and try again.' };
    }

    if (matchedAccount.status && matchedAccount.status !== 'active') {
      return { success: false, message: 'Account is inactive. Please contact Hospital Administration.' };
    }

    let patientId = matchedAccount.id;
    let patientName = matchedAccount.name;
    let patientMobile = matchedAccount.mobile;
    let patientEmail = matchedAccount.email;

    if (matchedAccount.role === 'patient') {
      try {
        const res = await fetch('http://localhost:5000/api/patients');
        const json = await res.json();
        if (res.ok && json.data) {
          const dbPatients = json.data;
          const match = dbPatients.find(p => 
            (p.email && p.email.trim().toLowerCase() === patientEmail.trim().toLowerCase()) ||
            (p.mobile && p.mobile.trim() === patientMobile.trim())
          );
          if (match) {
            patientId = match.patient_id;
            patientName = match.name;
            patientMobile = match.mobile;
            patientEmail = match.email || patientEmail;
          } else {
            // Not found in DB, create it in DB
            const createRes = await fetch('http://localhost:5000/api/patients', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: patientName,
                email: patientEmail,
                mobile: patientMobile,
                age: 25,
                gender: 'Male'
              })
            });
            const createJson = await createRes.json();
            if (createRes.ok && createJson.data) {
              patientId = createJson.data.patient_id;
            }
          }
        }
      } catch (err) {
        console.error('Failed to map patient to database:', err);
      }
    }

    const userData = {
      id: patientId,
      name: patientName,
      email: patientEmail,
      mobile: patientMobile,
      role: matchedAccount.role || 'patient',
      status: matchedAccount.status || 'active',
      loggedInAt: new Date().toISOString()
    };

    setUser(userData);
    return { success: true, user: userData };
  };

  /**
   * Direct Staff Login Verification
   */
  const loginStaff = (identifier = '', password = '') => {
    const res = login(identifier, password);
    if (!res.success) return res;

    if (res.user.role === 'patient') {
      setUser(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return { success: false, message: 'Patient accounts cannot log in through the Staff Portal.' };
    }

    if (res.user.status && res.user.status !== 'active') {
      setUser(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return { success: false, message: 'Account is inactive. Please contact Hospital Administration.' };
    }

    return res;
  };

  /**
   * Direct Admin Login Verification
   */
  const loginAdmin = (identifier = '', password = '') => {
    const res = login(identifier, password);
    if (!res.success) return res;

    if (res.user.role !== 'admin') {
      setUser(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return { success: false, message: 'Access denied. Dedicated to authorized hospital administrators only.' };
    }

    if (res.user.status && res.user.status !== 'active') {
      setUser(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return { success: false, message: 'Account is inactive. Please contact Hospital Administration.' };
    }

    return res;
  };

  /**
   * Step 1: Initiate Staff Login & Verify Credentials (MFA Trigger)
   */
  const initiateStaffLogin = (identifier = '', password = '') => {
    if (failedAttempts >= 5) {
      return {
        success: false,
        message: 'Too many unsuccessful attempts. Please try again later.'
      };
    }

    const res = loginStaff(identifier, password);
    if (!res.success) {
      setFailedAttempts((prev) => prev + 1);
      return res;
    }

    setFailedAttempts(0);
    setPendingStaffMfa(res.user);
    return { success: true, requiresMfa: true, user: res.user };
  };

  /**
   * Step 2: Verify Staff 6-Digit OTP
   */
  const verifyStaffOtp = (otpCode = '') => {
    if (!pendingStaffMfa) {
      return { success: false, message: 'No pending staff login session found.' };
    }

    if (otpCode.trim() !== '123456') {
      return { success: false, message: 'Invalid verification code.' };
    }

    const fullStaffUser = {
      ...pendingStaffMfa,
      loggedInAt: new Date().toISOString()
    };

    setUser(fullStaffUser);
    setPendingStaffMfa(null);
    return { success: true, user: fullStaffUser };
  };

  const logout = () => {
    setUser(null);
    setPendingStaffMfa(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  /**
   * Register Patient (Creates PostgreSQL record and local fallback credentials)
   */
  const registerPatient = async (patientData) => {
    const cleanEmail = patientData.email ? String(patientData.email).trim().toLowerCase() : '';
    const cleanMobile = patientData.mobileNumber ? String(patientData.mobileNumber).trim() : '';
    const cleanName = patientData.fullName ? String(patientData.fullName).trim() : 'Patient User';
    const cleanPassword = patientData.password ? String(patientData.password) : '';

    if (!cleanEmail && !cleanMobile) {
      return { success: false, message: 'An email address or mobile number is required to register.' };
    }

    let dbPatientId = `PAT-${Math.floor(1000 + Math.random() * 9000)}`;
    try {
      const res = await fetch('http://localhost:5000/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          mobile: cleanMobile,
          age: patientData.age ? parseInt(patientData.age, 10) : 25,
          gender: patientData.gender || 'Male'
        })
      });
      const json = await res.json();
      if (res.ok && json.data) {
        dbPatientId = json.data.patient_id;
      }
    } catch (err) {
      console.error('Failed to save patient to PostgreSQL:', err);
    }

    const newPatientUser = {
      id: dbPatientId,
      name: cleanName,
      email: cleanEmail,
      mobile: cleanMobile,
      password: cleanPassword,
      role: 'patient',
      status: 'active',
      createdAt: new Date().toISOString()
    };

    const users = getRegisteredUsers();

    // Prevent duplicate entries by checking existing email or mobile
    const existingIndex = users.findIndex((u) => {
      if (!u) return false;
      const uEmail = u.email ? String(u.email).trim().toLowerCase() : '';
      const uMobile = u.mobile ? String(u.mobile).trim() : '';
      return (cleanEmail && uEmail === cleanEmail) || (cleanMobile && uMobile === cleanMobile);
    });

    if (existingIndex >= 0) {
      users[existingIndex] = newPatientUser;
    } else {
      users.push(newPatientUser);
    }

    try {
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
    } catch (err) {
      console.error('Failed to save registered user to localStorage', err);
    }

    return {
      success: true,
      data: newPatientUser
    };
  };

  const updateUser = (userData) => {
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        ...userData
      };
    });
  };

  const value = {
    user,
    role: user?.role || null,
    isAuthenticated: !!user,
    pendingStaffMfa,
    login,
    loginStaff,
    loginAdmin,
    initiateStaffLogin,
    verifyStaffOtp,
    logout,
    registerPatient,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
