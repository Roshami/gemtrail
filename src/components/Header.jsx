import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Badge,
  IconButton,
  Button,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  useTheme
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
  GpsFixed as GpsFixedIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';

export const Header = ({
  activeTab,
  onTabChange,
  planCount = 0,
  themeMode = 'light',
  onToggleTheme,
  isAdminLoggedIn = false,
  onAdminLogout
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const navItems = [
    { id: 'explore', label: 'Explore Places', icon: <ExploreIcon fontSize="small" /> },
    { id: 'map', label: 'Interactive Map', icon: <MapIcon fontSize="small" /> },
    { id: 'trails', label: 'Gem Trails & Mines', icon: <DiamondIcon fontSize="small" /> },
    { id: 'planner', label: 'Trip Planner', icon: <TimelineIcon fontSize="small" />, badge: planCount },
    { id: 'stories', label: 'Stories & Guides', icon: <MenuBookIcon fontSize="small" /> },
    { id: 'about', label: 'About Sabaragamuwa', icon: <InfoIcon fontSize="small" /> },
    {
      id: 'admin',
      label: isAdminLoggedIn ? 'Admin Panel' : 'Admin Login',
      icon: isAdminLoggedIn ? (
        <Badge variant="dot" color="success">
          <AdminIcon fontSize="small" />
        </Badge>
      ) : (
        <AdminIcon fontSize="small" />
      )
    }
  ];

  const currentTabIndex = navItems.findIndex((item) => item.id === activeTab);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.92)' : 'rgba(250, 247, 242, 0.92)',
          backdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.primary,
          transition: 'all 0.3s ease'
        }}
      >
        <Toolbar sx={{ maxWidth: '1400px', width: '100%', mx: 'auto', px: { xs: 1.5, sm: 3 }, py: 0.5, justifyContent: 'space-between' }}>
          
          {/* Zone 1: Single Brand Zone */}
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
              minHeight: 44
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(45, 106, 79, 0.25)',
                transition: 'transform 0.2s ease',
                '&:hover': { transform: 'scale(1.05)' }
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
                whiteSpace: 'nowrap'
              }}
            >
              GemTrail
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                {' '}Sabaragamuwa
              </Box>
            </Typography>
          </Box>

          {/* Desktop Navigation Tabs */}
          <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center' }}>
            <Tabs
              value={currentTabIndex >= 0 ? currentTabIndex : 0}
              onChange={(_, newValue) => onTabChange(navItems[newValue].id)}
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
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'
                  }
                },
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: '3px 3px 0 0'
                }
              }}
            >
              {navItems.map((item) => (
                <Tab
                  key={item.id}
                  icon={
                    item.badge !== undefined && item.badge > 0 ? (
                      <Badge badgeContent={item.badge} color="primary" sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', height: 16, minWidth: 16 } }}>
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

          {/* Right Action Icons & Mobile Hamburger */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            
            {/* Quick Trip Planner Icon Button */}
            <Tooltip title="View Itinerary">
              <IconButton
                onClick={() => onTabChange('planner')}
                aria-label="View Itinerary"
                sx={{
                  minWidth: 44,
                  minHeight: 44,
                  color: activeTab === 'planner' ? 'primary.main' : 'text.secondary',
                  bgcolor: activeTab === 'planner' ? (theme.palette.mode === 'dark' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(45, 106, 79, 0.08)') : 'transparent',
                  border: `1px solid ${theme.palette.divider}`,
                  p: 1
                }}
              >
                <Badge badgeContent={planCount} color="primary" max={99}>
                  <BookmarkIcon fontSize="small" />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Dark / Light Theme Toggle */}
            {onToggleTheme && (
              <Tooltip title={themeMode === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}>
                <IconButton
                  onClick={onToggleTheme}
                  aria-label="Toggle Theme"
                  sx={{
                    minWidth: 44,
                    minHeight: 44,
                    color: 'text.secondary',
                    border: `1px solid ${theme.palette.divider}`,
                    p: 1
                  }}
                >
                  {themeMode === 'dark' ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
                </IconButton>
              </Tooltip>
            )}

            {/* Admin Panel Quick Action */}
            <Tooltip title={isAdminLoggedIn ? "Admin Panel (Authenticated)" : "Admin Portal (Login Required)"}>
              <IconButton
                onClick={() => onTabChange('admin')}
                aria-label="Admin Control Panel"
                sx={{
                  minWidth: 44,
                  minHeight: 44,
                  color: activeTab === 'admin' ? '#fff' : (isAdminLoggedIn ? 'primary.main' : 'text.secondary'),
                  bgcolor: activeTab === 'admin'
                    ? 'primary.main'
                    : (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'),
                  border: `1px solid ${activeTab === 'admin' ? theme.palette.primary.main : (isAdminLoggedIn ? theme.palette.primary.light : theme.palette.divider)}`,
                  p: 1,
                  '&:hover': {
                    bgcolor: activeTab === 'admin' ? 'primary.dark' : undefined
                  }
                }}
              >
                {isAdminLoggedIn ? (
                  <Badge variant="dot" color="success">
                    <AdminIcon fontSize="small" />
                  </Badge>
                ) : (
                  <AdminIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>

            {/* Mobile Hamburger Menu Button */}
            <IconButton
              onClick={handleDrawerToggle}
              aria-label="Open Navigation Menu"
              sx={{
                minWidth: 44,
                minHeight: 44,
                display: { xs: 'flex', lg: 'none' },
                color: 'text.primary',
                border: `1px solid ${theme.palette.divider}`,
                p: 1
              }}
            >
              <MenuIcon fontSize="small" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        slotProps={{
          paper: {
            sx: {
              width: 290,
              bgcolor: theme.palette.background.default,
              p: 2
            }
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <DiamondIcon sx={{ fontSize: 18 }} />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, fontFamily: '"Literata", Georgia, serif' }}>
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
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(45, 106, 79, 0.12)',
                      color: 'primary.main',
                      '& .MuiListItemIcon-root': { color: 'primary.main' }
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: isSelected ? 'primary.main' : 'text.secondary' }}>
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
                        fontWeight: isSelected ? 800 : 600
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>
    </>
  );
};
