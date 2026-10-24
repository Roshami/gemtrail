import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Alert,
  Chip,
  Divider,
  useTheme,
  CircularProgress,
} from '@mui/material';
import {
  AdminPanelSettings as AdminIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon,
  VpnKey as KeyIcon,
  Shield as ShieldIcon,
  CheckCircle as CheckCircleIcon,
  PersonAddAlt1 as SignUpIcon,
  Email as EmailIcon,
} from '@mui/icons-material';

// Set VITE_API_URL in your frontend .env if the API is hosted on another origin.
// Example: VITE_API_URL=http://localhost:5000
const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:5000'
).replace(/\/$/, '');
const AUTH_URL = `${API_BASE_URL}/api/auth`;

const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const LoginView = ({
  onLoginSuccess,
  onBackToExplore,
  onUserLoginSuccess,
}) => {
  const theme = useTheme();

  const [mode, setMode] = useState('login'); // "login" | "register"
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const clearMessages = () => {
    setErrorMsg('');
    setSuccessMsg('');
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    clearMessages();
    setPassword('');
    setConfirmPassword('');
  };

  const saveSession = (token, user) => {
    // Never trust a role supplied by the form; use the role returned by the API.
    const storage = rememberMe ? window.localStorage : window.sessionStorage;
    const otherStorage = rememberMe
      ? window.sessionStorage
      : window.localStorage;
    otherStorage.removeItem('token');
    otherStorage.removeItem('user');
    storage.setItem('token', token);
    storage.setItem('user', JSON.stringify(user));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    clearMessages();

    if (mode === 'register') {
      if (name.trim().length < 2 || name.trim().length > 120) {
        setErrorMsg('Name must be 2–120 characters.');
        return;
      }
      if (password.length < 3 || password.length > 128) {
        setErrorMsg('Password must be 3–128 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
    }

    if (!email.trim() || !password) {
      setErrorMsg('Email and password are required.');
      return;
    }

    setLoading(true);
    try {
      const endpoint = mode === 'register' ? 'register' : 'login';
      const payload =
        mode === 'register'
          ? { name: name.trim(), email: email.trim().toLowerCase(), password }
          : { email: email.trim().toLowerCase(), password };

      const response = await fetch(`${AUTH_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) {
        setErrorMsg(
          result.message ||
            'The request could not be completed. Please try again.',
        );
        return;
      }

      if (mode === 'register') {
        setSuccessMsg(
          'Your visitor account has been created. You can now sign in.',
        );
        setMode('login');
        setPassword('');
        setConfirmPassword('');
        return;
      }

      const { token, user } = result.data || {};
      if (!token || !user) {
        setErrorMsg('The server returned an invalid login response.');
        return;
      }

      // Only a server-authenticated admin may trigger the admin-dashboard callback.
      if (user.role === 'admin') {
        saveSession(token, user);
        setSuccessMsg(
          `Welcome, ${user.name || 'Administrator'}! Opening the admin console...`,
        );
        window.setTimeout(() => {
          onLoginSuccess?.(user);
        }, 400);
        return;
      }

      if (user.role === 'visitor') {
        saveSession(token, user);
        setSuccessMsg(
          `Welcome, ${user.name || 'visitor'}! You are signed in as a visitor.`,
        );
        window.setTimeout(() => {
          onUserLoginSuccess?.(user);
          onBackToExplore?.();
        }, 700);
        return;
      }

      // Fail closed for unknown or missing roles.
      setErrorMsg(
        'This account does not have permission to access the application.',
      );
    } catch (error) {
      setErrorMsg(
        'Unable to connect to the server. Check that the backend is running and the API URL is correct.',
      );
    } finally {
      setLoading(false);
    }
  };

  const isRegister = mode === 'register';

  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 4, md: 8 },
        px: 2,
        background:
          theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at 50% 20%, rgba(20, 83, 45, 0.25) 0%, rgba(15, 23, 42, 0.95) 75%)'
            : 'radial-gradient(circle at 50% 15%, rgba(16, 185, 129, 0.12) 0%, rgba(248, 250, 252, 0.95) 80%)',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 480 }}>
        <Box
          sx={{
            mb: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBackToExplore}
            size="small"
            sx={{
              color: 'text.secondary',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
            }}
          >
            Back to Public Explorer
          </Button>
          <Chip
            icon={<ShieldIcon fontSize="small" />}
            label="Secure Account"
            size="small"
            color="success"
            variant="outlined"
            sx={{ fontWeight: 700, fontSize: '0.72rem' }}
          />
        </Box>

        <Card
          elevation={4}
          sx={{
            borderRadius: 3.5,
            border: `1px solid ${
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.08)'
            }`,
            backdropFilter: 'blur(12px)',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              height: 6,
              background:
                'linear-gradient(90deg, #059669 0%, #10b981 50%, #34d399 100%)',
            }}
          />

          <CardContent sx={{ p: { xs: 3, sm: 4.5 } }}>
            <Box sx={{ textAlign: 'center', mb: 3.5 }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  mx: 'auto',
                  mb: 2,
                  borderRadius: '50%',
                  bgcolor:
                    theme.palette.mode === 'dark'
                      ? 'rgba(16, 185, 129, 0.15)'
                      : 'rgba(16, 185, 129, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'primary.main',
                  border: '2px solid',
                  borderColor: 'primary.light',
                }}
              >
                {isRegister ? (
                  <SignUpIcon sx={{ fontSize: 34 }} />
                ) : (
                  <AdminIcon sx={{ fontSize: 34 }} />
                )}
              </Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 800, letterSpacing: '-0.02em', mb: 0.5 }}
              >
                {isRegister ? 'Create Your Account' : 'Sign In'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                GemTrail Ratnapura Tourism Portal
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Visitors can explore and plan trips. Only administrators can
                access the admin console.
              </Typography>
            </Box>

            {errorMsg && (
              <Alert
                severity="error"
                sx={{ mb: 3, borderRadius: 2 }}
                onClose={() => setErrorMsg('')}
              >
                {errorMsg}
              </Alert>
            )}
            {successMsg && (
              <Alert
                icon={<CheckCircleIcon fontSize="inherit" />}
                severity="success"
                sx={{ mb: 3, borderRadius: 2 }}
              >
                {successMsg}
              </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              <Button
                fullWidth
                variant={!isRegister ? 'contained' : 'outlined'}
                onClick={() => switchMode('login')}
                disabled={loading}
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                Login
              </Button>
              <Button
                fullWidth
                variant={isRegister ? 'contained' : 'outlined'}
                onClick={() => switchMode('register')}
                disabled={loading}
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                Sign Up
              </Button>
            </Box>

            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {isRegister && (
                  <TextField
                    label="Full Name"
                    fullWidth
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    disabled={loading}
                    required
                    slotProps={{
                      htmlInput: {
                        minLength: 2,
                        maxLength: 120,
                      },
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="action" fontSize="small" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}

                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  autoComplete="email"
                  autoFocus={!isRegister}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  disabled={loading}
                  required
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="action" fontSize="small" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setEmail('')}
                            edge="end"
                            size="small"
                            aria-label="clear email"
                          >
                            <EmailIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  autoComplete={
                    isRegister ? 'new-password' : 'current-password'
                  }
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={
                    isRegister ? 'At least 8 characters' : 'Enter your password'
                  }
                  disabled={loading}
                  required
                  slotProps={{
                    htmlInput: {
                      minLength: 3,
                      maxLength: 128,
                    },
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="action" fontSize="small" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowPassword((visible) => !visible)
                            }
                            edge="end"
                            size="small"
                            aria-label="toggle password visibility"
                          >
                            {showPassword ? (
                              <VisibilityOffIcon fontSize="small" />
                            ) : (
                              <VisibilityIcon fontSize="small" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                {isRegister && (
                  <TextField
                    label="Confirm Password"
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    disabled={loading}
                    required
                    slotProps={{
                      htmlInput: isRegister
                        ? { minLength: 3, maxLength: 128 }
                        : {},
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="action" fontSize="small" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowPassword((visible) => !visible)
                              }
                              edge="end"
                              size="small"
                              aria-label="toggle password visibility"
                            >
                              {showPassword ? (
                                <VisibilityOffIcon fontSize="small" />
                              ) : (
                                <VisibilityIcon fontSize="small" />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}

                {!isRegister && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={rememberMe}
                        onChange={(event) =>
                          setRememberMe(event.target.checked)
                        }
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                        Remember me on this device
                      </Typography>
                    }
                  />
                )}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  startIcon={
                    loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : isRegister ? (
                      <SignUpIcon />
                    ) : (
                      <KeyIcon />
                    )
                  }
                  sx={{
                    py: 1.4,
                    borderRadius: 2.5,
                    fontWeight: 700,
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                  }}
                >
                  {loading
                    ? 'Please wait...'
                    : isRegister
                      ? 'Create Visitor Account'
                      : 'Sign In'}
                </Button>
              </Box>
            </form>

            <Divider sx={{ my: 3 }} />

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', textAlign: 'center' }}
            >
              New accounts are registered as visitors. Administrator access is
              granted only to accounts assigned the admin role by the server.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export const AdminLoginView = LoginView;
export default LoginView;
