import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import {
  CalendarMonth,
  Delete,
  EditOutlined,
  ExpandLess,
  ExpandMore,
  MapOutlined,
  Close,
  Add,
} from '@mui/icons-material';

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:5000/'
).replace(/\/+$/, '');

const API_URL = `${API_BASE_URL}/api/itineraries`;
const TOURIST_PLACES_URL = `${API_BASE_URL}/api/places`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const money = (value) => {
  if (value === null || value === undefined || value === '') {
    return 'LKR 0.00';
  }

  const amount = Number(value);
  if (!Number.isFinite(amount)) {
    return 'LKR 0.00';
  }

  return `LKR ${amount.toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const dateValue = (value) => {
  if (!value) return '';
  return String(value).slice(0, 10);
};

const formatDate = (value) => {
  if (!value) return 'Date not set';
  const date = new Date(`${dateValue(value)}T00:00:00`);
  if (Number.isNaN(date.getTime())) return 'Date not set';

  return date.toLocaleDateString('en-LK', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const extractList = (result) => {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.places)) return result.places;
  if (Array.isArray(result?.itineraries)) return result.itineraries;
  if (Array.isArray(result?.data)) return result.data;
  return [];
};

const extractObject = (result) => {
  if (result?.data && !Array.isArray(result.data)) {
    return result.data;
  }
  return result;
};

export default function AllItineraryPlans({
  onOpenDetails,
  onOpenDirections,
}) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  const [expandedId, setExpandedId] = useState(null);

  // Add-place dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState('');
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [addingPlace, setAddingPlace] = useState(false);

  // Stop edit state
  const [editingStop, setEditingStop] = useState(null);
  const [savingStop, setSavingStop] = useState(false);
  const [placeForm, setPlaceForm] = useState({
    estimated_cost: '',
    start_time: '',
    end_time: '',
    notes: '',
  });

  const [removingStopId, setRemovingStopId] = useState(null);

  const request = useCallback(async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok || result.success === false) {
      throw new Error(
        result.message ||
          `Request failed (${response.status} ${response.statusText}).`
      );
    }

    return result;
  }, []);

  const loadPlans = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await request(API_URL);
      const list = extractList(response);

      const detailedPlans = await Promise.all(
        list.map(async (plan) => {
          try {
            const detailResponse = await request(`${API_URL}/${plan.id}`);
            const detail = extractObject(detailResponse);

            return {
              ...plan,
              ...detail,
              places: Array.isArray(detail?.places) ? detail.places : [],
            };
          } catch (err) {
            return {
              ...plan,
              places: [],
              placesLoadError: err.message,
            };
          }
        })
      );

      setPlans(detailedPlans);
    } catch (err) {
      setError(
        err.message ||
          'Could not load itineraries. Check the API URL and authentication.'
      );
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const startEdit = (plan) => {
    setEditingId(plan.id);
    setError('');
    setNotice('');
    setEditValues({
      trip_date: dateValue(plan.trip_date),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  const saveEdit = async (plan) => {
    setSavingId(plan.id);
    setError('');
    setNotice('');

    try {
      await request(`${API_URL}/${plan.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          trip_date: editValues.trip_date || null,
        }),
      });

      setEditingId(null);
      setEditValues({});
      await loadPlans();
      setNotice('Itinerary date updated successfully.');
    } catch (err) {
      setError(err.message || 'Could not update itinerary.');
    } finally {
      setSavingId(null);
    }
  };

  const deletePlan = async (plan) => {
    const confirmed = window.confirm(
      `Delete "${plan.title || 'this itinerary'}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    setError('');
    setNotice('');

    try {
      await request(`${API_URL}/${plan.id}`, {
        method: 'DELETE',
      });

      setPlans((current) => current.filter((item) => item.id !== plan.id));
      if (expandedId === plan.id) setExpandedId(null);
      if (editingId === plan.id) cancelEdit();

      setNotice('Itinerary deleted successfully.');
    } catch (err) {
      setError(err.message || 'Could not delete itinerary.');
    }
  };

  const openAddPlaceDialog = async (plan) => {
    setSelectedPlan(plan);
    setSelectedPlaceId('');
    setAvailablePlaces([]);
    setPlaceForm({ estimated_cost: '', start_time: '', end_time: '', notes: '' });
    setError('');
    setNotice('');
    setAddDialogOpen(true);
    setLoadingPlaces(true);

    try {
      const response = await request(TOURIST_PLACES_URL);
      const places = extractList(response);
      setAvailablePlaces(places);
    } catch (err) {
      setError(`Could not load tourist places. ${err.message}`);
    } finally {
      setLoadingPlaces(false);
    }
  };

  const closeAddPlaceDialog = () => {
    if (addingPlace) return;
    setAddDialogOpen(false);
    setSelectedPlan(null);
    setSelectedPlaceId('');
    setPlaceForm({ estimated_cost: '', start_time: '', end_time: '', notes: '' });
  };

  const addPlaceToPlan = async () => {
    if (!selectedPlan || !selectedPlaceId) {
      setError('Please select a tourist place.');
      return;
    }

    setAddingPlace(true);
    setError('');
    setNotice('');

    try {
      await request(`${API_URL}/${selectedPlan.id}/places`, {
        method: 'POST',
        body: JSON.stringify({
          tourist_place_id: Number(selectedPlaceId),
          visit_date: dateValue(selectedPlan.trip_date) || null,
          estimated_cost:
            placeForm.estimated_cost === '' ? 0 : Number(placeForm.estimated_cost),
          start_time: placeForm.start_time || null,
          end_time: placeForm.end_time || null,
          notes: placeForm.notes.trim() || null,
        }),
      });

      const planId = selectedPlan.id;
      setAddDialogOpen(false);
      setSelectedPlan(null);
      setSelectedPlaceId('');
      setPlaceForm({ estimated_cost: '', start_time: '', end_time: '', notes: '' });
      setExpandedId(planId);

      await loadPlans();
      setNotice('Place added and itinerary estimated cost updated.');
    } catch (err) {
      setError(err.message || 'Could not add place to itinerary.');
    } finally {
      setAddingPlace(false);
    }
  };

  const openEditStop = (plan, place) => {
    setEditingStop({ plan, place });
    setPlaceForm({
      estimated_cost:
        place.estimated_cost !== null && place.estimated_cost !== undefined
          ? String(place.estimated_cost)
          : '',
      start_time: place.start_time ? String(place.start_time).slice(0, 5) : '',
      end_time: place.end_time ? String(place.end_time).slice(0, 5) : '',
      notes: place.stop_notes ?? place.notes ?? '',
    });
    setError('');
    setNotice('');
  };

  const saveStop = async () => {
    if (!editingStop) return;
    const { plan, place } = editingStop;
    const stopId = place.itinerary_place_id;

    if (!stopId) {
      setError('Could not identify itinerary stop ID.');
      return;
    }

    if (
      placeForm.estimated_cost !== '' &&
      (!Number.isFinite(Number(placeForm.estimated_cost)) ||
        Number(placeForm.estimated_cost) < 0)
    ) {
      setError('Estimated cost must be a non-negative number.');
      return;
    }

    if (
      placeForm.start_time &&
      placeForm.end_time &&
      placeForm.end_time <= placeForm.start_time
    ) {
      setError('End time must be later than start time.');
      return;
    }

    setSavingStop(true);
    setError('');
    setNotice('');

    try {
      await request(`${API_URL}/${plan.id}/places/${stopId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          estimated_cost:
            placeForm.estimated_cost === '' ? 0 : Number(placeForm.estimated_cost),
          start_time: placeForm.start_time || null,
          end_time: placeForm.end_time || null,
          notes: placeForm.notes.trim() || null,
        }),
      });

      setEditingStop(null);
      setPlaceForm({ estimated_cost: '', start_time: '', end_time: '', notes: '' });
      await loadPlans();
      setExpandedId(plan.id);
      setNotice('Place details and total estimated cost updated.');
    } catch (err) {
      setError(err.message || 'Could not update stop details.');
    } finally {
      setSavingStop(false);
    }
  };

  const removePlaceFromPlan = async (plan, place) => {
    const stopId = place.itinerary_place_id;
    if (!stopId) {
      setError('Could not identify itinerary stop ID.');
      return;
    }

    const confirmed = window.confirm(
      `Remove "${place.name || 'this place'}" from this itinerary?`
    );
    if (!confirmed) return;

    setRemovingStopId(stopId);
    setError('');
    setNotice('');

    try {
      await request(`${API_URL}/${plan.id}/places/${stopId}`, {
        method: 'DELETE',
      });

      setExpandedId(plan.id);
      await loadPlans();
      setNotice(
        `${place.name || 'Place'} removed and total cost recalculated.`
      );
    } catch (err) {
      setError(err.message || 'Could not remove place.');
    } finally {
      setRemovingStopId(null);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
      {/* Header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ sm: 'center' }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Stack direction="row" alignItems="center" spacing={1}>
            <CalendarMonth color="warning" />
            <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: 1 }}>
              GEMTRAIL · RATNAPURA
            </Typography>
          </Stack>

          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Literata", Georgia, serif',
              fontWeight: 800,
              mt: 0.5,
            }}
          >
            My Itinerary Plans
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1 }}>
            View your trips, destinations, and auto-calculated estimated total costs.
          </Typography>
        </Box>

        <Button variant="outlined" onClick={loadPlans} disabled={loading}>
          Refresh Plans
        </Button>
      </Stack>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {notice && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setNotice('')}>
          {notice}
        </Alert>
      )}

      {/* Plans List */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : plans.length === 0 ? (
        <Card
          variant="outlined"
          sx={{ borderRadius: 3, textAlign: 'center', p: 4 }}
        >
          <MapOutlined sx={{ fontSize: 48, color: 'text.secondary' }} />
          <Typography variant="h6" sx={{ mt: 2, fontWeight: 700 }}>
            No itinerary plans yet
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Create and save an itinerary to view it here.
          </Typography>
        </Card>
      ) : (
        <Stack spacing={3}>
          {plans.map((plan) => {
            const isEditing = editingId === plan.id;
            const isExpanded = expandedId === plan.id;
            const places = plan.places || [];

            return (
              <Card
                key={plan.id}
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: 2 },
                }}
              >
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    spacing={2}
                  >
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        flexWrap="wrap"
                        useFlexGap
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 800,
                            fontFamily: '"Literata", Georgia, serif',
                          }}
                        >
                          {plan.title || 'Untitled itinerary'}
                        </Typography>

                        <Chip
                          size="small"
                          label={plan.status || 'draft'}
                          color={
                            plan.status === 'completed'
                              ? 'success'
                              : plan.status === 'saved'
                              ? 'primary'
                              : 'default'
                          }
                        />
                      </Stack>

                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{ mt: 1 }}
                      >
                        <CalendarMonth fontSize="small" color="warning" />
                        <Typography color="text.secondary" variant="body2">
                          {formatDate(plan.trip_date)}
                        </Typography>
                      </Stack>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        {places.length} destination
                        {places.length === 1 ? '' : 's'}
                        {plan.start_location
                          ? ` · Starting at ${plan.start_location}`
                          : ''}
                      </Typography>
                    </Box>

                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={0.5}
                      justifyContent="flex-end"
                      flexWrap="wrap"
                    >
                      <IconButton
                        aria-label="Edit trip date"
                        title="Edit trip date"
                        onClick={() =>
                          isEditing ? cancelEdit() : startEdit(plan)
                        }
                      >
                        {isEditing ? <Close /> : <EditOutlined />}
                      </IconButton>

                      <IconButton
                        aria-label="Delete itinerary"
                        title="Delete itinerary"
                        color="error"
                        onClick={() => deletePlan(plan)}
                      >
                        <Delete />
                      </IconButton>

                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={() => openAddPlaceDialog(plan)}
                      >
                        Add Place
                      </Button>

                      <Button
                        size="small"
                        endIcon={
                          isExpanded ? <ExpandLess /> : <ExpandMore />
                        }
                        onClick={() =>
                          setExpandedId(isExpanded ? null : plan.id)
                        }
                      >
                        {isExpanded ? 'Hide places' : 'View places'}
                      </Button>
                    </Stack>
                  </Stack>

                  <Divider sx={{ my: 2.5 }} />

                  {/* Trip Date & Total Estimated Cost */}
                  {isEditing ? (
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr auto' },
                        gap: 2,
                        alignItems: 'center',
                      }}
                    >
                      <TextField
                        label="Trip date"
                        type="date"
                        size="small"
                        value={editValues.trip_date || ''}
                        onChange={(event) =>
                          setEditValues((prev) => ({
                            ...prev,
                            trip_date: event.target.value,
                          }))
                        }
                        slotProps={{ inputLabel: { shrink: true } }}
                        fullWidth
                      />

                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="contained"
                          startIcon={
                            savingId === plan.id ? (
                              <CircularProgress size={16} color="inherit" />
                            ) : (
                              <EditOutlined />
                            )
                          }
                          disabled={savingId === plan.id}
                          onClick={() => saveEdit(plan)}
                        >
                          Save
                        </Button>

                        <Button
                          onClick={cancelEdit}
                          disabled={savingId === plan.id}
                        >
                          Cancel
                        </Button>
                      </Stack>
                    </Box>
                  ) : (
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      justifyContent="space-between"
                      spacing={2}
                    >
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Trip date
                        </Typography>
                        <Typography fontWeight={700}>
                          {formatDate(plan.trip_date)}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Estimated total cost
                        </Typography>
                        <Typography
                          variant="h6"
                          color="warning.dark"
                          fontWeight={800}
                        >
                          {money(plan.estimated_cost)}
                        </Typography>
                      </Box>
                    </Stack>
                  )}

                  {/* Expandable Place List */}
                  <Collapse in={isExpanded} timeout="auto">
                    <Divider sx={{ my: 2.5 }} />

                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      alignItems={{ sm: 'center' }}
                      justifyContent="space-between"
                      spacing={1}
                      sx={{ mb: 2 }}
                    >
                      <Typography variant="subtitle1" fontWeight={800}>
                        Day itinerary
                      </Typography>

                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => openAddPlaceDialog(plan)}
                      >
                        Add Place
                      </Button>
                    </Stack>

                    {places.length === 0 ? (
                      <Box
                        sx={{
                          textAlign: 'center',
                          py: 3,
                          px: 2,
                          borderRadius: 2,
                          bgcolor: 'action.hover',
                        }}
                      >
                        <MapOutlined
                          sx={{ fontSize: 36, color: 'text.secondary' }}
                        />
                        <Typography sx={{ mt: 1 }} fontWeight={700}>
                          No places added yet
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5, mb: 2 }}
                        >
                          Add a tourist destination to this itinerary.
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<Add />}
                          onClick={() => openAddPlaceDialog(plan)}
                        >
                          Add First Place
                        </Button>
                      </Box>
                    ) : (
                      <Stack spacing={1.5}>
                        {places.map((place, index) => (
                          <Box
                            key={
                              place.itinerary_place_id ||
                              place.id ||
                              `${plan.id}-${index}`
                            }
                            sx={{
                              display: 'flex',
                              flexDirection: { xs: 'column', sm: 'row' },
                              gap: 2,
                              alignItems: { xs: 'stretch', sm: 'flex-start' },
                              p: 2,
                              borderRadius: 2,
                              bgcolor: 'action.hover',
                            }}
                          >
                            <Box
                              sx={{
                                minWidth: 34,
                                width: 34,
                                height: 34,
                                borderRadius: '50%',
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                                display: 'grid',
                                placeItems: 'center',
                                fontWeight: 800,
                              }}
                            >
                              {index + 1}
                            </Box>

                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography fontWeight={800}>
                                {place.name || 'Unnamed place'}
                              </Typography>

                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {place.category_name || 'Tourist attraction'}
                                {place.start_time
                                  ? ` · ${String(place.start_time).slice(0, 5)}`
                                  : ''}
                                {place.end_time
                                  ? ` – ${String(place.end_time).slice(0, 5)}`
                                  : ''}
                              </Typography>

                              <Typography
                                variant="body2"
                                sx={{ mt: 0.5, fontWeight: 600 }}
                              >
                                Stop estimated cost:{' '}
                                {money(place.estimated_cost)}
                              </Typography>

                              {place.entrance_fee && (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Standard entrance fee: {place.entrance_fee}
                                </Typography>
                              )}

                              {(place.stop_notes || place.notes) && (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mt: 0.5 }}
                                >
                                  {place.stop_notes || place.notes}
                                </Typography>
                              )}
                            </Box>

                            <Stack
                              direction="row"
                              spacing={0.5}
                              flexWrap="wrap"
                              useFlexGap
                            >
                              <Button
                                size="small"
                                startIcon={<EditOutlined />}
                                onClick={() => openEditStop(plan, place)}
                              >
                                Edit
                              </Button>

                              {onOpenDetails && (
                                <Button
                                  size="small"
                                  onClick={() => onOpenDetails(place)}
                                >
                                  Details
                                </Button>
                              )}

                              {onOpenDirections && (
                                <Button
                                  size="small"
                                  onClick={() => onOpenDirections(place)}
                                >
                                  Directions
                                </Button>
                              )}

                              <Button
                                size="small"
                                color="error"
                                startIcon={
                                  removingStopId === place.itinerary_place_id ? (
                                    <CircularProgress
                                      size={14}
                                      color="inherit"
                                    />
                                  ) : (
                                    <Delete />
                                  )
                                }
                                disabled={
                                  removingStopId === place.itinerary_place_id
                                }
                                onClick={() =>
                                  removePlaceFromPlan(plan, place)
                                }
                              >
                                {removingStopId === place.itinerary_place_id
                                  ? 'Removing...'
                                  : 'Remove'}
                              </Button>
                            </Stack>
                          </Box>
                        ))}
                      </Stack>
                    )}

                    {plan.notes && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" fontWeight={800}>
                          Notes
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {plan.notes}
                        </Typography>
                      </Box>
                    )}
                  </Collapse>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}

      {/* Edit Stop Dialog */}
      <Dialog
        open={Boolean(editingStop)}
        onClose={() => !savingStop && setEditingStop(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit itinerary place</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {editingStop?.place?.name || 'Update place details'}
          </Typography>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Estimated cost (LKR)"
              type="number"
              value={placeForm.estimated_cost}
              onChange={(event) =>
                setPlaceForm((prev) => ({
                  ...prev,
                  estimated_cost: event.target.value,
                }))
              }
              slotProps={{ htmlInput: { min: 0, step: '0.01' } }}
              fullWidth
              helperText="The itinerary total will recalculate to include this stop's cost."
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Start time"
                type="time"
                value={placeForm.start_time}
                onChange={(event) =>
                  setPlaceForm((prev) => ({
                    ...prev,
                    start_time: event.target.value,
                  }))
                }
                slotProps={{ inputLabel: { shrink: true } }}
                fullWidth
              />
              <TextField
                label="End time"
                type="time"
                value={placeForm.end_time}
                onChange={(event) =>
                  setPlaceForm((prev) => ({
                    ...prev,
                    end_time: event.target.value,
                  }))
                }
                slotProps={{ inputLabel: { shrink: true } }}
                fullWidth
              />
            </Stack>
            <TextField
              label="Notes"
              value={placeForm.notes}
              onChange={(event) =>
                setPlaceForm((prev) => ({
                  ...prev,
                  notes: event.target.value,
                }))
              }
              multiline
              minRows={2}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setEditingStop(null)}
            disabled={savingStop}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={saveStop}
            disabled={savingStop}
            startIcon={
              savingStop ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <EditOutlined />
              )
            }
          >
            {savingStop ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Place Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={closeAddPlaceDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add a place to your itinerary</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {selectedPlan?.title || 'Select a tourist place'}
          </Typography>

          {loadingPlaces ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel id="tourist-place-label">Tourist place</InputLabel>
              <Select
                labelId="tourist-place-label"
                label="Tourist place"
                value={selectedPlaceId}
                onChange={(event) => setSelectedPlaceId(event.target.value)}
              >
                {(() => {
                  const currentPlan = plans.find(
                    (plan) => plan.id === selectedPlan?.id
                  );
                  const currentPlaceIds = new Set(
                    (currentPlan?.places || []).map((p) =>
                      Number(p.tourist_place_id ?? p.id)
                    )
                  );
                  const selectablePlaces = availablePlaces.filter(
                    (p) => !currentPlaceIds.has(Number(p.id))
                  );

                  return selectablePlaces.map((place) => (
                    <MenuItem key={place.id} value={String(place.id)}>
                      {place.name || `Place ${place.id}`}
                      {place.category_name
                        ? ` — ${place.category_name}`
                        : ''}
                    </MenuItem>
                  ));
                })()}
              </Select>
            </FormControl>
          )}

          {!loadingPlaces && (
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                label="Estimated cost (LKR)"
                type="number"
                value={placeForm.estimated_cost}
                onChange={(event) =>
                  setPlaceForm((prev) => ({
                    ...prev,
                    estimated_cost: event.target.value,
                  }))
                }
                slotProps={{ htmlInput: { min: 0, step: '0.01' } }}
                fullWidth
                helperText="Cost will be added to the total itinerary cost."
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Start time"
                  type="time"
                  value={placeForm.start_time}
                  onChange={(event) =>
                    setPlaceForm((prev) => ({
                      ...prev,
                      start_time: event.target.value,
                    }))
                  }
                  slotProps={{ inputLabel: { shrink: true } }}
                  fullWidth
                />
                <TextField
                  label="End time"
                  type="time"
                  value={placeForm.end_time}
                  onChange={(event) =>
                    setPlaceForm((prev) => ({
                      ...prev,
                      end_time: event.target.value,
                    }))
                  }
                  slotProps={{ inputLabel: { shrink: true } }}
                  fullWidth
                />
              </Stack>
              <TextField
                label="Notes"
                value={placeForm.notes}
                onChange={(event) =>
                  setPlaceForm((prev) => ({
                    ...prev,
                    notes: event.target.value,
                  }))
                }
                multiline
                minRows={2}
                fullWidth
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={closeAddPlaceDialog} disabled={addingPlace}>
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={
              addingPlace ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <Add />
              )
            }
            onClick={addPlaceToPlan}
            disabled={loadingPlaces || addingPlace || !selectedPlaceId}
          >
            {addingPlace ? 'Adding...' : 'Add Place'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}