import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Button,
  Chip,
  Tabs,
  Tab,
  Divider,
  Rating,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme
} from '@mui/material';
import {
  Close as CloseIcon,
  Directions as DirectionsIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  AccessTime as AccessTimeIcon,
  ConfirmationNumber as ConfirmationNumberIcon,
  Diamond as DiamondIcon,
  Explore as ExploreIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Phone as PhoneIcon,
  Radar as RadarIcon
} from '@mui/icons-material';

export const PlaceDetailModal = ({
  place,
  onClose,
  isPlanned = false,
  onTogglePlan,
  onOpenDirections
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();

  if (!place) return null;

  return (
    <Dialog
      open={Boolean(place)}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
      slotProps={{
        paper: {
          sx: {
            borderRadius: '12px',
            overflow: 'hidden',
            bgcolor: theme.palette.mode === 'dark' ? '#1e293b' : '#faf7f2',
            backgroundImage: 'none'
          }
        }
      }}
    >
      {/* Close Button */}
      <IconButton
        onClick={onClose}
        aria-label="Close"
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 10,
          bgcolor: 'rgba(0,0,0,0.55)',
          color: '#ffffff',
          backdropFilter: 'blur(6px)',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }
        }}
      >
        <CloseIcon sx={{ fontSize: 20 }} />
      </IconButton>

      {/* Hero Image Header */}
      <Box sx={{ position: 'relative', width: '100%', height: { xs: 200, sm: 280 }, bgcolor: '#000' }}>
        <Box
          component="img"
          src={place.image}
          alt={place.name}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.4) 100%)'
          }}
        />

        {/* Floating details on image with Zero-Pill Unboxed line */}
        <Box sx={{ position: 'absolute', bottom: 16, left: 24, right: 24 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mb: 0.75, color: '#ffffff', fontSize: '0.8rem' }}>
            <Typography component="span" sx={{ fontWeight: 800, color: '#4ade80' }}>
              {place.categoryLabel}
            </Typography>
            <Typography component="span" sx={{ opacity: 0.6 }}>·</Typography>
            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25, fontWeight: 800, color: '#fbbf24' }}>
              <span>★</span>
              <span>{place.rating}</span>
            </Box>
            <Typography component="span" sx={{ opacity: 0.6 }}>·</Typography>
            <Typography component="span" sx={{ fontWeight: 700, color: '#ffffff' }}>
              {place.distanceKm} km away
            </Typography>
            {place.distanceKm <= 25 && (
              <>
                <Typography component="span" sx={{ opacity: 0.6 }}>·</Typography>
                <Typography component="span" sx={{ fontWeight: 800, color: '#60a5fa' }}>
                  25km Radar Zone
                </Typography>
              </>
            )}
          </Box>

          <Typography
            variant="h5"
            sx={{
              fontFamily: '"Literata", Georgia, serif',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.2,
              textShadow: '0 2px 6px rgba(0,0,0,0.6)'
            }}
          >
            {place.name}
          </Typography>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 1 }}>
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Overview" sx={{ textTransform: 'none', fontWeight: 700 }} />
          <Tab label="Gem &amp; Heritage Lore" sx={{ textTransform: 'none', fontWeight: 700 }} />
          <Tab label="Visitor Information" sx={{ textTransform: 'none', fontWeight: 700 }} />
        </Tabs>
      </Box>

      {/* Content */}
      <DialogContent sx={{ p: 3 }}>
        {/* Tab 0: Overview */}
        {activeTab === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.6 }}>
              {place.description}
            </Typography>

            {/* Quick Specs Cards */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 1.5 }}>
              <Box sx={{ p: 1.75, borderRadius: '12px', bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : '#f0ece4', border: `1px solid ${theme.palette.divider}` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, color: 'primary.main' }}>
                  <AccessTimeIcon sx={{ fontSize: 16 }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Best Timing</Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{place.bestTime || 'Daytime / Early Morning'}</Typography>
              </Box>

              <Box sx={{ p: 1.75, borderRadius: '12px', bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : '#f0ece4', border: `1px solid ${theme.palette.divider}` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, color: '#d97706' }}>
                  <ConfirmationNumberIcon sx={{ fontSize: 16 }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Entrance Fee</Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{place.fee || 'Free Admission'}</Typography>
              </Box>

              <Box sx={{ p: 1.75, borderRadius: '12px', bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : '#f0ece4', border: `1px solid ${theme.palette.divider}` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, color: '#2563eb' }}>
                  <RadarIcon sx={{ fontSize: 16 }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Haversine Range</Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{place.distanceKm} km from Center</Typography>
              </Box>
            </Box>

            {/* Coordinates info */}
            {place.coordinates && (
              <Box sx={{ p: 2, borderRadius: '12px', bgcolor: theme.palette.mode === 'dark' ? 'rgba(15,23,42,0.5)' : '#ffffff', border: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  Geographical Coordinates:
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 700, color: 'primary.main' }}>
                  Latitude {place.coordinates.lat.toFixed(6)}° N, Longitude {place.coordinates.lng.toFixed(6)}° E
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Tab 1: Gem & Heritage Lore */}
        {activeTab === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ p: 2, borderRadius: '12px', bgcolor: theme.palette.mode === 'dark' ? 'rgba(217,119,6,0.1)' : '#fef3c7', border: '1px solid rgba(217,119,6,0.3)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <DiamondIcon sx={{ color: '#d97706', fontSize: 20 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#92400e' }}>
                  Gemstone &amp; Geological Heritage
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#78350f', lineHeight: 1.5 }}>
                {place.gemSignificance || 'Located along the ancient gem gravel (illam) basin of Ratnapura, renowned for Blue Sapphires, Padparadscha, Cat\'s Eye, and Star Rubies.'}
              </Typography>
            </Box>

            <Typography variant="subtitle2" sx={{ fontWeight: 800, mt: 1 }}>
              Historical Context &amp; Significance:
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
              {place.historyLore || 'Sabaragamuwa Province holds centuries of royal patronage, monastic traditions, and indigenous gem-mining guilds that date back to ancient Anuradhapura and Kandy kingdoms.'}
            </Typography>
          </Box>
        )}

        {/* Tab 2: Visitor Information */}
        {activeTab === 2 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <List sx={{ p: 0 }}>
              <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemIcon sx={{ minWidth: 36, color: 'primary.main' }}>
                  <ExploreIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Access Route &amp; Terrain"
                  secondary={place.accessibility || 'Accessible by car, van, and tuk-tuk. Short walking trail may be required near the natural formation.'}
                  slotProps={{
                    primary: { fontWeight: 700, fontSize: '0.85rem' },
                    secondary: { fontSize: '0.8rem' }
                  }}
                />
              </ListItem>

              <Divider component="li" />

              <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemIcon sx={{ minWidth: 36, color: 'secondary.main' }}>
                  <PhoneIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Local Tourist Assistance"
                  secondary="Ratnapura Tourism Office &amp; Local Certified Guides: +94 45 222 2275"
                  slotProps={{
                    primary: { fontWeight: 700, fontSize: '0.85rem' },
                    secondary: { fontSize: '0.8rem' }
                  }}
                />
              </ListItem>
            </List>
          </Box>
        )}
      </DialogContent>

      {/* Actions with min 44px touch targets */}
      <DialogActions sx={{ p: 2.5, px: 3, bgcolor: theme.palette.mode === 'dark' ? 'rgba(15,23,42,0.4)' : '#f0ece4', borderTop: `1px solid ${theme.palette.divider}`, gap: 1 }}>
        <Button
          variant={isPlanned ? 'outlined' : 'outlined'}
          color={isPlanned ? 'primary' : 'inherit'}
          startIcon={isPlanned ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          onClick={() => onTogglePlan(place)}
          sx={{ minHeight: 44, px: 2, borderRadius: 2.5, textTransform: 'none', fontWeight: 700 }}
        >
          {isPlanned ? 'Saved in Itinerary' : 'Save to Itinerary'}
        </Button>

        <Button
          variant="contained"
          color="secondary"
          startIcon={<DirectionsIcon />}
          onClick={() => {
            onClose();
            if (onOpenDirections) onOpenDirections(place);
          }}
          sx={{ minHeight: 44, px: 2.5, borderRadius: 2.5, textTransform: 'none', fontWeight: 700 }}
        >
          Scenic Route Directions
        </Button>
      </DialogActions>
    </Dialog>
  );
};
