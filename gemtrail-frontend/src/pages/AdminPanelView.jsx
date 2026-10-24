import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

import {
  Add as AddIcon,
  Delete as DeleteIcon,
  EditOutlined as EditIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  VisibilityOutlined as ViewIcon,
  Close as CloseIcon,
  Place as PlaceIcon,
  Star as StarIcon,
} from '@mui/icons-material';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const EMPTY_PLACE = {
  category_id: '',
  name: '',
  short_description: '',
  description: '',
  location: '',
  latitude: '',
  longitude: '',
  opening_hours: '',
  entrance_fee: '',
  transport_info: '',
  travel_time: '',
  visit_duration: '',
  rating: '',
  district: 'Ratnapura',
  image_url: '',
  secondary_image_url: '',
  best_time: '',
  contact: '',
  elevation_meters: '',
  mining_context: '',
  visiting_tips: '',
  is_active: true,
};

const FIELD_GROUPS = [
  {
    title: 'Basic Information',
    fields: [
      { name: 'name', label: 'Place Name', required: true, full: true },
      {
        name: 'category_id',
        label: 'Category',
        type: 'category',
        required: true,
      },
      { name: 'district', label: 'District' },
      {
        name: 'short_description',
        label: 'Short Description',
        multiline: true,
        full: true,
      },
      {
        name: 'description',
        label: 'Full Description',
        multiline: true,
        rows: 3,
        full: true,
      },
    ],
  },
  {
    title: 'Location Details',
    fields: [
      { name: 'location', label: 'Address / Location', full: true },
      { name: 'latitude', label: 'Latitude', type: 'number' },
      { name: 'longitude', label: 'Longitude', type: 'number' },
      { name: 'elevation_meters', label: 'Elevation (meters)', type: 'number' },
    ],
  },
  {
    title: 'Visiting Information',
    fields: [
      { name: 'opening_hours', label: 'Opening Hours' },
      { name: 'entrance_fee', label: 'Entrance Fee' },
      { name: 'travel_time', label: 'Travel Time' },
      { name: 'visit_duration', label: 'Recommended Visit Duration' },
      { name: 'best_time', label: 'Best Time to Visit' },
      { name: 'contact', label: 'Contact Information' },
      { name: 'transport_info', label: 'Transport Information', full: true },
      {
        name: 'mining_context',
        label: 'Mining / Cultural Context',
        multiline: true,
        full: true,
      },
      {
        name: 'visiting_tips',
        label: 'Visiting Tips (one tip per line)',
        multiline: true,
        rows: 3,
        full: true,
      },
    ],
  },
  {
    title: 'Images and Rating',
    fields: [
      { name: 'image_url', label: 'Main Image URL', full: true },
      { name: 'secondary_image_url', label: 'Secondary Image URL', full: true },
      { name: 'rating', label: 'Rating (0–5)', type: 'number' },
    ],
  },
];

function normalizePlace(place = {}) {
  return {
    ...EMPTY_PLACE,
    ...place,
    id: place.id,
    category_id: place.category_id ?? place.categoryId ?? '',
    short_description: place.short_description ?? place.shortDescription ?? '',
    opening_hours: place.opening_hours ?? place.openingHours ?? '',
    entrance_fee: place.entrance_fee ?? place.entranceFee ?? '',
    transport_info: place.transport_info ?? place.transportInfo ?? '',
    travel_time: place.travel_time ?? place.travelTime ?? '',
    visit_duration: place.visit_duration ?? place.visitDuration ?? '',
    image_url: place.image_url ?? place.imageUrl ?? '',
    secondary_image_url:
      place.secondary_image_url ?? place.secondaryImageUrl ?? '',
    best_time: place.best_time ?? place.bestTime ?? '',
    elevation_meters: place.elevation_meters ?? place.elevationMeters ?? '',
    mining_context: place.mining_context ?? place.miningContext ?? '',
    visiting_tips: Array.isArray(place.visiting_tips)
      ? place.visiting_tips.join('\n')
      : Array.isArray(place.visitingTips)
        ? place.visitingTips.join('\n')
        : typeof (place.visiting_tips ?? place.visitingTips) === 'string'
          ? (place.visiting_tips ?? place.visitingTips)
          : '',
    is_active:
      place.is_active === undefined
        ? place.isActive === undefined
          ? true
          : Boolean(place.isActive)
        : Boolean(place.is_active),
  };
}

function unwrapList(data, key) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function buildPayload(form) {
  const numericFields = [
    'category_id',
    'latitude',
    'longitude',
    'rating',
    'elevation_meters',
  ];

  const payload = { ...form };

  delete payload.id;
  delete payload.created_at;
  delete payload.updated_at;
  delete payload.createdAt;
  delete payload.updatedAt;

  numericFields.forEach((field) => {
    if (payload[field] === '' || payload[field] === null) {
      payload[field] = null;
    } else if (payload[field] !== undefined) {
      payload[field] = Number(payload[field]);
    }
  });

  payload.visiting_tips = payload.visiting_tips
    ? payload.visiting_tips
        .split('\n')
        .map((tip) => tip.trim())
        .filter(Boolean)
    : [];

  payload.is_active = Boolean(payload.is_active);

  return payload;
}

export default function AdminPanelView({
  places: initialPlaces,
  onUpdatePlaces,
}) {
  const [places, setPlaces] = useState(initialPlaces || []);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [form, setForm] = useState(EMPTY_PLACE);

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const getToken = () =>
    localStorage.getItem('token') || localStorage.getItem('authToken') || '';

  const apiRequest = useCallback(async (endpoint, options = {}) => {
    const token = getToken();

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    const text = await response.text();
    let data = {};

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text };
    }

    if (!response.ok) {
      throw new Error(
        data.message ||
          data.error ||
          `Request failed with status ${response.status}`,
      );
    }

    return data;
  }, []);

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [placeResult, categoryResult] = await Promise.all([
        apiRequest('/places'),
        apiRequest('/categories'),
      ]);

      const loadedPlaces = unwrapList(placeResult, 'places').map(
        normalizePlace,
      );
      const loadedCategories = unwrapList(categoryResult, 'categories');

      setPlaces(loadedPlaces);
      setCategories(loadedCategories);

      if (onUpdatePlaces) {
        onUpdatePlaces(loadedPlaces);
      }
    } catch (err) {
      setError(err.message || 'Could not load places from the server.');
    } finally {
      setLoading(false);
    }
  }, [apiRequest, onUpdatePlaces]);

  useEffect(() => {
    loadData();
    console.log('AdminPanelView: Data loaded', places, categories);
  }, [loadData]);

  const filteredPlaces = useMemo(() => {
    const query = search.trim().toLowerCase();

    return places.filter((place) => {
      const matchesSearch =
        !query ||
        [
          place.name,
          place.location,
          place.district,
          place.short_description,
          place.category_name,
          getCategoryName(place.category_id ?? place.categoryId),
        ].some((value) =>
          String(value || '')
            .toLowerCase()
            .includes(query),
        );

      const matchesCategory =
        categoryFilter === 'all' ||
        String(place.category_id) === String(categoryFilter);

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && place.is_active) ||
        (statusFilter === 'inactive' && !place.is_active);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [places, search, categoryFilter, statusFilter]);

  const paginatedPlaces = filteredPlaces.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const getCategoryName = (categoryId, categoryName) => {
    // Prefer the category name returned by the backend, if available.
    if (typeof categoryName === 'string' && categoryName.trim()) {
      return categoryName;
    }

    const category = categories.find(
      (item) => String(item.id) === String(categoryId),
    );

    return category?.name || 'Uncategorized';
  };

  const openAddDialog = () => {
    setEditingId(null);
    setForm({ ...EMPTY_PLACE });
    setDialogOpen(true);
  };

  const openEditDialog = (place) => {
    setEditingId(place.id);
    setForm(normalizePlace(place));
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (saving) return;
    setDialogOpen(false);
    setEditingId(null);
    setForm({ ...EMPTY_PLACE });
  };

  const handleFieldChange = (event) => {
    const { name, value, checked, type } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError('Place name is required.');
      return;
    }

    if (!form.category_id) {
      setError('Please select a category.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const payload = buildPayload(form);

      if (editingId !== null && editingId !== undefined) {
        await apiRequest(`/places/${editingId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });

        showNotification('Place updated successfully.');
      } else {
        await apiRequest('/places', {
          method: 'POST',
          body: JSON.stringify(payload),
        });

        showNotification('Place added successfully.');
      }

      setDialogOpen(false);
      setEditingId(null);
      setForm({ ...EMPTY_PLACE });

      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to save place.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (place) => {
    const confirmed = window.confirm(
      `Delete "${place.name}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setError('');

    try {
      await apiRequest(`/places/${place.id}`, {
        method: 'DELETE',
      });

      showNotification('Place deleted successfully.');
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to delete place.');
    }
  };

  const openViewDialog = (place) => {
    setSelectedPlace(place);
    setViewOpen(true);
  };

  const renderField = (field) => {
    if (field.type === 'category') {
      return (
        <FormControl fullWidth required size="small">
          <InputLabel>{field.label}</InputLabel>
          <Select
            name={field.name}
            label={field.label}
            value={form[field.name] ?? ''}
            onChange={handleFieldChange}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }

    return (
      <TextField
        fullWidth
        size="small"
        name={field.name}
        label={field.label}
        value={form[field.name] ?? ''}
        onChange={handleFieldChange}
        required={Boolean(field.required)}
        type={field.type || 'text'}
        multiline={Boolean(field.multiline)}
        rows={field.rows || (field.multiline ? 2 : undefined)}
        inputProps={
          field.type === 'number'
            ? {
                ...(field.name === 'rating'
                  ? { min: 0, max: 5, step: 0.1 }
                  : {}),
              }
            : undefined
        }
      />
    );
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1500, mx: 'auto' }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Manage Tourist Places
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Add, update, and manage places stored in your database.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadData}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openAddDialog}
          >
            Add Place
          </Button>
        </Stack>
      </Stack>

      {error && (
        <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography color="text.secondary" variant="body2">
                Total Places
              </Typography>
              <Typography variant="h4" fontWeight={800}>
                {places.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography color="text.secondary" variant="body2">
                Active Places
              </Typography>
              <Typography variant="h4" fontWeight={800} color="success.main">
                {places.filter((place) => place.is_active).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography color="text.secondary" variant="body2">
                Categories
              </Typography>
              <Typography variant="h4" fontWeight={800}>
                {categories.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search places, districts, locations..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(0);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(event) => {
                  setCategoryFilter(event.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        {loading ? (
          <Box
            sx={{
              minHeight: 250,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <CircularProgress />
            <Typography color="text.secondary">
              Loading places from the database...
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'action.hover' }}>
                    <TableCell>Place</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>District</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginatedPlaces.map((place) => (
                    <TableRow key={place.id} hover>
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                        >
                          {place.image_url ? (
                            <Box
                              component="img"
                              src={place.image_url}
                              alt={place.name}
                              sx={{
                                width: 54,
                                height: 48,
                                objectFit: 'cover',
                                borderRadius: 1,
                                bgcolor: 'action.hover',
                              }}
                              onError={(event) => {
                                event.currentTarget.style.visibility = 'hidden';
                              }}
                            />
                          ) : (
                            <Box
                              sx={{
                                width: 54,
                                height: 48,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 1,
                                bgcolor: 'action.hover',
                              }}
                            >
                              <PlaceIcon color="action" />
                            </Box>
                          )}

                          <Box sx={{ minWidth: 0 }}>
                            <Typography fontWeight={700}>
                              {place.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                maxWidth: 280,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {place.short_description ||
                                place.location ||
                                'No description'}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        {getCategoryName(place.category_id ?? place.categoryId, place.category_name ?? place.categoryName)}
                      </TableCell>

                      <TableCell>{place.district || '—'}</TableCell>

                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                        >
                          <StarIcon
                            fontSize="small"
                            sx={{ color: 'warning.main' }}
                          />
                          {place.rating ?? '—'}
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          label={place.is_active ? 'Active' : 'Inactive'}
                          color={place.is_active ? 'success' : 'default'}
                          variant={place.is_active ? 'filled' : 'outlined'}
                        />
                      </TableCell>

                      <TableCell align="right">
                        <Tooltip title="View details">
                          <IconButton
                            color="info"
                            onClick={() => openViewDialog(place)}
                            size="small"
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Edit place">
                          <IconButton
                            color="primary"
                            onClick={() => openEditDialog(place)}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete place">
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(place)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}

                  {paginatedPlaces.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Box sx={{ py: 6, textAlign: 'center' }}>
                          <PlaceIcon
                            sx={{ fontSize: 42, color: 'text.disabled', mb: 1 }}
                          />
                          <Typography fontWeight={700}>
                            No places found
                          </Typography>
                          <Typography color="text.secondary" variant="body2">
                            Try changing your search or add a new place.
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={filteredPlaces.length}
              page={page}
              onPageChange={(_, nextPage) => setPage(nextPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(Number(event.target.value));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </>
        )}
      </Paper>

      {/* Add / Edit Place Dialog */}
      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="md">
        <Box component="form" onSubmit={handleSave}>
          <DialogTitle>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6" fontWeight={800}>
                {editingId !== null
                  ? 'Edit Tourist Place'
                  : 'Add Tourist Place'}
              </Typography>
              <IconButton onClick={closeDialog} disabled={saving}>
                <CloseIcon />
              </IconButton>
            </Stack>
          </DialogTitle>

          <Divider />

          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {FIELD_GROUPS.map((group) => (
              <Box key={group.title} sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 2 }}>
                  {group.title}
                </Typography>

                <Grid container spacing={2}>
                  {group.fields.map((field) => (
                    <Grid
                      item
                      xs={12}
                      sm={field.full ? 12 : 6}
                      key={field.name}
                    >
                      {renderField(field)}
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}

            <Divider sx={{ my: 2 }} />

            <FormControlLabel
              control={
                <Switch
                  name="is_active"
                  checked={Boolean(form.is_active)}
                  onChange={handleFieldChange}
                />
              }
              label="Place is active and visible to users"
            />
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={closeDialog} disabled={saving}>
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={saving}
              startIcon={
                saving ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <AddIcon />
                )
              }
            >
              {saving
                ? 'Saving...'
                : editingId !== null
                  ? 'Save Changes'
                  : 'Add Place'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Place Details Dialog */}
      <Dialog
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            Place Details
            <IconButton onClick={() => setViewOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          {selectedPlace && (
            <Stack spacing={1.5}>
              {selectedPlace.image_url && (
                <Box
                  component="img"
                  src={selectedPlace.image_url}
                  alt={selectedPlace.name}
                  sx={{
                    width: '100%',
                    maxHeight: 260,
                    objectFit: 'cover',
                    borderRadius: 2,
                  }}
                />
              )}

              <Typography variant="h5" fontWeight={800}>
                {selectedPlace.name}
              </Typography>

              <Typography color="text.secondary">
                {getCategoryName(selectedPlace.category_id ?? selectedPlace.categoryId, selectedPlace.category_name ?? selectedPlace.categoryName)} ·{' '}
                {selectedPlace.district || 'No district'}
              </Typography>

              <Divider />

              {[
                ['Short Description', selectedPlace.short_description],
                ['Description', selectedPlace.description],
                ['Location', selectedPlace.location],
                [
                  'Coordinates',
                  [selectedPlace.latitude, selectedPlace.longitude]
                    .filter((v) => v !== '' && v != null)
                    .join(', '),
                ],
                ['Opening Hours', selectedPlace.opening_hours],
                ['Entrance Fee', selectedPlace.entrance_fee],
                ['Transport', selectedPlace.transport_info],
                ['Travel Time', selectedPlace.travel_time],
                ['Visit Duration', selectedPlace.visit_duration],
                ['Best Time to Visit', selectedPlace.best_time],
                ['Contact', selectedPlace.contact],
                ['Elevation', selectedPlace.elevation_meters],
                ['Mining / Cultural Context', selectedPlace.mining_context],
                [
                  'Visiting Tips',
                  Array.isArray(selectedPlace.visiting_tips)
                    ? selectedPlace.visiting_tips.join(', ')
                    : selectedPlace.visiting_tips,
                ],
              ].map(([label, value]) =>
                value !== '' && value != null ? (
                  <Box key={label}>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {label}
                    </Typography>
                    <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                      {String(value)}
                    </Typography>
                  </Box>
                ) : null,
              )}

              <Box>
                <Typography variant="subtitle2" fontWeight={700}>
                  Rating
                </Typography>
                <Typography>{selectedPlace.rating ?? 'Not rated'}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" fontWeight={700}>
                  Status
                </Typography>
                <Chip
                  size="small"
                  label={selectedPlace.is_active ? 'Active' : 'Inactive'}
                  color={selectedPlace.is_active ? 'success' : 'default'}
                />
              </Box>
            </Stack>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setViewOpen(false)}>Close</Button>
          {selectedPlace && (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => {
                setViewOpen(false);
                openEditDialog(selectedPlace);
              }}
            >
              Edit Place
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={3500}
        onClose={() =>
          setNotification((previous) => ({ ...previous, open: false }))
        }
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={notification.severity}
          variant="filled"
          onClose={() =>
            setNotification((previous) => ({ ...previous, open: false }))
          }
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
