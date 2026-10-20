import React from 'react';
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
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Map as MapIcon,
  GridView as GridViewIcon,
  WaterDrop as WaterDropIcon,
  Forest as ForestIcon,
  Diamond as DiamondIcon,
  AccountBalance as AccountBalanceIcon,
  Museum as MuseumIcon,
  Spa as SpaIcon,
  Place as PlaceIcon,
  Radar as RadarIcon
} from '@mui/icons-material';

export const FilterBar = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  radiusKm,
  onRadiusChange,
  totalFilteredCount,
  onClearFilters,
  radarMode = 'radar',
  onRadarModeChange,
  placesWithin25Count,
  onOpenMapPage,
  onNavigateToCards
}) => {
  const theme = useTheme();

  const categories = [
    { id: 'all', label: 'All Sites', icon: <PlaceIcon sx={{ fontSize: 16 }} /> },
    { id: 'waterfalls', label: 'Waterfalls', icon: <WaterDropIcon sx={{ fontSize: 16 }} /> },
    { id: 'nature', label: 'Nature & Wildlife', icon: <ForestIcon sx={{ fontSize: 16 }} /> },
    { id: 'mines', label: 'Gem Mines & Pits', icon: <DiamondIcon sx={{ fontSize: 16 }} /> },
    { id: 'heritage', label: 'Temples & Heritage', icon: <AccountBalanceIcon sx={{ fontSize: 16 }} /> },
    { id: 'museums', label: 'Museums', icon: <MuseumIcon sx={{ fontSize: 16 }} /> },
    { id: 'tea_spice', label: 'Tea & Agro-Tech', icon: <SpaIcon sx={{ fontSize: 16 }} /> }
  ];

  return (
    <Card
      elevation={0}
      sx={{
        mb: 3,
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.45)' : 'rgba(245, 241, 234, 0.85)',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: '12px'
      }}
    >
      <CardContent sx={{ p: { xs: 1.5, sm: 2.5 }, '&:last-child': { pb: { xs: 1.5, sm: 2.5 } } }}>
        
        {/* Top Controls Row: Search + Distance + Optional View Mode */}
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
          
          {/* Search TextField */}
          <TextField
            id="searchInput"
            size="small"
            fullWidth
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search mines, waterfalls, temples, gem sites..."
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: searchQuery ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => onSearchChange('')} aria-label="Clear Search">
                      <CloseIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </InputAdornment>
                ) : null,
                sx: {
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.5)' : '#ffffff',
                  borderRadius: 2.5,
                  fontSize: '0.85rem'
                }
              }
            }}
          />

          {/* Radius Selector */}
          <FormControl size="small" fullWidth>
            <Select
              id="radiusSelect"
              value={radarMode === 'radar' ? 25 : radiusKm}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val === 25) {
                  if (onRadarModeChange) onRadarModeChange('radar');
                } else {
                  if (onRadarModeChange) onRadarModeChange('all');
                }
                onRadiusChange(val);
              }}
              sx={{
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.5)' : '#ffffff',
                borderRadius: 2.5,
                fontSize: '0.8125rem',
                fontWeight: 700
              }}
            >
              <MenuItem value={25} sx={{ fontWeight: 700, color: 'secondary.main' }}>
                🎯 25km Live Radar ({placesWithin25Count || 0} Sites)
              </MenuItem>
              <MenuItem value={15}>Within 15 km</MenuItem>
              <MenuItem value={30}>Within 30 km</MenuItem>
              <MenuItem value={60}>Within 60 km</MenuItem>
              <MenuItem value={100}>Entire District (All 44 Sites)</MenuItem>
            </Select>
          </FormControl>

          {/* View on Map Shortcut Button */}
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
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.5)' : '#ffffff',
                borderColor: theme.palette.divider,
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(45, 106, 79, 0.08)'
                }
              }}
            >
              Open Interactive Map
            </Button>
          )}

        </Box>

        {/* Category Interactive Filter Buttons with segmented styling */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', mr: 0.5, fontSize: '0.7rem' }}>
            Categories:
          </Typography>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <Chip
                key={cat.id}
                icon={cat.icon}
                label={cat.label}
                clickable
                onClick={() => onCategoryChange(cat.id)}
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
                    : theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.4)' : '#ffffff',
                  borderColor: isSelected ? undefined : theme.palette.divider,
                  '&:hover': {
                    bgcolor: isSelected ? undefined : (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)')
                  }
                }}
              />
            );
          })}
        </Box>

        {/* Popular Searches Quick Tags from Hero */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mt: 1.5, pt: 1.5, borderTop: `1px dashed ${theme.palette.divider}` }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.675rem' }}>
            Popular Searches:
          </Typography>
          {['Bopath Ella', 'Kahawatte', 'Saman Devalaya', 'Kirindi Falls'].map((term) => (
            <Chip
              key={term}
              label={term}
              size="small"
              onClick={() => onSearchChange(term)}
              clickable
              variant="outlined"
              sx={{
                borderRadius: '8px',
                fontSize: '0.725rem',
                fontWeight: 600,
                cursor: 'pointer',
                bgcolor: searchQuery === term ? 'primary.main' : 'transparent',
                color: searchQuery === term ? '#fff' : 'text.secondary',
                borderColor: searchQuery === term ? 'primary.main' : theme.palette.divider,
                '&:hover': {
                  borderColor: 'primary.main',
                  color: 'primary.main'
                }
              }}
            />
          ))}
        </Box>

      </CardContent>
    </Card>
  );
};
