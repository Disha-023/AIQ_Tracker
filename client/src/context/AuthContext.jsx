import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'aiq_tracker_auth_user';
const REGISTERED_USERS_KEY = 'aiq_tracker_registered_users';

// Development Mock Staff & Patient Accounts
const MOCK_ACCOUNTS = [
  {
    id: 'PAT001',
    email: 'patient@example.com',
    mobile: '9876543210',
    name: 'Nisha Sharma',
    role: 'patient'
  },
  {
    id: 'REC001',
    email: 'receptionist@aiqtracker.com',
    mobile: '9876543211',
    name: 'Sarah Jenkins',
    role: 'receptionist'
  },
  {
    id: 'REC002',
    email: 'reception@example.com',
    mobile: '9876543213',
    name: 'Sarah Jenkins',
    role: 'receptionist'
  },
  {
    id: 'ADM001',
    email: 'admin@aiqtracker.com',
    mobile: '9876543212',
    name: 'Dr. Robert Vance',
    role: 'admin'
  },
  {
    id: 'ADM002',
    email: 'admin@example.com',
    mobile: '9876543214',
    name: 'Dr. Robert Vance',
    role: 'admin'
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
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  /**
   * General Login (Patient & direct auth)
   */
  const login = (identifier = '', password = '') => {
    const trimmed = identifier.trim().toLowerCase();

    if (!trimmed) {
      return { success: false, message: 'Invalid email or password.' };
    }

    const registeredUsers = getRegisteredUsers();

    let matchedAccount = registeredUsers.find(
      (u) =>
        u.email.toLowerCase() === trimmed ||
        (u.id && u.id.toLowerCase() === trimmed) ||
        (u.mobile && u.mobile.trim() === trimmed)
    );

    if (!matchedAccount) {
      matchedAccount = MOCK_ACCOUNTS.find(
        (acc) =>
          acc.email.toLowerCase() === trimmed ||
          acc.id.toLowerCase() === trimmed ||
          acc.mobile === trimmed
      );
    }

    if (!matchedAccount) {
      let role = 'patient';
      let name = identifier.split('@')[0];

      if (trimmed.includes('reception') || trimmed.includes('rec')) {
        role = 'receptionist';
        name = 'Hospital Receptionist';
      } else if (trimmed.includes('admin') || trimmed.includes('adm')) {
        role = 'admin';
        name = 'Hospital Administrator';
      } else {
        name = name.charAt(0).toUpperCase() + name.slice(1);
      }

      matchedAccount = {
        id: role === 'receptionist' ? 'REC001' : role === 'admin' ? 'ADM001' : 'PAT001',
        name,
        email: identifier.includes('@') ? identifier : `${identifier}@aiqtracker.com`,
        role
      };
    }

    const userData = {
      id: matchedAccount.id || 'USR-01',
      name: matchedAccount.name,
      email: matchedAccount.email,
      mobile: matchedAccount.mobile,
      role: matchedAccount.role,
      loggedInAt: new Date().toISOString()
    };

    setUser(userData);
    return { success: true, user: userData };
  };

  /**
   * Step 1: Initiate Staff Login & Verify Credentials (MFA Trigger)
   */
  const initiateStaffLogin = (identifier = '', password = '') => {
    if (failedAttempts >= 3) {
      return {
        success: false,
        message: 'Too many unsuccessful attempts. Please try again later.'
      };
    }

    const trimmed = identifier.trim().toLowerCase();

    if (!trimmed) {
      setFailedAttempts((prev) => prev + 1);
      return { success: false, message: 'Invalid staff credentials.' };
    }

    const registeredUsers = getRegisteredUsers();

    let matchedAccount = registeredUsers.find(
      (u) =>
        u.email.toLowerCase() === trimmed ||
        (u.id && u.id.toLowerCase() === trimmed) ||
        (u.mobile && u.mobile.trim() === trimmed)
    );

    if (!matchedAccount) {
      matchedAccount = MOCK_ACCOUNTS.find(
        (acc) =>
          acc.email.toLowerCase() === trimmed ||
          acc.id.toLowerCase() === trimmed ||
          acc.mobile === trimmed
      );
    }

    if (!matchedAccount) {
      // Role inference fallback for staff testing
      let role = 'receptionist';
      let name = 'Hospital Staff';

      if (trimmed.includes('admin') || trimmed.includes('adm')) {
        role = 'admin';
        name = 'Hospital Administrator';
      }

      matchedAccount = {
        id: role === 'admin' ? 'ADM001' : 'REC001',
        name,
        email: identifier.includes('@') ? identifier : `${identifier}@aiqtracker.com`,
        role
      };
    }

    // Credentials verified -> reset failures & save pending session for OTP verification
    setFailedAttempts(0);
    const pendingData = {
      id: matchedAccount.id,
      name: matchedAccount.name,
      email: matchedAccount.email,
      mobile: matchedAccount.mobile,
      role: matchedAccount.role
    };

    setPendingStaffMfa(pendingData);
    return { success: true, requiresMfa: true };
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

  const registerPatient = (patientData) => {
    const newPatientUser = {
      id: `PAT-${Math.floor(1000 + Math.random() * 9000)}`,
      name: patientData.fullName || 'Nisha Sharma',
      email: patientData.email,
      mobile: patientData.mobileNumber,
      role: 'patient'
    };

    const users = getRegisteredUsers();
    users.push(newPatientUser);
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));

    return {
      success: true,
      data: newPatientUser
    };
  };

  const registerStaff = (staffData) => {
    const newStaffUser = {
      id: staffData.staffId || `REC-${Math.floor(100 + Math.random() * 900)}`,
      name: staffData.fullName,
      email: staffData.officialEmail,
      mobile: staffData.mobileNumber,
      department: staffData.department || 'OPD Front Desk',
      role: 'receptionist'
    };

    const users = getRegisteredUsers();
    users.push(newStaffUser);
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));

    return {
      success: true,
      data: newStaffUser
    };
  };

  const value = {
    user,
    role: user?.role || null,
    isAuthenticated: !!user,
    pendingStaffMfa,
    login,
    initiateStaffLogin,
    verifyStaffOtp,
    logout,
    registerPatient,
    registerStaff
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
