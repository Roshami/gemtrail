import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Button,
  Alert,
  AlertTitle,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Radar as RadarIcon,
  MyLocation as MyLocationIcon,
  LocationOff as LocationOffIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material';
import { DISTRICT_INFO } from '../data/ratnapuraPlaces.js';

export const DistrictStatusHeader = ({
  userLocation,
  isGpsLive,
  geoError,
  radarMode = 'radar',
  onRadarModeChange,
  placesWithin25Count = 0,
  totalPlaces = 44,
  onRetryGps
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ pt: 2, pb: 2.5 }}>
      {/* Geolocation Error Alert Banner if permission denied or unavailable */}
      {geoError && (
        <Alert
          severity="warning"
          icon={<LocationOffIcon fontSize="inherit" />}
          action={
            onRetryGps && (
              <Button
                color="inherit"
                size="small"
                onClick={onRetryGps}
                startIcon={<MyLocationIcon fontSize="small" />}
                sx={{
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textTransform: 'none',
                  border: '1px solid currentColor'
                }}
              >
                Retry GPS
              </Button>
            )
          }
          sx={{
            mb: 2.5,
            borderRadius: '12px',
            '& .MuiAlert-message': { fontSize: '0.8125rem' }
          }}
        >
          <AlertTitle sx={{ fontWeight: 700, fontSize: '0.875rem', mb: 0.25 }}>
            Location Service Notice
          </AlertTitle>
          {geoError}
        </Alert>
      )}

      {/* Main Header & Live Radar Controls */}
      <Card
        elevation={0}
        sx={{
          background: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '12px'
        }}
      >
        <CardContent sx={{ p: { xs: 1.5, sm: 3 }, '&:last-child': { pb: { xs: 1.5, sm: 3 } } }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, justifyContent: 'space-between', alignItems: { lg: 'flex-end' }, gap: 3 }}>
            
            {/* Left Column: District Info & Live Badges */}
            <Box sx={{ maxWidth: '800px' }}>
              {/* Zero-Pill Clean Unboxed Metadata Line with subtle separators */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mb: 1.5, fontSize: '0.8rem', color: 'text.secondary' }}>
                
                {/* Live GPS status */}
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
                  <Box sx={{ position: 'relative', display: 'flex', width: 8, height: 8 }}>
                    {isGpsLive && (
                      <Box
                        component="span"
                        sx={{
                          animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
                          position: 'absolute',
                          display: 'inline-flex',
                          height: '100%',
                          width: '100%',
                          borderRadius: '50%',
                          backgroundColor: '#22c55e',
                          opacity: 0.75
                        }}
                      />
                    )}
                    <Box
                      component="span"
                      sx={{
                        position: 'relative',
                        display: 'inline-flex',
                        borderRadius: '50%',
                        height: 8,
                        width: 8,
                        backgroundColor: isGpsLive ? '#16a34a' : '#b45309'
                      }}
                    />
                  </Box>
                  <Typography component="span" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 700, color: isGpsLive ? 'success.main' : 'text.secondary' }}>
                    {isGpsLive ? 'Live GPS ' : 'Default Center '}
                    {userLocation ? `${userLocation.lat.toFixed(4)}° N, ${userLocation.lng.toFixed(4)}° E` : '6.6828° N, 80.3992° E'}
                  </Typography>
                </Box>

                <Typography component="span" sx={{ color: 'text.secondary', opacity: 0.5 }}>·</Typography>

                {/* Proximity Counter */}
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                  <RadarIcon sx={{ fontSize: '1rem', color: '#2563eb' }} />
                  <Typography component="span" sx={{ fontSize: '0.775rem', fontWeight: 700, color: 'text.primary' }}>
                    Found {placesWithin25Count} of {totalPlaces} places within 25km
                  </Typography>
                </Box>

                <Typography component="span" sx={{ color: 'text.secondary', opacity: 0.5 }}>·</Typography>

                {/* District Boundary descriptor */}
                <Typography component="span" sx={{ fontSize: '0.775rem', fontWeight: 600, color: 'text.secondary' }}>
                  Ratnapura Gem Belt
                </Typography>
              </Box>

              {/* Title and Description */}
              <Typography
                variant="h4"
                sx={{
                  fontFamily: '"Literata", Georgia, serif',
                  fontWeight: 800,
                  color: theme.palette.text.primary,
                  letterSpacing: '-0.02em',
                  fontSize: { xs: '1.6rem', sm: '2rem' },
                  lineHeight: 1.2,
                  mb: 0.75
                }}
              >
                Ratnapura District Explorer
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  lineHeight: 1.5,
                  maxWidth: '720px'
                }}
              >
                All 44 landmark coordinates across the Sabaragamuwa gem belt mapped with high precision, continuous GPS tracking, and instant 25km Haversine live radar filtering.
              </Typography>
            </Box>

          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
