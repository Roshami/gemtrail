import React, { useState, useEffect } from 'react';
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
  Paper,
  Divider,
  useTheme,
  CircularProgress,
  Tooltip
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
  InfoOutlined as InfoIcon
} from '@mui/icons-material';
import { loginAdmin } from '../utils/adminAuth.js';

export const AdminLoginView = ({ onLoginSuccess, onBackToExplore }) => {
  const theme = useTheme();

  const [identifier, setIdentifier] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const result = await loginAdmin(identifier, password, rememberMe);
      if (result.success) {
        setSuccessMsg(`Welcome, ${result.user.name || 'Administrator'}! Opening console...`);
        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess(result.user);
          }
        }, 500);
      } else {
        setErrorMsg(result.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (userVal, passVal) => {
    setIdentifier(userVal);
    setPassword(passVal);
    setErrorMsg('');
  };

  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 4, md: 8 },
        px: 2,
        background: theme.palette.mode === 'dark'
          ? 'radial-gradient(circle at 50% 20%, rgba(20, 83, 45, 0.25) 0%, rgba(15, 23, 42, 0.95) 75%)'
          : 'radial-gradient(circle at 50% 15%, rgba(16, 185, 129, 0.12) 0%, rgba(248, 250, 252, 0.95) 80%)'
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 480 }}>
        {/* Back Link */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBackToExplore}
            size="small"
            sx={{
              color: 'text.secondary',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { color: 'primary.main', bgcolor: 'transparent' }
            }}
          >
            Back to Public Explorer
          </Button>

          <Chip
            icon={<ShieldIcon fontSize="small" />}
            label="Protected Zone"
            size="small"
            color="success"
            variant="outlined"
            sx={{ fontWeight: 700, fontSize: '0.72rem' }}
          />
        </Box>

        {/* Login Card */}
        <Card
          elevation={4}
          sx={{
            borderRadius: 3.5,
            border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
            backdropFilter: 'blur(12px)',
            overflow: 'hidden'
          }}
        >
          {/* Card Accent Top Bar */}
          <Box
            sx={{
              height: 6,
              background: 'linear-gradient(90deg, #059669 0%, #10b981 50%, #34d399 100%)'
            }}
          />

          <CardContent sx={{ p: { xs: 3, sm: 4.5 } }}>
            {/* Header Icon & Title */}
            <Box sx={{ textAlign: 'center', mb: 3.5 }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  mx: 'auto',
                  mb: 2,
                  borderRadius: '50%',
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'primary.main',
                  border: '2px solid',
                  borderColor: 'primary.light'
                }}
              >
                <AdminIcon sx={{ fontSize: 34 }} />
              </Box>

              <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em', mb: 0.5 }}>
                Admin Authentication
              </Typography>
              <Typography variant="body2" color="text.secondary">
                GemTrail Sabaragamuwa CMS & Landmark Portal
              </Typography>
            </Box>

            {/* Error or Success Alerts */}
            {errorMsg && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setErrorMsg('')}>
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

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {/* Username / Email Field */}
                <TextField
                  label="Username or Email"
                  variant="outlined"
                  fullWidth
                  autoFocus
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin or admin@gemtrail.lk"
                  disabled={loading}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" fontSize="small" />
                        </InputAdornment>
                      )
                    }
                  }}
                />

                {/* Password Field */}
                <TextField
                  label="Admin Password"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  disabled={loading}
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
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            size="small"
                            aria-label="toggle password visibility"
                          >
                            {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  }}
                />

                {/* Remember Me Option */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        color="primary"
                      />
                    }
                    label={<Typography variant="body2" sx={{ fontSize: '0.85rem' }}>Remember session on this device</Typography>}
                  />
                </Box>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <KeyIcon />}
                  sx={{
                    py: 1.4,
                    borderRadius: 2.5,
                    fontWeight: 700,
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
                  }}
                >
                  {loading ? 'Authenticating...' : 'Sign In to Admin Console'}
                </Button>
              </Box>
            </form>

            <Divider sx={{ my: 3 }} />

            {/* Quick-fill helper box for seamless testing */}
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 2.5,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                borderStyle: 'dashed'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <InfoIcon fontSize="small" color="primary" />
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Default Admin Credentials
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                <Tooltip title="Click to fill default admin credentials">
                  <Chip
                    label="Username: admin • Pass: admin123"
                    size="small"
                    onClick={() => handleQuickFill('admin', 'admin123')}
                    color="primary"
                    variant="outlined"
                    clickable
                    sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                  />
                </Tooltip>

                <Tooltip title="Click to fill alternate alias">
                  <Chip
                    label="Pass: admin"
                    size="small"
                    onClick={() => handleQuickFill('admin', 'admin')}
                    variant="outlined"
                    clickable
                    sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                  />
                </Tooltip>
              </Box>

              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, fontSize: '0.72rem' }}>
                Password can be customized inside the Admin Panel Settings after login.
              </Typography>
            </Paper>

            {/* Security Notice Footer */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                Secure session tokens • Audit logged • Sabaragamuwa Tourism Board
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
