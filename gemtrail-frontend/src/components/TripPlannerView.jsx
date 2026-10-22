import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Tooltip,
  Divider,
  useTheme
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Delete as DeleteIcon,
  ContentCopy as ContentCopyIcon,
  Check as CheckIcon,
  Print as PrintIcon,
  AutoAwesome as AutoAwesomeIcon,
  DirectionsCar as DirectionsCarIcon,
  Navigation as NavigationIcon,
  ArrowForward as ArrowForwardIcon,
  Radar as RadarIcon
} from '@mui/icons-material';

export const TripPlannerView = ({
  plannedPlaces = [],
  onRemoveFromPlan,
  onClearPlan,
  onAddRecommended,
  onOpenDetails,
  onOpenDirections
}) => {
  const [copied, setCopied] = useState(false);
  const theme = useTheme();

  const totalDistance = plannedPlaces.reduce((sum, p) => sum + (p.distanceKm || 0), 0);
  const totalDriveTime = Math.round((totalDistance / 32) * 60);

  const handleShareItinerary = () => {
    const text = `GemTrail Ratnapura Itinerary:\n` + 
      plannedPlaces.map((p, i) => `${i + 1}. ${p.name} (${p.distanceKm} km, Fee: ${p.fee || p.entranceFee || 'Free'})`).join('\n') +
      `\nTotal Route: ~${totalDistance.toFixed(1)} km`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <Box sx={{ maxWidth: '1440px', mx: 'auto', px: { xs: 1.5, sm: 3, md: 4 }, py: 4 }}>
      
      {/* Planner Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'center' }, justifyContent: 'space-between', gap: 2, pb: 3, borderBottom: `1px solid ${theme.palette.divider}`, mb: 4 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#d97706', mb: 0.5 }}>
            <CalendarIcon sx={{ fontSize: 18 }} />
            <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Curated Expedition Route
            </Typography>
          </Box>
          <Typography variant="h4" sx={{ fontFamily: '"Literata", Georgia, serif', fontWeight: 800, color: 'text.primary' }}>
            Trip Planner
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Organize and sequence your journey across Ratnapura's gem pits, ancient shrines, and cascades.
          </Typography>
        </Box>

        {plannedPlaces.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              onClick={handleShareItinerary}
              startIcon={copied ? <CheckIcon sx={{ color: 'success.main' }} /> : <ContentCopyIcon />}
              sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 700 }}
            >
              {copied ? 'Copied to Clipboard' : 'Copy Route'}
            </Button>

            <Button
              variant="outlined"
              color="inherit"
              size="small"
              onClick={() => window.print()}
              startIcon={<PrintIcon />}
              sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 700 }}
            >
              Print Itinerary
            </Button>

            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={onClearPlan}
              sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 700 }}
            >
              Reset List
            </Button>
          </Box>
        )}
      </Box>

      {plannedPlaces.length === 0 ? (
        <Card
          elevation={0}
          sx={{
            maxWidth: 600,
            mx: 'auto',
            p: { xs: 3, sm: 6 },
            textAlign: 'center',
            borderRadius: '12px',
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.5)' : '#fdfbf7',
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '12px',
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(217, 119, 6, 0.2)' : '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2.5
            }}
          >
            <CalendarIcon sx={{ fontSize: 32 }} />
          </Box>
          <Typography variant="h5" sx={{ fontFamily: '"Literata", Georgia, serif', fontWeight: 800, mb: 1 }}>
            Your expedition plan is currently empty
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3.5, lineHeight: 1.6 }}>
            Click "Save to Itinerary" on any attraction card or map marker in the Explore Places tab to construct your custom Sabaragamuwa route.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={onAddRecommended}
            startIcon={<AutoAwesomeIcon />}
            sx={{ py: 1.25, px: 3, borderRadius: '12px', fontWeight: 700, textTransform: 'none' }}
          >
            Load Curated 1-Day Gem &amp; Cascade Safari
          </Button>
        </Card>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 4 }}>
          
          {/* Main List */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {plannedPlaces.map((place, index) => (
              <Card
                key={place.id}
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { sm: 'center' },
                  justifyContent: 'space-between',
                  gap: 2,
                  bgcolor: theme.palette.mode === 'dark' ? '#1e293b' : '#ffffff',
                  border: `1px solid ${theme.palette.divider}`
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      shrink: 0
                    }}
                  >
                    {index + 1}
                  </Box>

                  <Box
                    component="img"
                    src={place.image}
                    alt={place.name}
                    sx={{
                      width: 68,
                      height: 68,
                      borderRadius: 2.5,
                      objectFit: 'cover',
                      border: `1px solid ${theme.palette.divider}`
                    }}
                  />

                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                      <Chip
                        label={place.categoryLabel}
                        size="small"
                        sx={{ fontSize: '0.65rem', height: 20, fontWeight: 700 }}
                      />
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        {place.distanceKm} km from center
                      </Typography>
                    </Box>
                    <Typography
                      variant="subtitle1"
                      onClick={() => onOpenDetails(place)}
                      sx={{
                        fontWeight: 800,
                        fontFamily: '"Literata", Georgia, serif',
                        cursor: 'pointer',
                        '&:hover': { color: 'primary.main' }
                      }}
                    >
                      {place.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                      Fee: {place.fee || place.entranceFee || 'Free'} • {place.bestTime || 'Daylight'}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, alignSelf: { xs: 'flex-end', sm: 'center' } }}>
                  <Button
                    size="small"
                    variant="outlined"
                    color="secondary"
                    startIcon={<NavigationIcon sx={{ fontSize: 14 }} />}
                    onClick={() => onOpenDirections(place)}
                    sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.75rem', fontWeight: 700 }}
                  >
                    Route
                  </Button>

                  <Tooltip title="Remove from Itinerary">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onRemoveFromPlan(place.id)}
                      sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}
                    >
                      <DeleteIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Card>
            ))}
          </Box>

          {/* Route Summary Card */}
          <Box>
            <Card
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: '12px',
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.6)' : '#f5f1ea',
                border: `1px solid ${theme.palette.divider}`,
                position: { lg: 'sticky' },
                top: { lg: 100 }
              }}
            >
              <Typography variant="h6" sx={{ fontFamily: '"Literata", Georgia, serif', fontWeight: 800, mb: 2 }}>
                Route Metrics
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Destinations:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>{plannedPlaces.length} Sites</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Estimated Distance:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: 'secondary.main' }}>~{totalDistance.toFixed(1)} km</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Approx. Transit Time:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main' }}>~{Math.floor(totalDriveTime / 60)}h {totalDriveTime % 60}m</Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 2.5 }} />

              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleShareItinerary}
                startIcon={<ContentCopyIcon />}
                sx={{ py: 1.25, borderRadius: 2.5, fontWeight: 700, textTransform: 'none' }}
              >
                Copy Route Summary
              </Button>
            </Card>
          </Box>

        </Box>
      )}

    </Box>
  );
};
