
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Badge,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  InputAdornment,
} from '@mui/material';

import {
  Diamond as DiamondIcon,
  Bookmark as BookmarkIcon,
  Explore as ExploreIcon,
  Map as MapIcon,
  Timeline as TimelineIcon,
  MenuBook as MenuBookIcon,
  Info as InfoIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  AccountCircle as AccountCircleIcon,
  LockReset as LockResetIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';

export const Header = ({
  activeTab,
  onTabChange,
  planCount = 0,
  themeMode = 'light',
  onToggleTheme,
  isAdminLoggedIn = false,
  onAdminLogout,
  currentUser = null,
  onProfileClick,
  onLogout,
  authToken,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState(null);

  // Change password dialog state
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const theme = useTheme();

  const isUserLoggedIn = Boolean(currentUser) || isAdminLoggedIn;
  const userName = currentUser?.name || currentUser?.displayName || 'User';
  const userEmail = currentUser?.email || '';

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const openChangePassword = () => {
    setProfileAnchor(null);
    setMobileOpen(false);
    setPasswordMessage('');
    setPasswordError(false);
    setChangePasswordOpen(true);
  };

  const closeChangePassword = () => {
    if (passwordLoading) return;

    setChangePasswordOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordMessage('');
    setPasswordError(false);
    setShowPasswords(false);
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setPasswordMessage('');

    if (!authToken) {
      setPasswordError(true);
      setPasswordMessage(
        'Authentication token not found. Please log in again.',
      );
      return;
    }

    if (newPassword.length < 3 || newPassword.length > 128) {
      setPasswordError(true);
      setPasswordMessage(
        'New password must be between 3 and 128 characters.',
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(true);
      setPasswordMessage('New passwords do not match.');
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError(true);
      setPasswordMessage(
        'Your new password must be different from your current password.',
      );
      return;
    }

    setPasswordLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      const response = await fetch(
        `${apiUrl.replace(/\/$/, '')}/api/auth/change-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Unable to change password.',
        );
      }

      setPasswordError(false);
      setPasswordMessage(
        data.message || 'Password changed successfully.',
      );

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setPasswordError(true);
      setPasswordMessage(
        error.message || 'Unable to connect to the server.',
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const navItems = [
    {
      id: 'explore',
      label: 'Explore Places',
      icon: <ExploreIcon fontSize="small" />,
    },
    {
      id: 'map',
      label: 'Interactive Map',
      icon: <MapIcon fontSize="small" />,
    },
    {
      id: 'trails',
      label: 'Gem Trails & Mines',
      icon: <DiamondIcon fontSize="small" />,
    },
    {
      id: 'planner',
      label: 'Trip Planner',
      icon: <TimelineIcon fontSize="small" />,
      badge: planCount,
    },
    {
      id: 'stories',
      label: 'Stories & Guides',
      icon: <MenuBookIcon fontSize="small" />,
    },
    {
      id: 'about',
      label: 'About Sabaragamuwa',
      icon: <InfoIcon fontSize="small" />,
    },
    {
      id: isUserLoggedIn ? 'profile' : 'admin',
      label: isUserLoggedIn ? 'Profile' : 'Login',
      icon: isUserLoggedIn ? (
        <Badge variant="dot" color="success">
          <AccountCircleIcon fontSize="small" />
        </Badge>
      ) : (
        <PersonIcon fontSize="small" />
      ),
    },
  ];

  const currentTabIndex = navItems.findIndex(
    (item) => item.id === activeTab,
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor:
            theme.palette.mode === 'dark'
              ? 'rgba(15, 23, 42, 0.92)'
              : 'rgba(250, 247, 242, 0.92)',
          backdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.primary,
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar
          sx={{
            maxWidth: '1400px',
            width: '100%',
            mx: 'auto',
            px: { xs: 1.5, sm: 3 },
            py: 0.5,
            justifyContent: 'space-between',
          }}
        >
          {/* Brand */}
          <Box
            component="button"
            onClick={() => onTabChange('explore')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              p: 0,
              textAlign: 'left',
              minHeight: 44,
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: '10px',
                background:
                  'linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(45, 106, 79, 0.25)',
                transition: 'transform 0.2s ease',
                '&:hover': { transform: 'scale(1.05)' },
              }}
            >
              <DiamondIcon sx={{ fontSize: 20 }} />
            </Box>

            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Literata", Georgia, serif',
                fontWeight: 800,
                lineHeight: 1,
                color: theme.palette.text.primary,
                letterSpacing: '-0.02em',
                fontSize: { xs: '1.15rem', sm: '1.25rem' },
                whiteSpace: 'nowrap',
              }}
            >
              GemTrail
              <Box
                component="span"
                sx={{ display: { xs: 'none', sm: 'inline' } }}
              >
                {' '}Ratnapura
              </Box>
            </Typography>
          </Box>

          {/* Desktop navigation */}
          <Box
            sx={{
              display: { xs: 'none', lg: 'flex' },
              alignItems: 'center',
            }}
          >
            <Tabs
              value={currentTabIndex >= 0 ? currentTabIndex : 0}
              onChange={(_, newValue) =>
                onTabChange(navItems[newValue].id)
              }
              textColor="primary"
              indicatorColor="primary"
              sx={{
                minHeight: 48,
                '& .MuiTab-root': {
                  minHeight: 48,
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.825rem',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  my: 0.5,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.05)'
                        : 'rgba(0,0,0,0.04)',
                  },
                },
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                },
              }}
            >
              {navItems.map((item) => (
                <Tab
                  key={item.id}
                  icon={
                    item.badge !== undefined && item.badge > 0 ? (
                      <Badge
                        badgeContent={item.badge}
                        color="primary"
                        sx={{
                          '& .MuiBadge-badge': {
                            fontSize: '0.65rem',
                            height: 16,
                            minWidth: 16,
                          },
                        }}
                      >
                        {item.icon}
                      </Badge>
                    ) : (
                      item.icon
                    )
                  }
                  iconPosition="start"
                  label={item.label}
                />
              ))}
            </Tabs>
          </Box>

          {/* Right-side actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="View Itinerary">
              <IconButton
                onClick={() => onTabChange('planner')}
                aria-label="View Itinerary"
                sx={{
                  minWidth: 44,
                  minHeight: 44,
                  color:
                    activeTab === 'planner'
                      ? 'primary.main'
                      : 'text.secondary',
                  bgcolor:
                    activeTab === 'planner'
                      ? theme.palette.mode === 'dark'
                        ? 'rgba(74, 222, 128, 0.15)'
                        : 'rgba(45, 106, 79, 0.08)'
                      : 'transparent',
                  border: `1px solid ${theme.palette.divider}`,
                  p: 1,
                }}
              >
                <Badge badgeContent={planCount} color="primary" max={99}>
                  <BookmarkIcon fontSize="small" />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Theme toggle */}
            {onToggleTheme && (
              <Tooltip
                title={
                  themeMode === 'dark'
                    ? 'Switch to Light Theme'
                    : 'Switch to Dark Theme'
                }
              >
                <IconButton
                  onClick={onToggleTheme}
                  aria-label="Toggle Theme"
                  sx={{
                    minWidth: 44,
                    minHeight: 44,
                    color: 'text.secondary',
                    border: `1px solid ${theme.palette.divider}`,
                    p: 1,
                  }}
                >
                  {themeMode === 'dark' ? (
                    <Brightness7Icon fontSize="small" />
                  ) : (
                    <Brightness4Icon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            )}

            {/* Login / Profile button */}
            <Tooltip
              title={
                isUserLoggedIn
                  ? `User Profile${userName ? `: ${userName}` : ''}`
                  : 'Login'
              }
            >
              <IconButton
                onClick={(event) => {
                  if (isUserLoggedIn) {
                    setProfileAnchor(event.currentTarget);
                  } else {
                    onTabChange('admin');
                  }
                }}
                aria-label={
                  isUserLoggedIn ? 'Open User Profile' : 'Login'
                }
                sx={{
                  minWidth: 44,
                  minHeight: 44,
                  color:
                    activeTab === 'admin' || activeTab === 'profile'
                      ? '#fff'
                      : isUserLoggedIn
                        ? 'primary.main'
                        : 'text.secondary',
                  bgcolor:
                    activeTab === 'admin' || activeTab === 'profile'
                      ? 'primary.main'
                      : theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(0, 0, 0, 0.03)',
                  border: `1px solid ${
                    activeTab === 'admin' || activeTab === 'profile'
                      ? theme.palette.primary.main
                      : isUserLoggedIn
                        ? theme.palette.primary.light
                        : theme.palette.divider
                  }`,
                  p: 1,
                }}
              >
                {isUserLoggedIn ? (
                  <Badge variant="dot" color="success">
                    <AdminIcon fontSize="small" />
                  </Badge>
                ) : (
                  <AdminIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>

            {/* Profile dropdown */}
            <Menu
              anchorEl={profileAnchor}
              open={Boolean(profileAnchor)}
              onClose={() => setProfileAnchor(null)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <Box sx={{ px: 2, py: 1, minWidth: 210 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 800 }}
                >
                  {userName}
                </Typography>

                {userEmail && (
                  <Typography variant="body2" color="text.secondary">
                    {userEmail}
                  </Typography>
                )}
              </Box>

              <Divider />

              <MenuItem
                onClick={() => {
                  setProfileAnchor(null);
                  if (onProfileClick) {
                    onProfileClick();
                  } else {
                    onTabChange('profile');
                  }
                }}
              >
                <AccountCircleIcon
                  fontSize="small"
                  sx={{ mr: 1.5 }}
                />
                Profile
              </MenuItem>

              <MenuItem onClick={openChangePassword}>
                <LockResetIcon
                  fontSize="small"
                  sx={{ mr: 1.5 }}
                />
                Change Password
              </MenuItem>

              <MenuItem
                onClick={() => {
                  setProfileAnchor(null);
                  if (onLogout) {
                    onLogout();
                  } else if (onAdminLogout) {
                    onAdminLogout();
                  }
                }}
              >
                <PersonIcon fontSize="small" sx={{ mr: 1.5 }} />
                Logout
              </MenuItem>
            </Menu>

            {/* Mobile navigation button */}
            <IconButton
              onClick={handleDrawerToggle}
              aria-label="Open Navigation Menu"
              sx={{
                minWidth: 44,
                minHeight: 44,
                display: { xs: 'flex', lg: 'none' },
                color: 'text.primary',
                border: `1px solid ${theme.palette.divider}`,
                p: 1,
              }}
            >
              <MenuIcon fontSize="small" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile navigation drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        slotProps={{
          paper: {
            sx: {
              width: 290,
              bgcolor: theme.palette.background.default,
              p: 2,
            },
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                background:
                  'linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <DiamondIcon sx={{ fontSize: 18 }} />
            </Box>

            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 800,
                fontFamily: '"Literata", Georgia, serif',
              }}
            >
              GemTrail Menu
            </Typography>
          </Box>

          <IconButton onClick={handleDrawerToggle} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <List sx={{ p: 0 }}>
          {navItems.map((item) => {
            const isSelected = activeTab === item.id;

            return (
              <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={isSelected}
                  onClick={() => {
                    onTabChange(item.id);
                    setMobileOpen(false);
                  }}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 700,
                    '&.Mui-selected': {
                      backgroundColor:
                        theme.palette.mode === 'dark'
                          ? 'rgba(74, 222, 128, 0.2)'
                          : 'rgba(45, 106, 79, 0.12)',
                      color: 'primary.main',
                      '& .MuiListItemIcon-root': {
                        color: 'primary.main',
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 36,
                      color: isSelected
                        ? 'primary.main'
                        : 'text.secondary',
                    }}
                  >
                    {item.badge !== undefined && item.badge > 0 ? (
                      <Badge badgeContent={item.badge} color="primary">
                        {item.icon}
                      </Badge>
                    ) : (
                      item.icon
                    )}
                  </ListItemIcon>

                  <ListItemText
                    primary={item.label}
                    slotProps={{
                      primary: {
                        fontSize: '0.875rem',
                        fontWeight: isSelected ? 800 : 600,
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}

          {isUserLoggedIn && (
            <>
              <Divider sx={{ my: 1.5 }} />

              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => {
                    setMobileOpen(false);
                    if (onProfileClick) {
                      onProfileClick();
                    } else {
                      onTabChange('profile');
                    }
                  }}
                  sx={{ borderRadius: 2 }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <AccountCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={openChangePassword}
                  sx={{ borderRadius: 2 }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <LockResetIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Change Password" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    setMobileOpen(false);
                    if (onLogout) {
                      onLogout();
                    } else if (onAdminLogout) {
                      onAdminLogout();
                    }
                  }}
                  sx={{ borderRadius: 2 }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </Drawer>

      {/* Change Password dialog */}
      <Dialog
        open={changePasswordOpen}
        onClose={closeChangePassword}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Change Password</DialogTitle>

        <Box component="form" onSubmit={handleChangePassword}>
          <DialogContent>
            {passwordMessage && (
              <Alert severity={passwordError ? 'error' : 'success'} sx={{ mb: 2 }}>
                {passwordMessage}
              </Alert>
            )}

            <TextField
              label="Current Password"
              type={showPasswords ? 'text' : 'password'}
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              fullWidth
              required
              margin="normal"
              autoComplete="current-password"
            />

            <TextField
              label="New Password"
              type={showPasswords ? 'text' : 'password'}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              fullWidth
              required
              margin="normal"
              slotProps={{
                htmlInput: { minLength: 3, maxLength: 128 },
              }}
              autoComplete="new-password"
            />

            <TextField
              label="Confirm New Password"
              type={showPasswords ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              fullWidth
              required
              margin="normal"
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPasswords ? 'Hide passwords' : 'Show passwords'
                      }
                      onClick={() =>
                        setShowPasswords((previous) => !previous)
                      }
                      edge="end"
                    >
                      {showPasswords ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={closeChangePassword}
              disabled={passwordLoading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={passwordLoading}
            >
              {passwordLoading ? 'Changing...' : 'Change Password'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default Header;
