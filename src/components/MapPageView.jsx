import React from 'react';
import { Box, Typography, Button, Alert, useTheme } from '@mui/material';
import {
  Map as MapIcon,
  GridView as GridViewIcon,
  Lightbulb as LightbulbIcon,
  LocationOff as LocationOffIcon,
  MyLocation as MyLocationIcon
} from '@mui/icons-material';
import { LocationControls } from './LocationControls.jsx';
import { FilterBar } from './FilterBar.jsx';
import { PlacesMap } from './PlacesMap.jsx';

export const MapPageView = ({
  places,
  totalInBoundary,
  activePlace,
  onSelectPlace,
  center,
  centerName,
  radiusKm,
  onRadiusChange,
  onCenterChange,
  isPickingOnMap,
  onPickOnMapToggle,
  onGpsLocate,
  onResetCenter,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  plannedIds,
  onTogglePlan,
  onOpenDetails,
  onOpenDirections,
  radarMode,
  onRadarModeChange,
  isGpsLive,
  geoError,
  placesWithin25Count,
  onClearFilters,
  onNavigateToExplore
}) => {
  const theme = useTheme();

  return (
    <div className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-12 py-4">
      
      {/* Geolocation Alert (if GPS permission error occurs) */}
      {geoError && (
        <Alert
          severity="warning"
          icon={<LocationOffIcon fontSize="inherit" />}
          action={
            onGpsLocate && (
              <Button
                color="inherit"
                size="small"
                onClick={onGpsLocate}
                startIcon={<MyLocationIcon fontSize="small" />}
                sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'none' }}
              >
                Retry GPS
              </Button>
            )
          }
          sx={{ mb: 2, borderRadius: '12px' }}
        >
          {geoError}
        </Alert>
      )}

      {/* 1. Geolocation & Map Point Controls */}
      <LocationControls
        center={center}
        centerName={centerName}
        radiusKm={radiusKm}
        isPickingOnMap={isPickingOnMap}
        onPickOnMapToggle={onPickOnMapToggle}
        onGpsLocate={onGpsLocate}
        onResetCenter={onResetCenter}
        isGpsLive={isGpsLive}
        radarMode={radarMode}
        onRadarModeChange={onRadarModeChange}
        placesWithin25Count={placesWithin25Count}
      />

      {/* 2. Search, Distance Radius, Popular Tags & Category Filters */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        radiusKm={radiusKm}
        onRadiusChange={onRadiusChange}
        totalFilteredCount={places.length}
        onClearFilters={onClearFilters}
        radarMode={radarMode}
        onRadarModeChange={onRadarModeChange}
        placesWithin25Count={placesWithin25Count}
      />

      {/* 4. Main Interactive Map Canvas */}
      <div id="mapContainer" className="w-full transition-all duration-300">
        <PlacesMap
          places={places}
          activePlace={activePlace}
          onSelectPlace={onSelectPlace}
          center={center}
          centerName={centerName}
          radiusKm={radiusKm}
          onRadiusChange={onRadiusChange}
          onCenterChange={onCenterChange}
          isPickingOnMap={isPickingOnMap}
          onPickOnMapToggle={onPickOnMapToggle}
          plannedIds={plannedIds}
          onTogglePlan={onTogglePlan}
          onOpenDetails={onOpenDetails}
          onOpenDirections={onOpenDirections}
          radarMode={radarMode}
          onRadarModeChange={onRadarModeChange}
          isGpsLive={isGpsLive}
          placesWithin25Count={placesWithin25Count}
          onGpsLocate={onGpsLocate}
        />
      </div>

      {/* 5. Helpful Map Cartography Guide & Legend */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { md: 'center' },
          gap: 2,
          p: 2.5,
          mt: 2,
          mb: 4,
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.45)' : 'rgba(240, 236, 228, 0.85)',
          borderRadius: '12px',
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <LightbulbIcon sx={{ color: 'warning.main', fontSize: 22 }} />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '0.85rem' }}>
              Interactive Cartography Guide
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.785rem' }}>
              Touch any marker to calculate driving distance, admission rates, and add directly to your itinerary.
            </Typography>
          </Box>
        </Box>

        {onNavigateToExplore && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<GridViewIcon />}
            onClick={onNavigateToExplore}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.8rem',
              minHeight: 42,
              px: 2.5,
              alignSelf: { xs: 'flex-start', md: 'center' }
            }}
          >
            Switch to Cards View ({places.length} Attractions)
          </Button>
        )}
      </Box>

    </div>
  );
};
