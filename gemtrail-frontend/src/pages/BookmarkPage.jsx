
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
  IconButton,
  Snackbar,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';

import {
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  ArrowForward as ArrowForwardIcon,
  AccessTime as AccessTimeIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
).replace(/\/+$/, '');

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

// Supports common API response formats.
const getFavoriteRows = (result) => {
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.favorites)) return result.favorites;
  if (Array.isArray(result?.data?.favorites)) {
    return result.data.favorites;
  }
  return [];
};

// Convert a favorite record into a place object.
const getPlaceFromFavorite = (favorite) => {
  const place =
    favorite?.place ??
    favorite?.touristPlace ??
    favorite?.tourist_place ??
    favorite?.touristPlaceDetails ??
    favorite?.tourist_place_details ??
    favorite;

  const id =
    favorite?.tourist_place_id ??
    favorite?.place_id ??
    favorite?.touristPlaceId ??
    place?.id;

  if (id === null || id === undefined || id === '') return null;

  return {
    ...place,
    id,
    name: place?.name ?? favorite?.place_name ?? 'Unnamed Place',
    image:
      place?.image ??
      place?.image_url ??
      place?.cover_image ??
      place?.thumbnail ??
      '',
    description: place?.description ?? '',
    category_name:
      place?.category_name ??
      place?.categoryLabel ??
      place?.category?.name ??
      'Tourist Attraction',
    fee: place?.fee ?? place?.entranceFee ?? place?.entrance_fee ?? 'Free',
    bestTime: place?.bestTime ?? place?.best_time ?? 'Daylight Hours',
  };
};

export const BookmarkPage = ({
  authToken,
  user,
  isAuthenticated,
  onLoginRequired,
  onOpenDetails,
  onOpenDirections,
}) => {
  const theme = useTheme();

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState('');
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

  const loadBookmarks = useCallback(async () => {
    if (!loggedIn || !token) {
      setPlaces([]);
      setLoading(false);
      setError('');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/favorites`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result?.success === false) {
        throw new Error(
          result?.message || 'Failed to load bookmarked places.'
        );
      }

      const loadedPlaces = getFavoriteRows(result)
        .map(getPlaceFromFavorite)
        .filter(Boolean);

      // Prevent duplicate place cards.
      const uniquePlaces = [
        ...new Map(
          loadedPlaces.map((place) => [String(place.id), place])
        ).values(),
      ];

      setPlaces(uniquePlaces);
    } catch (err) {
      console.error('Loading bookmarks failed:', err);
      setError(err.message || 'Could not load bookmarks.');
    } finally {
      setLoading(false);
    }
  }, [loggedIn, token]);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  const handleRemoveBookmark = async (place, event) => {
    event?.stopPropagation();

    if (!token || !loggedIn) {
      if (onLoginRequired) {
        onLoginRequired();
      } else {
        window.location.assign('/login');
      }
      return;
    }

    if (removingId !== null) return;

    setRemovingId(String(place.id));

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/favorites/${encodeURIComponent(place.id)}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result?.success === false) {
        throw new Error(
          result?.message || 'Failed to remove bookmark.'
        );
      }

      // Remove the card only after the server confirms success.
      setPlaces((previous) =>
        previous.filter((item) => String(item.id) !== String(place.id))
      );

      showToast(`"${place.name}" removed from bookmarks.`);
    } catch (err) {
      console.error('Removing bookmark failed:', err);
      showToast(err.message || 'Could not remove bookmark.', 'error');
    } finally {
      setRemovingId(null);
    }
  };

  if (!loggedIn || !token) {
    return (
      <Box sx={{ maxWidth: 900, mx: 'auto', p: { xs: 2, sm: 4 } }}>
        <Alert
          severity="info"
          action={
            <Button
              color="inherit"
              onClick={() => {
                if (onLoginRequired) {
                  onLoginRequired();
                } else {
                  window.location.assign('/login');
                }
              }}
            >
              Login
            </Button>
          }
        >
          Please log in to view your bookmarked places.
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        width: '100%',
        maxWidth: 1400,
        mx: 'auto',
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 3, sm: 4 },
        pb: 6,
      }}
    >
      {/* Page heading */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BookmarkIcon color="primary" sx={{ fontSize: 30 }} />
            <Typography
              variant="h4"
              sx={{
                fontFamily: '"Literata", Georgia, serif',
                fontWeight: 800,
                fontSize: { xs: '1.65rem', sm: '2rem' },
              }}
            >
              My Bookmarks
            </Typography>
          </Box>

          <Typography color="text.secondary" sx={{ mt: 0.75 }}>
            Your saved places, all in one place.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadBookmarks}
          disabled={loading}
          sx={{
            alignSelf: { xs: 'flex-start', sm: 'center' },
            borderRadius: 2,
            textTransform: 'none',
            minHeight: 42,
          }}
        >
          Refresh
        </Button>
      </Box>

      {/* Bookmark count */}
      {!loading && !error && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2.5 }}
        >
          {places.length} saved {places.length === 1 ? 'place' : 'places'}
        </Typography>
      )}

      {/* Loading state */}
      {loading && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 10,
            gap: 2,
          }}
        >
          <CircularProgress />
          <Typography color="text.secondary">
            Loading your bookmarks...
          </Typography>
        </Box>
      )}

      {/* Error state */}
      {!loading && error && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" onClick={loadBookmarks}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Empty state */}
      {!loading && !error && places.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: { xs: 7, sm: 10 },
            px: 2,
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 4,
          }}
        >
          <BookmarkBorderIcon
            sx={{ fontSize: 64, color: 'text.disabled', mb: 1 }}
          />

          <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
            No bookmarks yet
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ maxWidth: 420, mx: 'auto', mb: 3 }}
          >
            Explore attractions and tap the bookmark icon to save places
            you would like to visit.
          </Typography>

          <Button
            variant="contained"
            onClick={() => {
              window.location.assign('/');
            }}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Explore Places
          </Button>
        </Box>
      )}

      {/* Responsive bookmark grid */}
      {!loading && !error && places.length > 0 && (
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
            const isRemoving = removingId === String(place.id);

            return (
              <Card
                key={place.id}
                onClick={() => onOpenDetails?.(place)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: onOpenDetails ? 'pointer' : 'default',
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
                    height: 195,
                    overflow: 'hidden',
                  }}
                >
                  <CardMedia
                    component="img"
                    image={place.image || '/placeholder-place.jpg'}
                    alt={place.name}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />

                  <Tooltip title="Remove from bookmarks">
                    <span>
                      <IconButton
                        onClick={(event) =>
                          handleRemoveBookmark(place, event)
                        }
                        disabled={isRemoving || removingId !== null}
                        aria-label={`Remove ${place.name} from bookmarks`}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          width: 44,
                          height: 44,
                          bgcolor: 'primary.main',
                          color: '#fff',
                          '&:hover': { bgcolor: 'primary.dark' },
                        }}
                      >
                        {isRemoving ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <BookmarkIcon />
                        )}
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>

                <CardContent sx={{ p: 2.25, flexGrow: 1 }}>
                  <Typography
                    variant="caption"
                    color="primary.main"
                    fontWeight={700}
                  >
                    {place.category_name}
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
                      minHeight: '2.5em',
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
                        {place.bestTime}
                      </Typography>
                    </Box>

                    <Typography variant="caption" fontWeight={700}>
                      Fee: {place.fee}
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions sx={{ px: 2.25, pb: 2.25, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    endIcon={<ArrowForwardIcon />}
                    onClick={(event) => {
                      event.stopPropagation();
                      onOpenDetails?.(place);
                    }}
                    sx={{
                      minHeight: 44,
                      textTransform: 'none',
                      borderRadius: 2.5,
                    }}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            );
          })}
        </Box>
      )}

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

export default BookmarkPage;
