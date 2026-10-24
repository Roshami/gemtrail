import React, { useState } from 'react';
import {
  Box,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Explore as ExploreIcon,
  Radar as RadarIcon,
  Map as MapIcon,
  Timeline as TimelineIcon,
  MoreHoriz as MoreHorizIcon,
  Diamond as DiamondIcon,
  MenuBook as MenuBookIcon,
  Info as InfoIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  Close as CloseIcon,
  AdminPanelSettings as AdminIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';

export const MobileBottomNav = ({
  activeTab,
  onTabChange,
  planCount = 0,
  radarMode = 'radar',
  onRadarModeChange,
  placesWithin25Count = 0,
  themeMode = 'light',
  onToggleTheme,
  onScrollToMap,
  isAdminLoggedIn = false,
  onAdminLogout,
}) => {
  const [moreOpen, setMoreOpen] = useState(false);
  const theme = useTheme();

  const handleRadarToggle = () => {
    if (activeTab !== 'explore') {
      onTabChange('explore');
    }
    const nextMode = radarMode === 'radar' ? 'all' : 'radar';
    if (onRadarModeChange) {
      onRadarModeChange(nextMode);
    }
  };

  const handleMapClick = () => {
    onTabChange('map');
  };

  return (
    <>
      {/* Mobile Sticky Bottom Tab Bar */}
      <Box
        component="nav"
        aria-label="Mobile Navigation"
        sx={{
          display: { xs: 'flex', lg: 'none' },
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
          zIndex: 1100,
          bgcolor:
            theme.palette.mode === 'dark'
              ? 'rgba(15, 23, 42, 0.94)'
              : 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(16px)',
          borderTop: `1px solid ${theme.palette.divider}`,
          boxShadow: '0 -4px 16px rgba(0,0,0,0.08)',
          px: 1,
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        {/* Tab 1: Explore Grid */}
        <Box
          component="button"
          onClick={() => onTabChange('explore')}
          sx={{
            flex: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            p: 0,
            color: activeTab === 'explore' ? 'primary.main' : 'text.secondary',
            transition: 'color 0.2s ease',
            minHeight: 44,
            minWidth: 44,
          }}
        >
          <ExploreIcon sx={{ fontSize: 22 }} />
          <Typography
            component="span"
            sx={{
              fontSize: '0.65rem',
              fontWeight: activeTab === 'explore' ? 800 : 600,
              mt: 0.25,
              lineHeight: 1,
            }}
          >
            Explore
          </Typography>
        </Box>

        {/* Tab 2: 25km Radar Toggle */}
        <Box
          component="button"
          onClick={handleRadarToggle}
          sx={{
            flex: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            p: 0,
            color: radarMode === 'radar' ? '#2563eb' : 'text.secondary',
            transition: 'color 0.2s ease',
            minHeight: 44,
            minWidth: 44,
          }}
        >
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <RadarIcon sx={{ fontSize: 22 }} />
            {radarMode === 'radar' && (
              <Box
                sx={{
                  position: 'absolute',
                  top: -2,
                  right: -6,
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  bgcolor: '#2563eb',
                }}
              />
            )}
          </Box>
          <Typography
            component="span"
            sx={{
              fontSize: '0.65rem',
              fontWeight: radarMode === 'radar' ? 800 : 600,
              mt: 0.25,
              lineHeight: 1,
            }}
          >
            {radarMode === 'radar'
              ? `Radar (${placesWithin25Count})`
              : 'All 44'}
          </Typography>
        </Box>

        {/* Tab 3: Interactive Map Page */}
        <Box
          component="button"
          onClick={handleMapClick}
          sx={{
            flex: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            p: 0,
            color: activeTab === 'map' ? 'primary.main' : 'text.secondary',
            transition: 'color 0.2s ease',
            minHeight: 44,
            minWidth: 44,
          }}
        >
          <MapIcon sx={{ fontSize: 22 }} />
          <Typography
            component="span"
            sx={{
              fontSize: '0.65rem',
              fontWeight: activeTab === 'map' ? 800 : 600,
              mt: 0.25,
              lineHeight: 1,
            }}
          >
            Map
          </Typography>
        </Box>

        {/* Tab 4: Itinerary Planner */}
        <Box
          component="button"
          onClick={() => onTabChange('planner')}
          sx={{
            flex: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            p: 0,
            color: activeTab === 'planner' ? 'primary.main' : 'text.secondary',
            transition: 'color 0.2s ease',
            minHeight: 44,
            minWidth: 44,
          }}
        >
          <TimelineIcon sx={{ fontSize: 22 }} />

          <Typography
            component="span"
            sx={{
              fontSize: '0.65rem',
              fontWeight: activeTab === 'planner' ? 800 : 600,
              mt: 0.25,
              lineHeight: 1,
            }}
          >
            Itinerary
          </Typography>
        </Box>

        {/* Tab 5: More (Trails, Guides, Info) */}
        <Box
          component="button"
          onClick={() => setMoreOpen(true)}
          sx={{
            flex: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            p: 0,
            color: ['trails', 'stories', 'about'].includes(activeTab)
              ? 'primary.main'
              : 'text.secondary',
            transition: 'color 0.2s ease',
            minHeight: 44,
            minWidth: 44,
          }}
        >
          <MoreHorizIcon sx={{ fontSize: 24 }} />
          <Typography
            component="span"
            sx={{
              fontSize: '0.65rem',
              fontWeight: ['trails', 'stories', 'about'].includes(activeTab)
                ? 800
                : 600,
              mt: 0.25,
              lineHeight: 1,
            }}
          >
            More
          </Typography>
        </Box>
      </Box>

      {/* "More" Action Drawer for Mobile */}
      <Drawer
        anchor="bottom"
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        slotProps={{
          paper: {
            sx: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              bgcolor: theme.palette.background.default,
              p: 2.5,
              maxHeight: '70vh',
            },
          },
        }}
      >
        {/* Grab Handle */}
        <Box
          sx={{
            width: 40,
            height: 5,
            bgcolor: theme.palette.divider,
            borderRadius: 3,
            mx: 'auto',
            mb: 2,
          }}
        />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1.5,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontFamily: '"Literata", Georgia, serif', fontWeight: 800 }}
          >
            Explorer Navigation
          </Typography>
          <Box
            component="button"
            onClick={() => setMoreOpen(false)}
            sx={{
              minWidth: 44,
              minHeight: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'text.secondary',
            }}
          >
            <CloseIcon fontSize="small" />
          </Box>
        </Box>

        <List sx={{ py: 0 }}>
          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => {
                onTabChange('map');
                setMoreOpen(false);
              }}
              selected={activeTab === 'map'}
              sx={{ borderRadius: '12px', minHeight: 48 }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
                <MapIcon />
              </ListItemIcon>
              <ListItemText
                primary="Interactive Map"
                secondary="Real satellite cartography, 25km radar, and pin explorer"
                slotProps={{
                  primary: { fontWeight: 700, fontSize: '0.9rem' },
                  secondary: { fontSize: '0.75rem' },
                }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => {
                onTabChange('trails');
                setMoreOpen(false);
              }}
              selected={activeTab === 'trails'}
              sx={{ borderRadius: '12px', minHeight: 48 }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
                <DiamondIcon />
              </ListItemIcon>
              <ListItemText
                primary="Gem Trails & Mines"
                secondary="Historic artisanal pits and lapidary circuits"
                slotProps={{
                  primary: { fontWeight: 700, fontSize: '0.9rem' },
                  secondary: { fontSize: '0.75rem' },
                }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => {
                onTabChange('stories');
                setMoreOpen(false);
              }}
              selected={activeTab === 'stories'}
              sx={{ borderRadius: 2.5, minHeight: 48 }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
                <MenuBookIcon />
              </ListItemIcon>
              <ListItemText
                primary="Stories & Field Guides"
                secondary="Cultural history, folklore, and seasonal tips"
                slotProps={{
                  primary: { fontWeight: 700, fontSize: '0.9rem' },
                  secondary: { fontSize: '0.75rem' },
                }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => {
                onTabChange('about');
                setMoreOpen(false);
              }}
              selected={activeTab === 'about'}
              sx={{ borderRadius: 2.5, minHeight: 48 }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
                <InfoIcon />
              </ListItemIcon>
              <ListItemText
                primary="About Sabaragamuwa"
                secondary="Regional geography, climate, and heritage"
                slotProps={{
                  primary: { fontWeight: 700, fontSize: '0.9rem' },
                  secondary: { fontSize: '0.75rem' },
                }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => {
                onTabChange('admin');
                setMoreOpen(false);
              }}
              selected={activeTab === 'admin'}
              sx={{ borderRadius: 2.5, minHeight: 48 }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
                <AdminIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{isAdminLoggedIn ? 'Admin' : 'Login'}</span>
                    {isAdminLoggedIn && (
                      <Chip
                        label="Active"
                        size="small"
                        color="success"
                        sx={{
                          height: 18,
                          fontSize: '0.65rem',
                          fontWeight: 700,
                        }}
                      />
                    )}
                  </Box>
                }
                secondary={
                  isAdminLoggedIn
                    ? 'Manage landmarks, GPS, and database'
                    : 'Sign in to your account'
                }
                slotProps={{
                  primary: { fontWeight: 700, fontSize: '0.9rem' },
                  secondary: { fontSize: '0.75rem' },
                }}
              />
            </ListItemButton>
          </ListItem>

          {isAdminLoggedIn && onAdminLogout && (
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => {
                  onAdminLogout();
                  setMoreOpen(false);
                }}
                sx={{ borderRadius: 2.5, minHeight: 44, color: 'error.main' }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Log Out Admin"
                  slotProps={{
                    primary: { fontWeight: 700, fontSize: '0.85rem' },
                  }}
                />
              </ListItemButton>
            </ListItem>
          )}
        </List>

        <Divider sx={{ my: 1.5 }} />

        {/* Theme Mode Switch in Drawer */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 1,
            py: 0.5,
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: 'text.secondary' }}
          >
            Theme Appearance
          </Typography>
          <Box
            component="button"
            onClick={onToggleTheme}
            sx={{
              minHeight: 44,
              px: 2,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor:
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.08)'
                  : 'rgba(0,0,0,0.05)',
              border: `1px solid ${theme.palette.divider}`,
              cursor: 'pointer',
              color: 'text.primary',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
          >
            {themeMode === 'dark' ? (
              <Brightness7Icon fontSize="small" />
            ) : (
              <Brightness4Icon fontSize="small" />
            )}
            <span>{themeMode === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};
