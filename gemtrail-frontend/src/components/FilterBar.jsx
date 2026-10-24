import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  Chip,
  Button,
  useTheme,
  CircularProgress,
  Tooltip
} from '@mui/material';

import {
  Search as SearchIcon,
  Close as CloseIcon,
  Map as MapIcon,
  WaterDrop as WaterDropIcon,
  Forest as ForestIcon,
  Diamond as DiamondIcon,
  AccountBalance as AccountBalanceIcon,
  Museum as MuseumIcon,
  Spa as SpaIcon,
  Place as PlaceIcon
} from '@mui/icons-material';

const APP_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const API_URL = `${APP_API_URL}/api`;

const getArray = (response) => {
  const body = response?.data;

  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body?.categories)) return body.categories;
  if (Array.isArray(body?.places)) return body.places;
  if (Array.isArray(body?.results)) return body.results;

  return [];
};

const getCategoryIcon = (name = '') => {
  const value = name.toLowerCase();

  if (value.includes('waterfall') || value.includes('water')) {
    return <WaterDropIcon sx={{ fontSize: 16 }} />;
  }

  if (
    value.includes('nature') ||
    value.includes('forest') ||
    value.includes('wildlife')
  ) {
    return <ForestIcon sx={{ fontSize: 16 }} />;
  }

  if (value.includes('gem') || value.includes('mine')) {
    return <DiamondIcon sx={{ fontSize: 16 }} />;
  }

  if (
    value.includes('heritage') ||
    value.includes('cultural') ||
    value.includes('temple')
  ) {
    return <AccountBalanceIcon sx={{ fontSize: 16 }} />;
  }

  if (value.includes('museum')) {
    return <MuseumIcon sx={{ fontSize: 16 }} />;
  }

  if (
    value.includes('tea') ||
    value.includes('agro') ||
    value.includes('garden')
  ) {
    return <SpaIcon sx={{ fontSize: 16 }} />;
  }

  return <PlaceIcon sx={{ fontSize: 16 }} />;
};

export const FilterBar = ({
  searchQuery = '',
  onSearchChange,
  selectedCategory = 'all',
  onCategoryChange,
  radiusKm = 25,
  onRadiusChange,
  totalFilteredCount,
  onClearFilters,
  radarMode = 'radar',
  onRadarModeChange,
  placesWithin25Count = 0,
  onOpenMapPage,
  onNavigateToCards
}) => {
  const theme = useTheme();

  const [categories, setCategories] = useState([]);
  const [places, setPlaces] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingPlaces, setLoadingPlaces] = useState(true);
  const [categoryError, setCategoryError] = useState('');
  const [placeError, setPlaceError] = useState('');

  // Load categories and places from the backend.
  useEffect(() => {
    let active = true;

    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        setCategoryError('');

        const response = await axios.get(`${API_URL}/categories`);
        const data = getArray(response);

        if (active) setCategories(data);
      } catch (error) {
        if (active) {
          setCategoryError('Could not load categories.');
          console.error('Failed to load categories:', error);
        }
      } finally {
        if (active) setLoadingCategories(false);
      }
    };

    const loadPlaces = async () => {
      try {
        setLoadingPlaces(true);
        setPlaceError('');

        const response = await axios.get(`${API_URL}/places`);
        const data = getArray(response);

        if (active) setPlaces(data);
      } catch (error) {
        if (active) {
          setPlaceError('Could not load popular searches.');
          console.error('Failed to load places:', error);
        }
      } finally {
        if (active) setLoadingPlaces(false);
      }
    };

    loadCategories();
    loadPlaces();

    return () => {
      active = false;
    };
  }, []);

  // Use category IDs returned by the database.
  const categoryOptions = useMemo(
    () => [
      {
        id: 'all',
        label: 'All Sites',
        icon: <PlaceIcon sx={{ fontSize: 16 }} />
      },
      ...categories.map((category) => ({
        id: String(category.id),
        label: category.name,
        icon: getCategoryIcon(category.name)
      }))
    ],
    [categories]
  );

  // Generate popular search suggestions from active places.
  // Prefer highly rated places, then fill the list with other places.
  const popularSearches = useMemo(() => {
    const activePlaces = places.filter(
      (place) => place.is_active === undefined || Boolean(Number(place.is_active))
    );

    const sortedPlaces = [...activePlaces].sort(
      (a, b) => Number(b.rating || 0) - Number(a.rating || 0)
    );

    const uniquePlaces = [];
    const seen = new Set();

    sortedPlaces.forEach((place) => {
      const name = String(place.name || '').trim();
      const key = name.toLowerCase();

      if (name && !seen.has(key)) {
        seen.add(key);
        uniquePlaces.push(name);
      }
    });

    return uniquePlaces.slice(0, 6);
  }, [places]);

  const handleCategoryChange = (categoryId) => {
    onCategoryChange?.(categoryId);
  };

  const handleRadiusChange = (event) => {
    const value = Number(event.target.value);

    onRadiusChange?.(value);

    if (value === 25) {
      onRadarModeChange?.('radar');
    } else {
      onRadarModeChange?.('all');
    }
  };

  const handleClearFilters = () => {
    if (onClearFilters) {
      onClearFilters();
    } else {
      onSearchChange?.('');
      onCategoryChange?.('all');
      onRadiusChange?.(25);
      onRadarModeChange?.('radar');
    }
  };

  const isDark = theme.palette.mode === 'dark';

  return (
    <Card
      elevation={0}
      sx={{
        mb: 3,
        bgcolor: isDark
          ? 'rgba(30, 41, 59, 0.45)'
          : 'rgba(245, 241, 234, 0.85)',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: '12px'
      }}
    >
      <CardContent
        sx={{
          p: { xs: 1.5, sm: 2.5 },
          '&:last-child': {
            pb: { xs: 1.5, sm: 2.5 }
          }
        }}
      >
        {/* Search, distance and map */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: onOpenMapPage
              ? { xs: '1fr', md: '6fr 3fr 3fr' }
              : { xs: '1fr', sm: '7fr 5fr' },
            gap: 2,
            mb: 2
          }}
        >
          <TextField
            id="searchInput"
            size="small"
            fullWidth
            value={searchQuery}
            onChange={(event) => onSearchChange?.(event.target.value)}
            placeholder="Search places, waterfalls, temples..."
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{ color: 'text.secondary', fontSize: 20 }}
                    />
                  </InputAdornment>
                ),
                endAdornment: searchQuery ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      aria-label="Clear search"
                      onClick={() => onSearchChange?.('')}
                    >
                      <CloseIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </InputAdornment>
                ) : null,
                sx: {
                  bgcolor: isDark
                    ? 'rgba(15, 23, 42, 0.5)'
                    : '#ffffff',
                  borderRadius: 2.5,
                  fontSize: '0.85rem'
                }
              }
            }}
          />

          <FormControl size="small" fullWidth>
            <Select
              id="radiusSelect"
              value={Number(radiusKm)}
              onChange={handleRadiusChange}
              sx={{
                bgcolor: isDark
                  ? 'rgba(15, 23, 42, 0.5)'
                  : '#ffffff',
                borderRadius: 2.5,
                fontSize: '0.8125rem',
                fontWeight: 700
              }}
            >
              <MenuItem value={25}>
                🎯 25km Live Radar ({placesWithin25Count} Sites)
              </MenuItem>
              <MenuItem value={15}>Within 15 km</MenuItem>
              <MenuItem value={30}>Within 30 km</MenuItem>
              <MenuItem value={60}>Within 60 km</MenuItem>
              <MenuItem value={100}>Entire District (All Sites)</MenuItem>
            </Select>
          </FormControl>

          {onOpenMapPage && (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<MapIcon />}
              onClick={onOpenMapPage}
              sx={{
                minHeight: 44,
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.8rem',
                textTransform: 'none',
                bgcolor: isDark
                  ? 'rgba(15, 23, 42, 0.5)'
                  : '#ffffff',
                borderColor: theme.palette.divider,
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: isDark
                    ? 'rgba(74, 222, 128, 0.1)'
                    : 'rgba(45, 106, 79, 0.08)'
                }
              }}
            >
              Open Interactive Map
            </Button>
          )}
        </Box>

        {/* Dynamic categories */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: 'text.secondary',
              textTransform: 'uppercase',
              mr: 0.5,
              fontSize: '0.7rem'
            }}
          >
            Categories:
          </Typography>

          {loadingCategories ? (
            <CircularProgress size={18} />
          ) : (
            categoryOptions.map((category) => {
              const isSelected =
                String(selectedCategory) === category.id;

              return (
                <Chip
                  key={category.id}
                  icon={category.icon}
                  label={category.label}
                  clickable
                  onClick={() => handleCategoryChange(category.id)}
                  color={isSelected ? 'primary' : 'default'}
                  variant={isSelected ? 'filled' : 'outlined'}
                  size="small"
                  sx={{
                    minHeight: 38,
                    fontWeight: isSelected ? 800 : 600,
                    fontSize: '0.775rem',
                    borderRadius: '12px',
                    px: 0.5,
                    bgcolor: isSelected
                      ? undefined
                      : isDark
                        ? 'rgba(15, 23, 42, 0.4)'
                        : '#ffffff',
                    borderColor: isSelected
                      ? undefined
                      : theme.palette.divider
                  }}
                />
              );
            })
          )}

          {categoryError && (
            <Typography variant="caption" color="error">
              {categoryError}
            </Typography>
          )}
        </Box>

        {/* Popular searches generated from database places */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 1,
            mt: 1.5,
            pt: 1.5,
            borderTop: `1px dashed ${theme.palette.divider}`
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: 'text.secondary',
              textTransform: 'uppercase',
              fontSize: '0.675rem'
            }}
          >
            Popular Searches:
          </Typography>

          {loadingPlaces ? (
            <CircularProgress size={16} />
          ) : popularSearches.length > 0 ? (
            popularSearches.map((term) => {
              const isSelected =
                searchQuery.trim().toLowerCase() === term.toLowerCase();

              return (
                <Tooltip key={term} title={`Search for ${term}`}>
                  <Chip
                    label={term}
                    size="small"
                    onClick={() => onSearchChange?.(term)}
                    clickable
                    variant="outlined"
                    sx={{
                      borderRadius: '8px',
                      fontSize: '0.725rem',
                      fontWeight: 600,
                      bgcolor: isSelected
                        ? 'primary.main'
                        : 'transparent',
                      color: isSelected
                        ? '#ffffff'
                        : 'text.secondary',
                      borderColor: isSelected
                        ? 'primary.main'
                        : theme.palette.divider,
                      '&:hover': {
                        borderColor: 'primary.main',
                        color: isSelected
                          ? '#ffffff'
                          : 'primary.main'
                      }
                    }}
                  />
                </Tooltip>
              );
            })
          ) : (
            <Typography variant="caption" color="text.secondary">
              {placeError || 'No places available.'}
            </Typography>
          )}
        </Box>

        {/* Results count and clear filters */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
            mt: 2
          }}
        >
          {totalFilteredCount !== undefined && (
            <Typography variant="caption" color="text.secondary">
              {totalFilteredCount} places found
            </Typography>
          )}

          <Button
            size="small"
            onClick={handleClearFilters}
            startIcon={<CloseIcon />}
            sx={{
              textTransform: 'none',
              fontWeight: 700
            }}
          >
            Clear Filters
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FilterBar;