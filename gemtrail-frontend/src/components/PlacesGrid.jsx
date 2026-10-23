
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Snackbar,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';

import {
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Directions as DirectionsIcon,
  Place as PlaceIcon,
  AccessTime as AccessTimeIcon,
  ArrowForward as ArrowForwardIcon,
  AddLocationAlt as AddLocationAltIcon,
} from '@mui/icons-material';

// Set VITE_API_BASE_URL=http://localhost:5000/api in .env if required.
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || '/api'
).replace(/\/$/, '');

const getAuthToken = (providedToken) => {
  if (providedToken) return providedToken;

  try {
    return (
      localStorage.getItem('token') ||
      localStorage.getItem('accessToken') ||
      localStorage.getItem('access_token') ||
      ''
    );
  } catch {
    return '';
  }
};

const getErrorMessage = (error, fallback) =>
  error?.message || fallback;

export const PlacesGrid = ({
  places = [],
  totalInBoundary = 0,
  sortBy,
  onSortChange,
  onOpenDetails,
  onOpenDirections,
  onViewInPlanner,
  radarMode = 'radar',

  // Optional props from your existing authentication system.
  authToken,
  user,
  isAuthenticated,
  onLoginRequired,
}) => {
  const theme = useTheme();

  const [favoriteIds, setFavoriteIds] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [selectedItinerary, setSelectedItinerary] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);

  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [loadingItineraries, setLoadingItineraries] = useState(false);
  const [savingFavoriteId, setSavingFavoriteId] = useState(null);
  const [addingPlace, setAddingPlace] = useState(false);

  const [plannerOpen, setPlannerOpen] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const token = getAuthToken(authToken);

  const loggedIn =
    typeof isAuthenticated === 'boolean'
      ? isAuthenticated
      : Boolean(user || token);

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const request = useCallback(
    async (path, options = {}) => {
      const headers = {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      };

      const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
        credentials: 'include',
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false) {
        if (response.status === 401 || response.status === 403) {
          const error = new Error(
            result.message || 'Please log in to continue.'
          );
          error.status = response.status;
          throw error;
        }

        throw new Error(
          result.message || `Request failed (${response.status}).`
        );
      }

      return result;
    },
    [token]
  );

  const requireLogin = () => {
    showToast('Please log in to use bookmarks and itinerary planning.', 'info');

    if (onLoginRequired) {
      onLoginRequired();
    } else {
      // Change this route if your login page uses a different URL.
      window.location.assign('/login');
    }
  };

  // Load the logged-in user's favorites from the backend.
  const loadFavorites = useCallback(async () => {
    if (!loggedIn) {
      setFavoriteIds([]);
      return;
    }

    setLoadingFavorites(true);

    try {
      const result = await request('/favorites');

      setFavoriteIds(
        (result.data || []).map((place) => String(place.id))
      );
    } catch (error) {
      showToast(
        getErrorMessage(error, 'Could not load favorites.'),
        'error'
      );
    } finally {
      setLoadingFavorites(false);
    }
  }, [loggedIn, request]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Load itinerary plans when the user opens the planner.
  const loadItineraries = async () => {
    if (!loggedIn) {
      requireLogin();
      return;
    }

    setLoadingItineraries(true);

    try {
      const result = await request('/itineraries');
      setItineraries(result.data || []);
      setSelectedItinerary((result.data || [])[0]?.id?.toString() || '');
      setPlannerOpen(true);
    } catch (error) {
      showToast(
        getErrorMessage(error, 'Could not load itineraries.'),
        'error'
      );
    } finally {
      setLoadingItineraries(false);
    }
  };

  // Toggle a favorite in the favorites database table.
  const handleFavoriteClick = async (place, event) => {
    event.stopPropagation();

    if (!loggedIn) {
      requireLogin();
      return;
    }

    if (savingFavoriteId !== null) return;

    const placeId = String(place.id);
    const isFavorite = favoriteIds.includes(placeId);

    setSavingFavoriteId(placeId);

    try {
      if (isFavorite) {
        await request(`/favorites/${encodeURIComponent(place.id)}`, {
          method: 'DELETE',
        });

        setFavoriteIds((previous) =>
          previous.filter((id) => id !== placeId)
        );

        showToast(`"${place.name}" removed from favorites.`);
      } else {
        await request(`/favorites/${encodeURIComponent(place.id)}`, {
          method: 'POST',
        });

        setFavoriteIds((previous) =>
          previous.includes(placeId)
            ? previous
            : [...previous, placeId]
        );

        showToast(`"${place.name}" added to favorites.`);
      }
    } catch (error) {
      showToast(
        getErrorMessage(error, 'Could not update favorites.'),
        'error'
      );
    } finally {
      setSavingFavoriteId(null);
    }
  };

  // Open the itinerary selector for the chosen place.
  const handleOpenPlanner = (place, event) => {
    event.stopPropagation();

    if (!loggedIn) {
      requireLogin();
      return;
    }

    setSelectedPlace(place);
    loadItineraries();
  };

  // Add the selected place to the selected itinerary.
  const handleAddToItinerary = async () => {
    if (!loggedIn) {
      requireLogin();
      return;
    }

    if (!selectedPlace || !selectedItinerary) {
      showToast('Please select an itinerary.', 'warning');
      return;
    }

    setAddingPlace(true);

    try {
      const itineraryId = encodeURIComponent(selectedItinerary);

      // Get existing stops so that the next stop_order is correct.
      const result = await request(`/itineraries/${itineraryId}`);
      const existingPlaces = result.data?.places || [];

      const nextOrder =
        existingPlaces.reduce(
          (maximum, stop) =>
            Math.max(maximum, Number(stop.stop_order) || 0),
          0
        ) + 1;

      await request(`/itineraries/${itineraryId}/places`, {
        method: 'POST',
        body: JSON.stringify({
          tourist_place_id: selectedPlace.id,
          stop_order: nextOrder,
        }),
      });

      showToast(
        `"${selectedPlace.name}" added to your itinerary.`
      );

      setPlannerOpen(false);
      setSelectedPlace(null);

      if (onViewInPlanner) {
        onViewInPlanner(selectedItinerary);
      }
    } catch (error) {
      showToast(
        getErrorMessage(error, 'Could not add place to itinerary.'),
        'error'
      );
    } finally {
      setAddingPlace(false);
    }
  };

  const handleOpenDetails = (place) => {
    if (onOpenDetails) onOpenDetails(place);
  };

  const handleOpenDirections = (place, event) => {
    event.stopPropagation();

    if (onOpenDirections) {
      onOpenDirections(place);
    }
  };

  return (
    <Box
      component="section"
      sx={{ width: '100%', pb: 6 }}
      id="gridColumn"
    >
      {/* Header and sorting */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          mb: 2.5,
          px: 0.5,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Literata", Georgia, serif',
              fontWeight: 800,
              fontSize: '1.15rem',
            }}
          >
            {radarMode === 'radar'
              ? '25km Live Radar Attractions'
              : 'All Verified Attractions'}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            {places.length} of {totalInBoundary}{' '}
            {radarMode === 'radar'
              ? 'within 25km'
              : 'in boundary'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Sort by:
          </Typography>

          <FormControl size="small">
            <Select
              value={sortBy || 'name'}
              onChange={(event) =>
                onSortChange?.(event.target.value)
              }
              sx={{ minWidth: 175, borderRadius: 2 }}
            >
              <MenuItem value="distance">Shortest Distance</MenuItem>
              <MenuItem value="rating">Highest Rated</MenuItem>
              <MenuItem value="fee">Lowest Entrance Fee</MenuItem>
              <MenuItem value="name">Alphabetical</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Places grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(auto-fill, minmax(280px, 1fr))',
            lg: 'repeat(auto-fill, minmax(320px, 1fr))',
          },
          gap: { xs: 1.5, sm: 2.5 },
        }}
      >
        {places.map((place) => {
          const placeId = String(place.id);
          const isFavorite = favoriteIds.includes(placeId);
          const isSaving = savingFavoriteId === placeId;

          return (
            <Card
              key={place.id}
              onClick={() => handleOpenDetails(place)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                bgcolor:
                  theme.palette.mode === 'dark'
                    ? '#1e293b'
                    : '#ffffff',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'all 0.25s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 195,
                  overflow: 'hidden',
                }}
              >
                <CardMedia
                  component="img"
                  image={place.image || place.image_url || ''}
                  alt={place.name || 'Tourist attraction'}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />

                {/* Favorite bookmark */}
                <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                  <Tooltip
                    title={
                      isFavorite
                        ? 'Remove from Favorites'
                        : 'Add to Favorites'
                    }
                  >
                    <span>
                      <IconButton
                        onClick={(event) =>
                          handleFavoriteClick(place, event)
                        }
                        disabled={isSaving || loadingFavorites}
                        aria-label={
                          isFavorite
                            ? 'Remove from Favorites'
                            : 'Add to Favorites'
                        }
                        sx={{
                          width: 44,
                          height: 44,
                          bgcolor: isFavorite
                            ? 'primary.main'
                            : 'rgba(0,0,0,0.65)',
                          color: '#fff',
                          '&:hover': {
                            bgcolor: 'primary.dark',
                          },
                        }}
                      >
                        {isSaving ? (
                          <CircularProgress
                            size={19}
                            color="inherit"
                          />
                        ) : isFavorite ? (
                          <BookmarkIcon />
                        ) : (
                          <BookmarkBorderIcon />
                        )}
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>
              </Box>

              <CardContent sx={{ p: 2.25, flexGrow: 1 }}>
                <Typography
                  variant="caption"
                  color="primary.main"
                  fontWeight={700}
                >
                  {place.category_name ||
                    place.categoryLabel ||
                    'Tourist Attraction'}
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: '"Literata", Georgia, serif',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    mt: 0.75,
                    mb: 1,
                  }}
                >
                  {place.name}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {place.description || 'Explore this tourist attraction.'}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 1,
                    pt: 1.25,
                    borderTop: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <AccessTimeIcon
                      sx={{ fontSize: 15, color: 'text.secondary' }}
                    />
                    <Typography variant="caption">
                      {place.bestTime || 'Daylight Hours'}
                    </Typography>
                  </Box>

                  <Typography variant="caption" fontWeight={700}>
                    Fee: {place.fee || place.entranceFee || 'Free'}
                  </Typography>
                </Box>
              </CardContent>

              <CardActions
                sx={{
                  px: 2.25,
                  pb: 2.25,
                  pt: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  gap: 1,
                }}
              >
                {/* Separate itinerary action */}
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<AddLocationAltIcon />}
                  onClick={(event) =>
                    handleOpenPlanner(place, event)
                  }
                  sx={{
                    minHeight: 44,
                    fontWeight: 700,
                    textTransform: 'none',
                    borderRadius: 2.5,
                  }}
                >
                  Add to Itinerary
                </Button>

                <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="inherit"
                    startIcon={<DirectionsIcon />}
                    onClick={(event) =>
                      handleOpenDirections(place, event)
                    }
                    sx={{
                      minHeight: 44,
                      textTransform: 'none',
                      borderRadius: 2.5,
                    }}
                  >
                    Directions
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    endIcon={<ArrowForwardIcon />}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleOpenDetails(place);
                    }}
                    sx={{
                      minHeight: 44,
                      textTransform: 'none',
                      borderRadius: 2.5,
                    }}
                  >
                    Details
                  </Button>
                </Box>
              </CardActions>
            </Card>
          );
        })}
      </Box>

      {/* Select an existing itinerary */}
      <Dialog
        open={plannerOpen}
        onClose={() => {
          if (!addingPlace) {
            setPlannerOpen(false);
            setSelectedPlace(null);
          }
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add place to itinerary</DialogTitle>

        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Place: {selectedPlace?.name || ''}
          </Typography>

          {itineraries.length === 0 ? (
            <Alert severity="info">
              You do not have an itinerary yet. Create one first from
              your Itinerary Planner.
            </Alert>
          ) : (
            <FormControl fullWidth sx={{ mt: 1 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Select your trip
              </Typography>

              <Select
                value={selectedItinerary}
                onChange={(event) =>
                  setSelectedItinerary(event.target.value)
                }
                disabled={addingPlace}
                displayEmpty
              >
                {itineraries.map((itinerary) => (
                  <MenuItem
                    key={itinerary.id}
                    value={String(itinerary.id)}
                  >
                    {itinerary.title}
                    {itinerary.trip_date
                      ? ` — ${String(itinerary.trip_date).slice(0, 10)}`
                      : ''}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              setPlannerOpen(false);
              setSelectedPlace(null);
            }}
            disabled={addingPlace}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleAddToItinerary}
            disabled={
              addingPlace ||
              loadingItineraries ||
              itineraries.length === 0 ||
              !selectedItinerary
            }
          >
            {addingPlace ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              'Add Place'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success and error messages */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={() =>
          setToast((previous) => ({ ...previous, open: false }))
        }
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          onClose={() =>
            setToast((previous) => ({ ...previous, open: false }))
          }
          sx={{ borderRadius: 2 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PlacesGrid;
