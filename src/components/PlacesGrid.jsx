import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Box,
  Typography,
  Rating,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  FormControl,
  Select,
  MenuItem,
  useTheme
} from '@mui/material';
import {
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Directions as DirectionsIcon,
  OpenInNew as OpenInNewIcon,
  Radar as RadarIcon,
  WaterDrop as WaterDropIcon,
  Forest as ForestIcon,
  Diamond as DiamondIcon,
  AccountBalance as AccountBalanceIcon,
  Museum as MuseumIcon,
  Spa as SpaIcon,
  Place as PlaceIcon,
  AccessTime as AccessTimeIcon,
  ConfirmationNumber as ConfirmationNumberIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

export const PlacesGrid = ({
  places,
  totalInBoundary,
  sortBy,
  onSortChange,
  plannedIds = [],
  onTogglePlan,
  onOpenDetails,
  onOpenDirections,
  onViewInPlanner,
  radarMode = 'radar',
  placesWithin25Count
}) => {
  const [toastMessage, setToastMessage] = useState(null);
  const theme = useTheme();

  const handlePlanClick = (place, e) => {
    e.stopPropagation();
    onTogglePlan(place);
    const added = !plannedIds.includes(place.id);
    setToastMessage(added ? `"${place.name}" saved to your itinerary!` : `"${place.name}" removed from itinerary`);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'waterfalls':
        return <WaterDropIcon sx={{ fontSize: 14 }} />;
      case 'nature':
        return <ForestIcon sx={{ fontSize: 14 }} />;
      case 'mines':
        return <DiamondIcon sx={{ fontSize: 14 }} />;
      case 'heritage':
        return <AccountBalanceIcon sx={{ fontSize: 14 }} />;
      case 'museums':
        return <MuseumIcon sx={{ fontSize: 14 }} />;
      case 'tea_spice':
        return <SpaIcon sx={{ fontSize: 14 }} />;
      default:
        return <PlaceIcon sx={{ fontSize: 14 }} />;
    }
  };

  return (
    <Box component="section" sx={{ width: '100%', pb: 6 }} id="gridColumn">
      
      {/* Section Title & Sorting Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'center' }, justifyContent: 'space-between', gap: 2, mb: 2.5, px: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              bgcolor: radarMode === 'radar' ? '#2563eb' : 'primary.main',
              animation: radarMode === 'radar' ? 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' : 'none'
            }}
          />
          <Typography variant="h6" sx={{ fontFamily: '"Literata", Georgia, serif', fontWeight: 800, color: 'text.primary', fontSize: '1.15rem' }}>
            {radarMode === 'radar' ? '25km Live Radar Attractions' : 'All Verified Attractions'}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            (<Typography component="span" sx={{ fontWeight: 800, color: 'text.primary' }} id="visibleCountText">{places.length} of {totalInBoundary}</Typography>{' '}
            {radarMode === 'radar' ? 'within 25km' : 'in boundary'})
          </Typography>
        </Box>

        {/* Sort selector */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            Sort by:
          </Typography>
          <FormControl size="small">
            <Select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              sx={{
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.6)' : 'rgba(245, 241, 234, 0.85)',
                borderRadius: 2,
                fontSize: '0.775rem',
                fontWeight: 700,
                py: 0
              }}
            >
              <MenuItem value="distance">Shortest Distance</MenuItem>
              <MenuItem value="rating">Highest Rated</MenuItem>
              <MenuItem value="fee">Lowest Entrance Fee</MenuItem>
              <MenuItem value="name">Alphabetical</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Grid of Places */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(auto-fill, minmax(280px, 1fr))',
            lg: 'repeat(auto-fill, minmax(320px, 1fr))'
          },
          gap: { xs: 1.5, sm: 2.5 }
        }}
      >
        {places.map((place) => {
          const isPlanned = plannedIds.includes(place.id);
          const isWithin25 = place.distanceKm !== undefined && place.distanceKm <= 25;

          return (
            <Card
              key={place.id}
              onClick={() => onOpenDetails(place)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                bgcolor: theme.palette.mode === 'dark' ? '#1e293b' : '#ffffff',
                border: isWithin25 && radarMode === 'radar'
                  ? '1.5px solid rgba(37, 99, 235, 0.5)'
                  : `1px solid ${theme.palette.divider}`,
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 12px 24px rgba(0,0,0,0.5)'
                    : '0 12px 24px rgba(45, 106, 79, 0.12)'
                }
              }}
            >
              {/* Image Container with subtle gradient scrim */}
              <Box sx={{ position: 'relative', width: '100%', height: 195, overflow: 'hidden' }}>
                <CardMedia
                  component="img"
                  image={place.image}
                  alt={place.name}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease',
                    '&:hover': { transform: 'scale(1.05)' }
                  }}
                />
                
                {/* Subtle gradient scrim */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.3) 100%)'
                  }}
                />

                {/* Top Quick Actions: Bookmark button with 44x44px touch target */}
                <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                  <Tooltip title={isPlanned ? 'Remove from Itinerary' : 'Save to Itinerary'}>
                    <IconButton
                      onClick={(e) => handlePlanClick(place, e)}
                      aria-label={isPlanned ? 'Remove from Itinerary' : 'Save to Itinerary'}
                      sx={{
                        minWidth: 44,
                        minHeight: 44,
                        bgcolor: isPlanned ? 'primary.main' : 'rgba(0,0,0,0.55)',
                        color: '#ffffff',
                        backdropFilter: 'blur(8px)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                        '&:hover': { bgcolor: isPlanned ? 'primary.dark' : 'rgba(0,0,0,0.8)' }
                      }}
                    >
                      {isPlanned ? <BookmarkIcon sx={{ fontSize: 18 }} /> : <BookmarkBorderIcon sx={{ fontSize: 18 }} />}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {/* Card Content with Zero-Pill Unboxed Metadata */}
              <CardContent sx={{ p: 2.25, flexGrow: 1, pb: 1 }}>
                
                {/* Clean unboxed editorial kicker with typographic separators */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.75, mb: 1, fontSize: '0.75rem', color: 'text.secondary' }}>
                  <Typography component="span" sx={{ fontWeight: 700, color: 'primary.main', fontSize: '0.75rem' }}>
                    {place.categoryLabel}
                  </Typography>
                  <Typography component="span" sx={{ opacity: 0.5 }}>·</Typography>
                  <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25, fontWeight: 700, color: '#d97706' }}>
                    <span>★</span>
                    <span>{place.rating}</span>
                  </Box>
                  <Typography component="span" sx={{ opacity: 0.5 }}>·</Typography>
                  <Typography component="span" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem' }}>
                    {place.distanceKm} km away
                  </Typography>
                  {isWithin25 && (
                    <>
                      <Typography component="span" sx={{ opacity: 0.5 }}>·</Typography>
                      <Typography component="span" sx={{ fontWeight: 800, color: '#2563eb', fontSize: '0.75rem' }}>
                        25km Radar
                      </Typography>
                    </>
                  )}
                </Box>

                {/* Primary Title */}
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontFamily: '"Literata", Georgia, serif',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    lineHeight: 1.25,
                    color: 'text.primary',
                    mb: 0.75,
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {place.name}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.825rem',
                    lineHeight: 1.5,
                    mb: 1.75,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {place.description}
                </Typography>

                {/* Practical Meta Row: Timing & Fee */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1.25, borderTop: `1px solid ${theme.palette.divider}` }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                    <AccessTimeIcon sx={{ fontSize: 14 }} />
                    <Typography variant="caption" sx={{ fontSize: '0.725rem' }}>
                      {place.bestTime || 'Daylight Hours'}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.725rem' }}>
                    Fee: {place.fee || place.entranceFee || 'Free'}
                  </Typography>
                </Box>
              </CardContent>

              {/* Actions with min 44px touch targets */}
              <CardActions sx={{ px: 2.25, pb: 2.25, pt: 0.5, display: 'flex', justifyContent: 'space-between', gap: 1.25 }}>
                <Button
                  size="medium"
                  variant="outlined"
                  color="inherit"
                  startIcon={<DirectionsIcon sx={{ fontSize: 16 }} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenDirections(place);
                  }}
                  sx={{
                    flex: 1,
                    minHeight: 44,
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    borderRadius: 2.5,
                    borderColor: theme.palette.divider
                  }}
                >
                  Directions
                </Button>

                <Button
                  size="medium"
                  variant="contained"
                  color="primary"
                  endIcon={<ArrowForwardIcon sx={{ fontSize: 15 }} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenDetails(place);
                  }}
                  sx={{
                    flex: 1,
                    minHeight: 44,
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    borderRadius: 2.5
                  }}
                >
                  Details
                </Button>
              </CardActions>
            </Card>
          );
        })}
      </Box>

      {/* Itinerary Toast Snackbar */}
      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={3000}
        onClose={() => setToastMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToastMessage(null)}
          severity="success"
          variant="filled"
          sx={{ borderRadius: 3, fontWeight: 600, fontSize: '0.85rem' }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
