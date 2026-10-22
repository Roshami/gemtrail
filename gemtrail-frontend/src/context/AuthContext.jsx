
import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

const AuthContext = createContext(null);

const getStoredAuth = () => {
  try {
    const raw =
      localStorage.getItem('auth') ||
      sessionStorage.getItem('auth');

    if (!raw) return { user: null, token: null };

    const auth = JSON.parse(raw);

    if (!auth.token || !auth.user) {
      return { user: null, token: null };
    }

    return auth;
  } catch {
    return { user: null, token: null };
  }
};

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(getStoredAuth);

  const login = useCallback(
    (token, user, rememberMe = false) => {
      const authData = { token, user };

      // Clear previous session to avoid stale credentials.
      localStorage.removeItem('auth');
      sessionStorage.removeItem('auth');

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('auth', JSON.stringify(authData));

      setAuth(authData);
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem('auth');
    sessionStorage.removeItem('auth');
    setAuth({ user: null, token: null });
  }, []);

  const value = {
    user: auth.user,
    token: auth.token,
    isAuthenticated: Boolean(auth.token && auth.user),
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
