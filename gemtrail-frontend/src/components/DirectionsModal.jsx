import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Button,
  Card,
  CardContent,
  Divider,
  useTheme
} from '@mui/material';
import {
  Close as CloseIcon,
  Navigation as NavigationIcon,
  DirectionsCar as DirectionsCarIcon,
  TwoWheeler as TwoWheelerIcon,
  OpenInNew as OpenInNewIcon,
  Radar as RadarIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

export const DirectionsModal = ({
  place,
  fromCenterName,
  fromCenterCoords,
  onClose
}) => {
  const theme = useTheme();

  if (!place) return null;

  const driveMinutes = Math.max(8, Math.round((place.distanceKm / 35) * 60));
  const tukTukMinutes = Math.max(10, Math.round((place.distanceKm / 28) * 60));

  const googleMapsUrl = place.coordinates?.lat && place.coordinates?.lng
    ? `https://www.google.com/maps/dir/?api=1&destination=${place.coordinates.lat},${place.coordinates.lng}&travelmode=driving`
    : '#';

  return (
    <Dialog
      open={Boolean(place)}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      scroll="paper"
      slotProps={{
        paper: {
          sx: {
            borderRadius: '12px',
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
          top: 14,
          right: 14,
          color: 'text.secondary',
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
          '&:hover': { bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)' }
        }}
      >
        <CloseIcon sx={{ fontSize: 18 }} />
      </IconButton>

      <DialogContent sx={{ p: { xs: 2.5, sm: 3 } }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1, color: 'primary.main' }}>
          <NavigationIcon />
          <Typography variant="h6" sx={{ fontFamily: '"Literata", Georgia, serif', fontWeight: 800, color: 'text.primary' }}>
            Scenic Route Guidance
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Navigating from{' '}
          <Typography component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {fromCenterName}
          </Typography>{' '}
          to{' '}
          <Typography component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {place.name}
          </Typography>
        </Typography>

        {/* Travel Time Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 3 }}>
          {/* Card 1: Car */}
          <Card
            elevation={0}
            sx={{
              p: 2,
              borderRadius: '12px',
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(45, 106, 79, 0.15)' : '#edf7f0',
              border: '1px solid rgba(45, 106, 79, 0.3)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  bgcolor: 'primary.main',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <DirectionsCarIcon sx={{ fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem' }}>
                  By Vehicle
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                  ~{driveMinutes} mins
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                  {place.distanceKm} km direct
                </Typography>
              </Box>
            </Box>
          </Card>

          {/* Card 2: Tuk-Tuk */}
          <Card
            elevation={0}
            sx={{
              p: 2,
              borderRadius: '12px',
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(217, 119, 6, 0.15)' : '#fffbeb',
              border: '1px solid rgba(217, 119, 6, 0.3)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  bgcolor: '#d97706',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <TwoWheelerIcon sx={{ fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#b45309', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem' }}>
                  By Tuk-Tuk
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                  ~{tukTukMinutes} mins
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                  Scenic village route
                </Typography>
              </Box>
            </Box>
          </Card>
        </Box>

        {/* Step-by-step route highlights */}
        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: 'text.primary', fontSize: '0.85rem' }}>
          Recommended Waypoints &amp; Road Segments:
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pl: 1, borderLeft: `2px solid ${theme.palette.divider}`, ml: 1, mb: 3 }}>
          <Box sx={{ position: 'relative', pl: 2 }}>
            <Box sx={{ position: 'absolute', left: -9, top: 4, width: 10, height: 10, borderRadius: '50%', bgcolor: 'primary.main' }} />
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              Depart from: {fromCenterName}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Follow regional highway toward the designated landmark corridor.
            </Typography>
          </Box>

          <Box sx={{ position: 'relative', pl: 2 }}>
            <Box sx={{ position: 'absolute', left: -9, top: 4, width: 10, height: 10, borderRadius: '50%', bgcolor: 'secondary.main' }} />
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              Kalu Ganga River &amp; Sabaragamuwa Foothills
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Scenic views of traditional riverbed gem panning sites and tea plantations.
            </Typography>
          </Box>

          <Box sx={{ position: 'relative', pl: 2 }}>
            <Box sx={{ position: 'absolute', left: -9, top: 4, width: 10, height: 10, borderRadius: '50%', bgcolor: '#d97706' }} />
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              Arrival: {place.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Target coordinates: {place.coordinates?.lat.toFixed(5)}° N, {place.coordinates?.lng.toFixed(5)}° E
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, px: 3, bgcolor: theme.palette.mode === 'dark' ? 'rgba(15,23,42,0.4)' : '#f0ece4', borderTop: `1px solid ${theme.palette.divider}` }}>
        <Button onClick={onClose} color="inherit" sx={{ minHeight: 44, px: 2.5, textTransform: 'none', fontWeight: 600 }}>
          Close
        </Button>
        <Button
          component="a"
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          variant="contained"
          color="secondary"
          endIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
          sx={{ minHeight: 44, px: 2.5, textTransform: 'none', fontWeight: 700 }}
        >
          Open in Google Maps
        </Button>
      </DialogActions>
    </Dialog>
  );
};
