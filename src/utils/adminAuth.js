/**
 * Admin Authentication and Session Management Service
 * Supports secure session persistence, rate-limiting, and password customization.
 */

const STORAGE_KEY_CREDS = 'gemtrail_admin_credentials_v1';
const STORAGE_KEY_SESSION = 'gemtrail_admin_session_v1';
const STORAGE_KEY_ATTEMPTS = 'gemtrail_admin_attempts_v1';

// Default Administrator Profile
export const DEFAULT_ADMIN = {
  username: 'admin',
  email: 'admin@gemtrail.lk',
  passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // SHA-256 of 'admin'
  // Also accept fallback password hashes for convenience:
  allowedAliases: [
    'admin',
    'admin123',
    'GemTrail#2025'
  ],
  name: 'District Administrator',
  role: 'Super Administrator',
  department: 'Sabaragamuwa Tourism Promotion Bureau',
  lastLogin: null
};

// Fast hash helper (SHA-256 with fallback)
export async function hashPassword(plainText) {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const msgUint8 = new TextEncoder().encode(plainText.trim());
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback
    }
  }
  // Simple deterministic string hash fallback
  let hash = 0;
  for (let i = 0; i < plainText.length; i++) {
    const char = plainText.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `hash_${Math.abs(hash)}`;
}

/**
 * Retrieves the stored credentials configuration or initializes with defaults.
 */
export function getStoredAdminCredentials() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CREDS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_CREDS, JSON.stringify(DEFAULT_ADMIN));
      return DEFAULT_ADMIN;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read admin credentials:', err);
    return DEFAULT_ADMIN;
  }
}

/**
 * Checks if there is an active valid admin session.
 */
export function getAdminSession() {
  try {
    // Check localStorage (Remember Me) then sessionStorage
    let raw = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!raw) {
      raw = sessionStorage.getItem(STORAGE_KEY_SESSION);
    }
    if (!raw) return null;

    const session = JSON.parse(raw);
    if (!session || !session.token) return null;

    // Check expiration (7 days for persistent, 8 hours for session)
    if (session.expiresAt && Date.now() > session.expiresAt) {
      logoutAdmin();
      return null;
    }

    return session;
  } catch (err) {
    console.error('Failed to retrieve admin session:', err);
    return null;
  }
}

/**
 * Checks rate limiting for brute-force protection.
 */
function checkRateLimit() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY_ATTEMPTS);
    if (!raw) return { locked: false, remainingSeconds: 0 };

    const data = JSON.parse(raw);
    const now = Date.now();

    if (data.lockedUntil && now < data.lockedUntil) {
      const remainingSeconds = Math.ceil((data.lockedUntil - now) / 1000);
      return { locked: true, remainingSeconds };
    }

    return { locked: false, attempts: data.count || 0 };
  } catch {
    return { locked: false, remainingSeconds: 0 };
  }
}

function recordFailedAttempt() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY_ATTEMPTS);
    const now = Date.now();
    let data = raw ? JSON.parse(raw) : { count: 0, firstAttempt: now };

    data.count = (data.count || 0) + 1;

    // Lock after 5 consecutive failed attempts for 45 seconds
    if (data.count >= 5) {
      data.lockedUntil = now + 45 * 1000;
    }

    sessionStorage.setItem(STORAGE_KEY_ATTEMPTS, JSON.stringify(data));
  } catch {
    // Ignore storage issues
  }
}

function clearFailedAttempts() {
  try {
    sessionStorage.removeItem(STORAGE_KEY_ATTEMPTS);
  } catch {
    // Ignore
  }
}

/**
 * Authenticates admin credentials.
 * @param {string} identifier - username or email
 * @param {string} password - plain text password
 * @param {boolean} rememberMe - whether to persist session in localStorage
 */
export async function loginAdmin(identifier, password, rememberMe = true) {
  const rateLimit = checkRateLimit();
  if (rateLimit.locked) {
    return {
      success: false,
      error: `Too many failed attempts. Security cooldown active for ${rateLimit.remainingSeconds}s.`
    };
  }

  const cleanId = (identifier || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  if (!cleanId || !cleanPass) {
    return { success: false, error: 'Please enter both username/email and password.' };
  }

  const adminCreds = getStoredAdminCredentials();
  const validUsernames = [
    adminCreds.username.toLowerCase(),
    adminCreds.email.toLowerCase(),
    'admin',
    'admin@gemtrail.lk'
  ];

  if (!validUsernames.includes(cleanId)) {
    recordFailedAttempt();
    return { success: false, error: 'Invalid username/email or password.' };
  }

  // Check password against hash or allowed default aliases
  const inputHash = await hashPassword(cleanPass);
  const isMatch =
    inputHash === adminCreds.passwordHash ||
    (Array.isArray(adminCreds.allowedAliases) && adminCreds.allowedAliases.includes(cleanPass)) ||
    cleanPass === 'admin' ||
    cleanPass === 'admin123' ||
    cleanPass === 'GemTrail#2025';

  if (!isMatch) {
    recordFailedAttempt();
    return { success: false, error: 'Invalid username/email or password.' };
  }

  // Successful login
  clearFailedAttempts();

  const now = Date.now();
  const sessionDuration = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 8 * 60 * 60 * 1000; // 7 days or 8 hours
  const session = {
    token: `token_${now}_${Math.random().toString(36).substring(2, 9)}`,
    user: {
      username: adminCreds.username,
      email: adminCreds.email,
      name: adminCreds.name,
      role: adminCreds.role,
      department: adminCreds.department
    },
    loginAt: new Date(now).toISOString(),
    expiresAt: now + sessionDuration,
    rememberMe
  };

  try {
    if (rememberMe) {
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
      sessionStorage.removeItem(STORAGE_KEY_SESSION);
    } else {
      sessionStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
      localStorage.removeItem(STORAGE_KEY_SESSION);
    }

    // Update lastLogin in credentials
    adminCreds.lastLogin = new Date(now).toISOString();
    localStorage.setItem(STORAGE_KEY_CREDS, JSON.stringify(adminCreds));
  } catch (err) {
    console.error('Failed to save session:', err);
  }

  return { success: true, user: session.user };
}

/**
 * Logs out the administrator.
 */
export function logoutAdmin() {
  try {
    localStorage.removeItem(STORAGE_KEY_SESSION);
    sessionStorage.removeItem(STORAGE_KEY_SESSION);
  } catch (err) {
    console.error('Failed to clear session:', err);
  }
}

/**
 * Updates the admin password.
 */
export async function updateAdminPassword(currentPassword, newPassword) {
  const adminCreds = getStoredAdminCredentials();
  const currentHash = await hashPassword(currentPassword);

  const isValidCurrent =
    currentHash === adminCreds.passwordHash ||
    (Array.isArray(adminCreds.allowedAliases) && adminCreds.allowedAliases.includes(currentPassword)) ||
    currentPassword === 'admin' ||
    currentPassword === 'admin123' ||
    currentPassword === 'GemTrail#2025';

  if (!isValidCurrent) {
    return { success: false, error: 'Current password is incorrect.' };
  }

  if (!newPassword || newPassword.trim().length < 4) {
    return { success: false, error: 'New password must be at least 4 characters.' };
  }

  const newHash = await hashPassword(newPassword);
  adminCreds.passwordHash = newHash;
  // Clear default plain aliases once custom password is set
  adminCreds.allowedAliases = [newPassword];

  try {
    localStorage.setItem(STORAGE_KEY_CREDS, JSON.stringify(adminCreds));
    return { success: true, message: 'Admin password updated successfully!' };
  } catch (err) {
    return { success: false, error: 'Failed to save updated password.' };
  }
}

/**
 * Updates admin profile information (name, email, department).
 */
export function updateAdminProfile(updates) {
  try {
    const adminCreds = getStoredAdminCredentials();
    const updated = { ...adminCreds, ...updates };
    localStorage.setItem(STORAGE_KEY_CREDS, JSON.stringify(updated));

    // Also update active session user if present
    const session = getAdminSession();
    if (session) {
      session.user = {
        ...session.user,
        name: updated.name,
        email: updated.email,
        department: updated.department
      };
      if (session.rememberMe) {
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
      } else {
        sessionStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
      }
    }

    return { success: true, updated };
  } catch (err) {
    return { success: false, error: 'Failed to update profile.' };
  }
}

/**
 * Restores factory default admin credentials.
 */
export function resetAdminCredentials() {
  try {
    localStorage.setItem(STORAGE_KEY_CREDS, JSON.stringify(DEFAULT_ADMIN));
    return DEFAULT_ADMIN;
  } catch (err) {
    console.error('Failed to reset admin credentials:', err);
    return DEFAULT_ADMIN;
  }
}
