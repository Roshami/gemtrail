import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  Tooltip,
  Divider,
  Rating,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as DuplicateIcon,
  FileDownload as ExportIcon,
  FileUpload as ImportIcon,
  RestartAlt as ResetIcon,
  Visibility as ViewIcon,
  Dashboard as DashboardIcon,
  Place as PlaceIcon,
  Settings as SettingsIcon,
  Storage as StorageIcon,
  Close as CloseIcon,
  WaterDrop as WaterDropIcon,
  Forest as ForestIcon,
  Diamond as DiamondIcon,
  AccountBalance as AccountBalanceIcon,
  Museum as MuseumIcon,
  Spa as SpaIcon,
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon,
  MyLocation as LocationIcon,
  Logout as LogoutIcon,
  VpnKey as KeyIcon,
  Lock as LockIcon,
  Shield as ShieldIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  LockReset as LockResetIcon
} from '@mui/icons-material';
import { updateAdminPassword, resetAdminCredentials } from '../utils/adminAuth.js';

const CATEGORIES = [
  { id: 'waterfalls', label: 'Waterfalls & Nature', icon: <WaterDropIcon fontSize="small" /> },
  { id: 'mines', label: 'Gem Mines & Pits', icon: <DiamondIcon fontSize="small" /> },
  { id: 'heritage', label: 'Cultural & Heritage', icon: <AccountBalanceIcon fontSize="small" /> },
  { id: 'museums', label: 'Museums & Archives', icon: <MuseumIcon fontSize="small" /> },
  { id: 'nature', label: 'Rainforest & Wildlife', icon: <ForestIcon fontSize="small" /> },
  { id: 'tea_spice', label: 'Tea & Agro-Tech', icon: <SpaIcon fontSize="small" /> }
];

const PRESET_COORDINATES = [
  { label: 'Ratnapura Clock Tower', lat: 6.6828, lng: 80.3992 },
  { label: 'Kuruvita Junction', lat: 6.7720, lng: 80.3700 },
  { label: 'Pelmadulla Town', lat: 6.6234, lng: 80.5489 },
  { label: 'Balangoda Plateau', lat: 6.6492, lng: 80.7011 },
  { label: 'Kalawana Sinharaja Gateway', lat: 6.5298, lng: 80.4078 },
  { label: 'Adam’s Peak Pilgrim Base', lat: 6.8123, lng: 80.5052 },
  { label: 'Kahawatte Gem Belt', lat: 6.5812, lng: 80.5780 }
];

const EMPTY_PLACE = {
  id: '',
  name: '',
  category: 'waterfalls',
  categoryLabel: 'Waterfalls & Nature',
  rating: 4.8,
  entranceFee: 'Free Entry',
  coordinates: { lat: 6.6828, lng: 80.3992 },
  openStatus: '• Open Now • 7:00 AM – 6:00 PM',
  shortDescription: '',
  detailedDescription: '',
  image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80',
  secondaryImage: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80',
  miningContext: '',
  elevationMeters: 150,
  visitingTips: ['Wear appropriate footwear', 'Carry water and rain gear'],
  bestTime: 'Morning (8:00 AM – 11:30 AM)',
  contact: '+94 45 222 2235 (District Tourism Information)'
};

export const AdminPanelView = ({
  places = [],
  onUpdatePlaces,
  districtInfo,
  onUpdateDistrictInfo,
  onResetPlaces,
  onNavigateToExplore,
  onNavigateToMap,
  onPreviewPlace,
  adminUser,
  onLogout
}) => {
  const theme = useTheme();

  // Active Admin Sub-tab: 0 = Landmarks, 1 = District Settings, 2 = Backup & Import, 3 = Analytics, 4 = Security
  const [activeTab, setActiveTab] = useState(0);

  // Password Change Modal State
  const [changePassOpen, setChangePassOpen] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  // Search & Filter
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  // Edit / Add Modal State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [formPlace, setFormPlace] = useState(EMPTY_PLACE);
  const [tipInput, setTipInput] = useState('');

  // Delete Confirmation State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [placeToDelete, setPlaceToDelete] = useState(null);

  // Reset Confirmation State
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  // Reset Credentials Confirmation State
  const [resetCredsConfirmOpen, setResetCredsConfirmOpen] = useState(false);

  // Import Dialog State
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState('');

  // Notification Toast
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // District Info form state
  const [districtForm, setDistrictForm] = useState(districtInfo || {});

  const showNotification = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleUpdatePassword = async (e) => {
    if (e) e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (!currentPass) {
      setPassError('Please enter your current password.');
      return;
    }
    if (!newPass || newPass.length < 4) {
      setPassError('New password must be at least 4 characters long.');
      return;
    }
    if (newPass !== confirmPass) {
      setPassError('New password and confirmation do not match.');
      return;
    }

    setPassLoading(true);
    try {
      const res = await updateAdminPassword(currentPass, newPass);
      if (res.success) {
        setPassSuccess('Administrator password updated successfully!');
        setCurrentPass('');
        setNewPass('');
        setConfirmPass('');
        showNotification('Password updated successfully!');
        setTimeout(() => {
          setChangePassOpen(false);
          setPassSuccess('');
        }, 1200);
      } else {
        setPassError(res.error || 'Failed to update password.');
      }
    } catch {
      setPassError('An unexpected error occurred.');
    } finally {
      setPassLoading(false);
    }
  };

  const handleResetAdminDefaults = () => {
    resetAdminCredentials();
    setResetCredsConfirmOpen(false);
    showNotification('Admin credentials reset to defaults (admin / admin123).');
  };

  // Filtered places for table
  const displayedPlaces = useMemo(() => {
    return places.filter((p) => {
      const matchCat = selectedCat === 'all' || p.category === selectedCat;
      const matchSearch =
        !search.trim() ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase()) ||
        p.shortDescription?.toLowerCase().includes(search.toLowerCase()) ||
        p.categoryLabel?.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [places, selectedCat, search]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = places.length;
    const catCounts = {};
    let freeCount = 0;
    let totalRating = 0;

    places.forEach((p) => {
      catCounts[p.category] = (catCounts[p.category] || 0) + 1;
      if (p.entranceFee?.toLowerCase().includes('free')) {
        freeCount++;
      }
      totalRating += Number(p.rating) || 0;
    });

    return {
      total,
      catCounts,
      freeCount,
      avgRating: total > 0 ? (totalRating / total).toFixed(2) : 0
    };
  }, [places]);

  // Handle open Add Modal
  const handleOpenAdd = () => {
    setEditingPlace(null);
    setFormPlace({
      ...EMPTY_PLACE,
      id: `site-${Date.now().toString(36)}`
    });
    setTipInput('');
    setDialogOpen(true);
  };

  // Handle open Edit Modal
  const handleOpenEdit = (place) => {
    setEditingPlace(place);
    setFormPlace({
      ...place,
      coordinates: { ...place.coordinates },
      visitingTips: place.visitingTips ? [...place.visitingTips] : []
    });
    setTipInput('');
    setDialogOpen(true);
  };

  // Handle Duplicate
  const handleDuplicate = (place) => {
    const newPlace = {
      ...place,
      id: `${place.id}-copy-${Date.now().toString(36)}`,
      name: `${place.name} (Copy)`,
      coordinates: { ...place.coordinates },
      visitingTips: place.visitingTips ? [...place.visitingTips] : []
    };
    const updated = [newPlace, ...places];
    onUpdatePlaces(updated);
    showNotification(`Duplicated "${place.name}" successfully.`);
  };

  // Handle Save (Add or Update)
  const handleSavePlace = () => {
    if (!formPlace.name.trim()) {
      showNotification('Place Name is required.', 'error');
      return;
    }

    const matchedCat = CATEGORIES.find((c) => c.id === formPlace.category);
    const finalPlace = {
      ...formPlace,
      categoryLabel: matchedCat ? matchedCat.label : formPlace.categoryLabel || 'Heritage',
      coordinates: {
        lat: Number(formPlace.coordinates.lat) || 6.6828,
        lng: Number(formPlace.coordinates.lng) || 80.3992
      },
      rating: Math.min(5, Math.max(1, Number(formPlace.rating) || 4.5)),
      elevationMeters: Number(formPlace.elevationMeters) || 100
    };

    let updated;
    if (editingPlace) {
      updated = places.map((p) => (p.id === editingPlace.id ? finalPlace : p));
      showNotification(`Updated "${finalPlace.name}" successfully.`);
    } else {
      updated = [finalPlace, ...places];
      showNotification(`Added "${finalPlace.name}" to directory.`);
    }

    onUpdatePlaces(updated);
    setDialogOpen(false);
  };

  // Handle Delete
  const handleConfirmDelete = () => {
    if (!placeToDelete) return;
    const updated = places.filter((p) => p.id !== placeToDelete.id);
    onUpdatePlaces(updated);
    showNotification(`Deleted "${placeToDelete.name}" from directory.`);
    setDeleteConfirmOpen(false);
    setPlaceToDelete(null);
  };

  // Handle Add Visiting Tip
  const handleAddTip = () => {
    if (!tipInput.trim()) return;
    setFormPlace((prev) => ({
      ...prev,
      visitingTips: [...(prev.visitingTips || []), tipInput.trim()]
    }));
    setTipInput('');
  };

  // Handle Remove Visiting Tip
  const handleRemoveTip = (index) => {
    setFormPlace((prev) => ({
      ...prev,
      visitingTips: prev.visitingTips.filter((_, i) => i !== index)
    }));
  };

  // Handle JSON Export
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(places, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `gemtrail_places_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification('Exported full landmarks dataset to JSON file.');
  };

  // Handle JSON Import
  const handleImportJson = () => {
    try {
      setImportError('');
      const parsed = JSON.parse(importJsonText);
      if (!Array.isArray(parsed)) {
        throw new Error('Root JSON must be an array of landmark objects.');
      }
      if (parsed.length === 0) {
        throw new Error('Imported array is empty.');
      }
      // Basic verification of first item
      if (!parsed[0].name || !parsed[0].coordinates) {
        throw new Error('Objects must include at least "name" and "coordinates".');
      }

      onUpdatePlaces(parsed);
      setImportDialogOpen(false);
      setImportJsonText('');
      showNotification(`Successfully imported ${parsed.length} landmarks!`);
    } catch (err) {
      setImportError(err.message || 'Invalid JSON format');
    }
  };

  // Handle Reset to Default 44 Places
  const handleResetDefaults = () => {
    onResetPlaces();
    setResetConfirmOpen(false);
    showNotification('Database successfully reset to original 44 verified sites.');
  };

  // Handle Save District Settings
  const handleSaveDistrictSettings = () => {
    if (onUpdateDistrictInfo) {
      onUpdateDistrictInfo(districtForm);
      showNotification('District metadata saved successfully.');
    }
  };

  return (
    <div className="max-w-360 mx-auto w-full px-3 sm:px-6 lg:px-10 py-6">
      
      {/* 1. Header & Navigation Bar */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.75 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                bgcolor: 'primary.main',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(45, 106, 79, 0.3)'
              }}
            >
              <DashboardIcon sx={{ fontSize: 20 }} />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontFamily: '"Literata", Georgia, serif',
                fontWeight: 800,
                color: 'text.primary',
                fontSize: { xs: '1.5rem', sm: '1.85rem' }
              }}
            >
              GemTrail Admin Control Panel
            </Typography>
            <Chip
              label="Live Database Mode"
              color="success"
              size="small"
              sx={{ fontWeight: 700, fontSize: '0.72rem' }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Maintain, edit, and curate all landmarks, GPS coordinates, entrance fees, and geological context across Sabaragamuwa.
          </Typography>
        </Box>

        {/* Quick Links & Admin Session Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          {/* Admin User Chip */}
          <Chip
            icon={<PersonIcon fontSize="small" />}
            label={adminUser?.name || 'Administrator'}
            color="default"
            variant="outlined"
            size="medium"
            sx={{
              fontWeight: 700,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
              border: `1px solid ${theme.palette.divider}`
            }}
          />

          <Button
            variant="outlined"
            size="small"
            startIcon={<KeyIcon />}
            onClick={() => setChangePassOpen(true)}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '10px' }}
          >
            Password
          </Button>

          <Button
            variant="outlined"
            size="small"
            startIcon={<ArrowBackIcon />}
            onClick={onNavigateToExplore}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '10px' }}
          >
            Back to Explore
          </Button>

          <Button
            variant="outlined"
            size="small"
            startIcon={<PlaceIcon />}
            onClick={onNavigateToMap}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '10px' }}
          >
            Map
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenAdd}
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '10px', px: 2 }}
          >
            Add Landmark
          </Button>

          {onLogout && (
            <Tooltip title="Log out from Admin Console">
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<LogoutIcon />}
                onClick={onLogout}
                sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '10px' }}
              >
                Logout
              </Button>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* 2. Top Analytics Metrics Strip */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2, mb: 4 }}>
        <Card
          elevation={0}
          sx={{
            p: 2,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.5)' : '#ffffff',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '12px'
          }}
        >
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>
            Total Landmarks Indexed
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 0.5 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
              {stats.total}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Sites in Ratnapura
            </Typography>
          </Box>
        </Card>

        <Card
          elevation={0}
          sx={{
            p: 2,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.5)' : '#ffffff',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '12px'
          }}
        >
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>
            Average Visitor Rating
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 0.5 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'warning.main' }}>
              ★ {stats.avgRating}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              out of 5.0
            </Typography>
          </Box>
        </Card>

        <Card
          elevation={0}
          sx={{
            p: 2,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.5)' : '#ffffff',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '12px'
          }}
        >
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>
            Free Public Admission
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 0.5 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'info.main' }}>
              {stats.freeCount}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Free entry sanctuaries
            </Typography>
          </Box>
        </Card>

        <Card
          elevation={0}
          sx={{
            p: 2,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.5)' : '#ffffff',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '12px'
          }}
        >
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>
            Persistent Storage State
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 0.5 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'success.main' }}>
              Local Database
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Auto-synced
            </Typography>
          </Box>
        </Card>
      </Box>

      {/* 3. Main Admin Navigation Tabs */}
      <Card
        elevation={0}
        sx={{
          mb: 3,
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.5)' : '#ffffff',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '12px'
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            px: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.875rem',
              minHeight: 48
            }
          }}
        >
          <Tab icon={<PlaceIcon fontSize="small" />} iconPosition="start" label={`Landmarks Directory (${places.length})`} />
          <Tab icon={<SettingsIcon fontSize="small" />} iconPosition="start" label="District Settings & Info" />
          <Tab icon={<StorageIcon fontSize="small" />} iconPosition="start" label="Backup, Export & Import" />
          <Tab icon={<DashboardIcon fontSize="small" />} iconPosition="start" label="Category Distribution" />
          <Tab icon={<SecurityIcon fontSize="small" />} iconPosition="start" label="Security & Admin Account" />
        </Tabs>
      </Card>

      {/* TAB 0: Landmarks Management */}
      {activeTab === 0 && (
        <Card
          elevation={0}
          sx={{
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.5)' : '#ffffff',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '12px',
            overflow: 'hidden'
          }}
        >
          {/* Controls Bar: Search & Category Filter */}
          <Box sx={{ p: 2.5, borderBottom: `1px solid ${theme.palette.divider}`, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' }, flex: 1, flexWrap: 'wrap' }}>
              <TextField
                size="small"
                placeholder="Search landmarks by name, ID or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ minWidth: { xs: '100%', sm: 300 }, flex: 1 }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                    endAdornment: search ? (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setSearch('')}>
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ) : null,
                    sx: { borderRadius: '10px' }
                  }
                }}
              />

              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Category Filter</InputLabel>
                <Select
                  value={selectedCat}
                  label="Category Filter"
                  onChange={(e) => setSelectedCat(e.target.value)}
                  sx={{ borderRadius: '10px' }}
                >
                  <MenuItem value="all">All Categories ({places.length})</MenuItem>
                  {CATEGORIES.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.label} ({stats.catCounts[c.id] || 0})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              Showing {displayedPlaces.length} of {places.length} places
            </Typography>
          </Box>

          {/* Table */}
          <TableContainer sx={{ maxHeight: 650 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800, width: 80 }}>Image</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Landmark Name & ID</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>GPS Coordinates</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Admission</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Rating</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800, pr: 3 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedPlaces.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                      No landmarks matching your search criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  displayedPlaces.map((place) => (
                    <TableRow
                      key={place.id}
                      hover
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      {/* Image Thumbnail */}
                      <TableCell>
                        <Box
                          component="img"
                          src={place.image}
                          alt={place.name}
                          sx={{
                            width: 52,
                            height: 40,
                            borderRadius: '6px',
                            objectFit: 'cover',
                            border: `1px solid ${theme.palette.divider}`
                          }}
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=300&q=80';
                          }}
                        />
                      </TableCell>

                      {/* Name & ID */}
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                          {place.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                          id: {place.id}
                        </Typography>
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        <Chip
                          label={place.categoryLabel || place.category}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.72rem',
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'
                          }}
                        />
                      </TableCell>

                      {/* Coordinates */}
                      <TableCell>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary', display: 'block' }}>
                          {place.coordinates?.lat?.toFixed(4)}° N
                        </Typography>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary', display: 'block' }}>
                          {place.coordinates?.lng?.toFixed(4)}° E
                        </Typography>
                      </TableCell>

                      {/* Admission */}
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                          {place.entranceFee || 'Free Entry'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {place.elevationMeters ? `${place.elevationMeters}m elev` : ''}
                        </Typography>
                      </TableCell>

                      {/* Rating */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: 'warning.main' }}>
                            ★ {place.rating}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Action Buttons */}
                      <TableCell align="right" sx={{ pr: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                          {onPreviewPlace && (
                            <Tooltip title="Preview Details">
                              <IconButton size="small" onClick={() => onPreviewPlace(place)} color="info">
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Edit Landmark">
                            <IconButton size="small" onClick={() => handleOpenEdit(place)} color="primary">
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Duplicate">
                            <IconButton size="small" onClick={() => handleDuplicate(place)}>
                              <DuplicateIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setPlaceToDelete(place);
                                setDeleteConfirmOpen(true);
                              }}
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* TAB 1: District Settings & Info */}
      {activeTab === 1 && (
        <Card
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 4 },
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.5)' : '#ffffff',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '12px'
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              District Metadata & Authority Configuration
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              These parameters drive header statistics, the cartographic center point, and regional heritage summaries.
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <TextField
              label="District Name"
              value={districtForm.name || ''}
              onChange={(e) => setDistrictForm({ ...districtForm, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Province & Country"
              value={districtForm.province || ''}
              onChange={(e) => setDistrictForm({ ...districtForm, province: e.target.value })}
              fullWidth
            />
            <TextField
              label="Administrative Capital"
              value={districtForm.capital || ''}
              onChange={(e) => setDistrictForm({ ...districtForm, capital: e.target.value })}
              fullWidth
            />
            <TextField
              label="Area Coverage"
              value={districtForm.areaKm2 || ''}
              onChange={(e) => setDistrictForm({ ...districtForm, areaKm2: e.target.value })}
              fullWidth
            />
            <TextField
              label="Elevation Range"
              value={districtForm.elevationRange || ''}
              onChange={(e) => setDistrictForm({ ...districtForm, elevationRange: e.target.value })}
              fullWidth
            />
            <TextField
              label="Climate Summary"
              value={districtForm.climate || ''}
              onChange={(e) => setDistrictForm({ ...districtForm, climate: e.target.value })}
              fullWidth
            />
            <TextField
              label="Gem Varieties Documented"
              type="number"
              value={districtForm.gemVarietiesCount || 75}
              onChange={(e) => setDistrictForm({ ...districtForm, gemVarietiesCount: Number(e.target.value) })}
              fullWidth
            />
            <TextField
              label="Center Latitude (°N)"
              type="number"
              value={districtForm.coordinates?.lat || 6.6828}
              onChange={(e) => setDistrictForm({
                ...districtForm,
                coordinates: { ...districtForm.coordinates, lat: Number(e.target.value) }
              })}
              fullWidth
            />
            <TextField
              label="Center Longitude (°E)"
              type="number"
              value={districtForm.coordinates?.lng || 80.3992}
              onChange={(e) => setDistrictForm({
                ...districtForm,
                coordinates: { ...districtForm.coordinates, lng: Number(e.target.value) }
              })}
              fullWidth
            />
            <TextField
              label="Gem Mining History Note"
              value={districtForm.gemMiningHistory || ''}
              onChange={(e) => setDistrictForm({ ...districtForm, gemMiningHistory: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />
          </Box>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setDistrictForm(districtInfo)}
              sx={{ textTransform: 'none' }}
            >
              Reset to Current
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveDistrictSettings}
              sx={{ textTransform: 'none', fontWeight: 700, px: 3 }}
            >
              Save District Settings
            </Button>
          </Box>
        </Card>
      )}

      {/* TAB 2: Backup, Export & Import */}
      {activeTab === 2 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          {/* Card 1: JSON Export & Download */}
          <Card
            elevation={0}
            sx={{
              p: 3,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.5)' : '#ffffff',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '12px'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <ExportIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Export Landmarks Dataset
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              Download a complete JSON snapshot containing all {places.length} active landmarks with their GPS coordinates, rich historical narratives, visitor advisories, and images.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ExportIcon />}
              onClick={handleExportJson}
              sx={{ textTransform: 'none', fontWeight: 700 }}
            >
              Download places.json ({places.length} Items)
            </Button>
          </Card>

          {/* Card 2: JSON Import */}
          <Card
            elevation={0}
            sx={{
              p: 3,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.5)' : '#ffffff',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '12px'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <ImportIcon color="secondary" />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Import Landmarks Dataset
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              Paste or upload a valid JSON array of landmark objects to batch-update or replace the directory dataset.
            </Typography>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<ImportIcon />}
              onClick={() => {
                setImportJsonText('');
                setImportError('');
                setImportDialogOpen(true);
              }}
              sx={{ textTransform: 'none', fontWeight: 700 }}
            >
              Open JSON Import Modal
            </Button>
          </Card>

          {/* Card 3: Factory Reset */}
          <Card
            elevation={0}
            sx={{
              p: 3,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.5)' : '#ffffff',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '12px',
              gridColumn: { md: 'span 2' }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <ResetIcon color="error" />
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'error.main' }}>
                Reset to Original 44 Verified Landmarks
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.5 }}>
              Restore the pristine factory seed of all 44 canonical Sabaragamuwa landmarks (Bopath Ella, Delgamuwa, Batatota Lena, Maha Saman Devalaya, Sinharaja, etc.) if custom modifications need to be cleared.
            </Typography>
            <Button
              variant="outlined"
              color="error"
              startIcon={<ResetIcon />}
              onClick={() => setResetConfirmOpen(true)}
              sx={{ textTransform: 'none', fontWeight: 700 }}
            >
              Reset to Factory Database
            </Button>
          </Card>
        </Box>
      )}

      {/* TAB 3: Category Distribution Analytics */}
      {activeTab === 3 && (
        <Card
          elevation={0}
          sx={{
            p: 3.5,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.5)' : '#ffffff',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '12px'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
            Category Portfolio Breakdown
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            Distribution of documented attractions across the thematic gems of Sabaragamuwa.
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2.5 }}>
            {CATEGORIES.map((cat) => {
              const count = stats.catCounts[cat.id] || 0;
              const percentage = stats.total > 0 ? ((count / stats.total) * 100).toFixed(1) : 0;
              return (
                <Box
                  key={cat.id}
                  sx={{
                    p: 2.5,
                    borderRadius: '10px',
                    border: `1px solid ${theme.palette.divider}`,
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.4)' : 'rgba(250, 246, 240, 0.8)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {cat.icon}
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {cat.label}
                      </Typography>
                    </Box>
                    <Chip label={`${count} Sites`} size="small" color="primary" sx={{ fontWeight: 700 }} />
                  </Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Represents {percentage}% of indexed attractions
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Card>
      )}

      {/* TAB 4: Admin Security & Account */}
      {activeTab === 4 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          {/* Card 1: Administrator Profile */}
          <Card
            elevation={0}
            sx={{
              p: 3,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.5)' : '#ffffff',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '12px'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <ShieldIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Administrator Account
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.5 }}>
              Active authenticated session details and privileges for the Sabaragamuwa GIS database.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75, borderBottom: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Account Role:</Typography>
                <Chip label={adminUser?.role || 'Super Administrator'} size="small" color="success" sx={{ fontWeight: 700 }} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75, borderBottom: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Admin Name:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{adminUser?.name || 'District Administrator'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75, borderBottom: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Username / Identifier:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{adminUser?.username || 'admin'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75, borderBottom: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Official Email:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{adminUser?.email || 'admin@gemtrail.lk'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75, borderBottom: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Department:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{adminUser?.department || 'Sabaragamuwa Tourism Bureau'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Session Security:</Typography>
                <Chip icon={<CheckCircleIcon fontSize="small" />} label="SHA-256 Token Active" size="small" variant="outlined" color="primary" />
              </Box>
            </Box>

            {onLogout && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={onLogout}
                sx={{ textTransform: 'none', fontWeight: 700 }}
              >
                Log Out of Current Session
              </Button>
            )}
          </Card>

          {/* Card 2: Password Management */}
          <Card
            elevation={0}
            sx={{
              p: 3,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.5)' : '#ffffff',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '12px'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <KeyIcon color="secondary" />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Change Administrator Password
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.5 }}>
              Update your administrative master password. Changes persist in your secured browser storage.
            </Typography>

            {passError && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setPassError('')}>
                {passError}
              </Alert>
            )}

            {passSuccess && (
              <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                {passSuccess}
              </Alert>
            )}

            <form onSubmit={handleUpdatePassword}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Current Password"
                  type="password"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  fullWidth
                  size="small"
                  required
                />
                <TextField
                  label="New Password (min 4 characters)"
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  fullWidth
                  size="small"
                  required
                />
                <TextField
                  label="Confirm New Password"
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  fullWidth
                  size="small"
                  required
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={passLoading}
                  startIcon={<KeyIcon />}
                  sx={{ textTransform: 'none', fontWeight: 700, mt: 1 }}
                >
                  {passLoading ? 'Updating Password...' : 'Save New Password'}
                </Button>
              </Box>
            </form>
          </Card>

          {/* Card 3: Credential Reset & Factory Restore */}
          <Card
            elevation={0}
            sx={{
              p: 3,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.5)' : '#ffffff',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '12px',
              gridColumn: { md: 'span 2' }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <LockResetIcon color="warning" />
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'warning.main' }}>
                Reset Admin Credentials to Factory Defaults
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.5 }}>
              If you forget your updated password, you can restore default credentials (`admin` / `admin123`).
            </Typography>
            <Button
              variant="outlined"
              color="warning"
              startIcon={<LockResetIcon />}
              onClick={() => setResetCredsConfirmOpen(true)}
              sx={{ textTransform: 'none', fontWeight: 700 }}
            >
              Reset Credentials to Default
            </Button>
          </Card>
        </Box>
      )}

      {/* ========================================================================= */}
      {/* DIALOG: ADD / EDIT LANDMARK                                               */}
      {/* ========================================================================= */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '16px', maxHeight: '90vh' }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontFamily: '"Literata", Georgia, serif', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{editingPlace ? `Edit Landmark: ${editingPlace.name}` : 'Add New Sabaragamuwa Landmark'}</span>
          <IconButton size="small" onClick={() => setDialogOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            
            {/* Row 1: ID & Name */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr' }, gap: 2 }}>
              <TextField
                label="Landmark Name *"
                value={formPlace.name}
                onChange={(e) => setFormPlace({ ...formPlace, name: e.target.value })}
                required
                fullWidth
              />
              <TextField
                label="Unique Slug / ID *"
                value={formPlace.id}
                onChange={(e) => setFormPlace({ ...formPlace, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                required
                fullWidth
                helperText="URL-friendly identifier"
              />
            </Box>

            {/* Row 2: Category, Entrance Fee, Rating */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formPlace.category}
                  label="Category"
                  onChange={(e) => {
                    const catObj = CATEGORIES.find((c) => c.id === e.target.value);
                    setFormPlace({
                      ...formPlace,
                      category: e.target.value,
                      categoryLabel: catObj ? catObj.label : formPlace.categoryLabel
                    });
                  }}
                >
                  {CATEGORIES.map((c) => (
                    <MenuItem key={c.id} value={c.id}>{c.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Entrance Fee"
                value={formPlace.entranceFee}
                onChange={(e) => setFormPlace({ ...formPlace, entranceFee: e.target.value })}
                placeholder="e.g. Free Entry or LKR 100"
                fullWidth
              />

              <TextField
                label="Visitor Rating (1.0 - 5.0)"
                type="number"
                inputProps={{ step: 0.1, min: 1, max: 5 }}
                value={formPlace.rating}
                onChange={(e) => setFormPlace({ ...formPlace, rating: Number(e.target.value) })}
                fullWidth
              />
            </Box>

            {/* Row 3: GPS Coordinates & Quick Presets */}
            <Box sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)', borderRadius: '10px', border: `1px solid ${theme.palette.divider}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationIcon color="primary" fontSize="small" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    GPS Cartography Coordinates
                  </Typography>
                </Box>

                {/* Preset Dropdown */}
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Select Regional Preset</InputLabel>
                  <Select
                    label="Select Regional Preset"
                    value=""
                    onChange={(e) => {
                      const found = PRESET_COORDINATES.find((p) => p.label === e.target.value);
                      if (found) {
                        setFormPlace({
                          ...formPlace,
                          coordinates: { lat: found.lat, lng: found.lng }
                        });
                      }
                    }}
                  >
                    {PRESET_COORDINATES.map((p) => (
                      <MenuItem key={p.label} value={p.label}>{p.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
                <TextField
                  label="Latitude (°N)"
                  type="number"
                  inputProps={{ step: 0.0001 }}
                  value={formPlace.coordinates.lat}
                  onChange={(e) => setFormPlace({
                    ...formPlace,
                    coordinates: { ...formPlace.coordinates, lat: Number(e.target.value) }
                  })}
                  fullWidth
                />
                <TextField
                  label="Longitude (°E)"
                  type="number"
                  inputProps={{ step: 0.0001 }}
                  value={formPlace.coordinates.lng}
                  onChange={(e) => setFormPlace({
                    ...formPlace,
                    coordinates: { ...formPlace.coordinates, lng: Number(e.target.value) }
                  })}
                  fullWidth
                />
                <TextField
                  label="Elevation (meters)"
                  type="number"
                  value={formPlace.elevationMeters || 100}
                  onChange={(e) => setFormPlace({ ...formPlace, elevationMeters: Number(e.target.value) })}
                  fullWidth
                />
              </Box>
            </Box>

            {/* Row 4: Descriptions */}
            <TextField
              label="Short Description (Card Summary) *"
              value={formPlace.shortDescription}
              onChange={(e) => setFormPlace({ ...formPlace, shortDescription: e.target.value })}
              multiline
              rows={2}
              fullWidth
              helperText="Brief summary shown on landmark cards and search results"
            />

            <TextField
              label="Detailed Historical & Ecological Chronicle"
              value={formPlace.detailedDescription}
              onChange={(e) => setFormPlace({ ...formPlace, detailedDescription: e.target.value })}
              multiline
              rows={4}
              fullWidth
              helperText="In-depth narrative shown on the expanded detail modal"
            />

            {/* Row 5: Mining Context & Timings */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                label="Geological / Gem Mining Context"
                value={formPlace.miningContext || ''}
                onChange={(e) => setFormPlace({ ...formPlace, miningContext: e.target.value })}
                fullWidth
                helperText="Alluvial gravels, corundum types, river panning context"
              />

              <TextField
                label="Opening Hours / Status"
                value={formPlace.openStatus || ''}
                onChange={(e) => setFormPlace({ ...formPlace, openStatus: e.target.value })}
                placeholder="• Open Now • 7:00 AM – 6:00 PM"
                fullWidth
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                label="Best Visiting Time"
                value={formPlace.bestTime || ''}
                onChange={(e) => setFormPlace({ ...formPlace, bestTime: e.target.value })}
                placeholder="Morning (8:00 AM – 11:30 AM)"
                fullWidth
              />

              <TextField
                label="Official Contact Information"
                value={formPlace.contact || ''}
                onChange={(e) => setFormPlace({ ...formPlace, contact: e.target.value })}
                placeholder="+94 45 222 3411 (Custodian Office)"
                fullWidth
              />
            </Box>

            {/* Row 6: Image URLs */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                label="Primary Image URL"
                value={formPlace.image}
                onChange={(e) => setFormPlace({ ...formPlace, image: e.target.value })}
                fullWidth
              />

              <TextField
                label="Secondary Gallery Image URL"
                value={formPlace.secondaryImage || ''}
                onChange={(e) => setFormPlace({ ...formPlace, secondaryImage: e.target.value })}
                fullWidth
              />
            </Box>

            {/* Image Preview */}
            {formPlace.image && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  component="img"
                  src={formPlace.image}
                  alt="Primary Preview"
                  sx={{ width: 100, height: 60, borderRadius: '8px', objectFit: 'cover' }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Live Image Preview Check
                </Typography>
              </Box>
            )}

            {/* Row 7: Visiting Tips Array */}
            <Box sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)', borderRadius: '10px', border: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Visitor Advisories & Practical Tips ({formPlace.visitingTips?.length || 0})
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                <TextField
                  size="small"
                  placeholder="Enter tip (e.g. Best light for photography is early morning)"
                  value={tipInput}
                  onChange={(e) => setTipInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTip(); } }}
                  fullWidth
                />
                <Button variant="outlined" onClick={handleAddTip} sx={{ textTransform: 'none', px: 2 }}>
                  Add Tip
                </Button>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formPlace.visitingTips?.map((tip, idx) => (
                  <Chip
                    key={idx}
                    label={tip}
                    onDelete={() => handleRemoveTip(idx)}
                    size="small"
                    sx={{ maxWidth: '100%' }}
                  />
                ))}
              </Box>
            </Box>

          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, px: 3 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSavePlace}
            sx={{ textTransform: 'none', fontWeight: 700, px: 3 }}
          >
            {editingPlace ? 'Save Changes' : 'Create Landmark'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================================================================= */}
      {/* DIALOG: DELETE CONFIRMATION                                               */}
      {/* ========================================================================= */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Are you sure you want to permanently delete <strong>{placeToDelete?.name}</strong> from the database?
            This will immediately remove it from Explore, Map, and the Trip Planner.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteConfirmOpen(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleConfirmDelete} sx={{ textTransform: 'none', fontWeight: 700 }}>
            Yes, Delete Landmark
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================================================================= */}
      {/* DIALOG: RESET FACTORY CONFIRMATION                                        */}
      {/* ========================================================================= */}
      <Dialog open={resetConfirmOpen} onClose={() => setResetConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: 'error.main' }}>Reset Database to Factory Defaults?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            This will clear any custom landmarks added or edited in this browser and restore the official 44 verified landmarks of the Ratnapura Gem Belt.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setResetConfirmOpen(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleResetDefaults} sx={{ textTransform: 'none', fontWeight: 700 }}>
            Confirm Reset
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================================================================= */}
      {/* DIALOG: JSON IMPORT                                                       */}
      {/* ========================================================================= */}
      <Dialog open={importDialogOpen} onClose={() => setImportDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Import Landmarks (JSON Array)</span>
          <IconButton size="small" onClick={() => setImportDialogOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {importError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {importError}
            </Alert>
          )}
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
            Paste raw JSON array of landmarks below:
          </Typography>
          <TextField
            multiline
            rows={12}
            fullWidth
            value={importJsonText}
            onChange={(e) => setImportJsonText(e.target.value)}
            placeholder={`[\n  {\n    "id": "bopath-ella",\n    "name": "Bopath Ella Waterfall",\n    "category": "waterfalls",\n    "coordinates": { "lat": 6.7925, "lng": 80.3702 },\n    "rating": 4.8\n  }\n]`}
            slotProps={{
              input: {
                sx: { fontFamily: 'monospace', fontSize: '0.8rem' }
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setImportDialogOpen(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleImportJson}
            disabled={!importJsonText.trim()}
            sx={{ textTransform: 'none', fontWeight: 700 }}
          >
            Import JSON Data
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================================================================= */}
      {/* DIALOG: CHANGE ADMIN PASSWORD                                             */}
      {/* ========================================================================= */}
      <Dialog
        open={changePassOpen}
        onClose={() => setChangePassOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontFamily: '"Literata", Georgia, serif', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Change Admin Password</span>
          <IconButton size="small" onClick={() => setChangePassOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {passError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setPassError('')}>
              {passError}
            </Alert>
          )}
          {passSuccess && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
              {passSuccess}
            </Alert>
          )}

          <Box component="form" onSubmit={handleUpdatePassword} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Current Password"
              type="password"
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
              fullWidth
              autoFocus
              required
            />
            <TextField
              label="New Password"
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              fullWidth
              required
              helperText="Minimum 4 characters"
            />
            <TextField
              label="Confirm New Password"
              type="password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              fullWidth
              required
            />
            <DialogActions sx={{ px: 0, pb: 0 }}>
              <Button onClick={() => setChangePassOpen(false)} sx={{ textTransform: 'none' }}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={passLoading}
                sx={{ textTransform: 'none', fontWeight: 700 }}
              >
                {passLoading ? 'Updating...' : 'Update Password'}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* DIALOG: CONFIRM RESET ADMIN CREDENTIALS                                   */}
      {/* ========================================================================= */}
      <Dialog
        open={resetCredsConfirmOpen}
        onClose={() => setResetCredsConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: 'warning.main' }}>
          Reset Admin Credentials?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            This will restore the factory master credentials:
          </Typography>
          <Box sx={{ p: 1.5, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)', borderRadius: '8px' }}>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 700 }}>
              Username: admin<br />
              Password: admin123 (or admin)
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setResetCredsConfirmOpen(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={handleResetAdminDefaults}
            sx={{ textTransform: 'none', fontWeight: 700 }}
          >
            Confirm Reset
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Toast */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%', fontWeight: 600, borderRadius: '10px' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

    </div>
  );
};
