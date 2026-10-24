
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  Person as PersonIcon,
  Save as SaveIcon,
  Lock as LockIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:5000'
).replace(/\/$/, '');

const AUTH_URL = `${API_BASE_URL}/api/auth`;

const getSavedToken = () =>
  localStorage.getItem('token') ||
  sessionStorage.getItem('token');

export default function UserProfileView({ onBack }) {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      const token = getSavedToken();

      if (!token) {
        if (!cancelled) {
          setError('Please sign in to view your profile.');
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(`${AUTH_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Unable to load profile.');
        }

        if (!cancelled) {
          setProfile(result.data);
          setName(result.data.name || '');
          setEmail(result.data.email || '');
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Unable to load profile.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const token = getSavedToken();

    if (!token) {
      setError('Your session has expired. Please sign in again.');
      return;
    }

    setSavingProfile(true);

    try {
      const response = await fetch(`${AUTH_URL}/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Could not update profile.');
      }

      setProfile(result.data);
      setName(result.data.name || '');
      setEmail(result.data.email || '');

      // Keep the cached user details consistent with the saved profile.
      for (const storage of [localStorage, sessionStorage]) {
        const saved = storage.getItem('user');

        if (saved) {
          try {
            const user = JSON.parse(saved);
            if (String(user.id) === String(result.data.id)) {
              storage.setItem(
                'user',
                JSON.stringify({ ...user, ...result.data }),
              );
            }
          } catch {
            // Ignore invalid cached user data.
          }
        }
      }

      setSuccess('Your profile has been updated.');
    } catch (err) {
      setError(err.message || 'Could not update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 8 || newPassword.length > 128) {
      setError('New password must be 8–128 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (currentPassword === newPassword) {
      setError('Choose a password different from your current password.');
      return;
    }

    const token = getSavedToken();

    if (!token) {
      setError('Your session has expired. Please sign in again.');
      return;
    }

    setSavingPassword(true);

    try {
      const response = await fetch(`${AUTH_URL}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Could not change password.');
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccess('Your password has been changed successfully.');
    } catch (err) {
      setError(err.message || 'Could not change password.');
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box sx={{ maxWidth: 700, mx: 'auto', p: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Button onClick={onBack} startIcon={<ArrowBackIcon />}>
          Back to Explore
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 760, mx: 'auto', p: { xs: 2, md: 4 } }}>
      <Button
        onClick={onBack}
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        Back to Explore
      </Button>

      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Avatar sx={{ width: 64, height: 64 }}>
          <PersonIcon sx={{ fontSize: 36 }} />
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight={800}>
            My Profile
          </Typography>
          <Typography color="text.secondary">
            Manage your GemTrail account
          </Typography>
        </Box>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Personal Details
          </Typography>

          <Box component="form" onSubmit={handleSaveProfile}>
            <Stack spacing={2}>
              <TextField
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                inputProps={{ minLength: 2, maxLength: 120 }}
              />

              <TextField
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <TextField
                label="Account Type"
                value={profile.role || 'visitor'}
                disabled
              />

              <TextField
                label="Member Since"
                value={
                  profile.created_at
                    ? new Date(profile.created_at).toLocaleDateString()
                    : 'Not available'
                }
                disabled
              />

              <Box>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={
                    savingProfile ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      <SaveIcon />
                    )
                  }
                  disabled={savingProfile}
                >
                  {savingProfile ? 'Saving...' : 'Save Profile'}
                </Button>
              </Box>
            </Stack>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="body2" color="text.secondary">
            Your account role is managed by the server and cannot be changed here.
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <LockIcon color="primary" />
            <Typography variant="h6" fontWeight={700}>
              Change Password
            </Typography>
          </Stack>

          <Box component="form" onSubmit={handleChangePassword}>
            <Stack spacing={2}>
              <TextField
                label="Current Password"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />

              <TextField
                label="New Password"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                inputProps={{ minLength: 8, maxLength: 128 }}
                helperText="Use 8–128 characters."
                required
              />

              <TextField
                label="Confirm New Password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <Box>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={
                    savingPassword ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      <LockIcon />
                    )
                  }
                  disabled={savingPassword}
                >
                  {savingPassword ? 'Updating...' : 'Change Password'}
                </Button>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
